const request = require('request');
const MailgunClient = require('mailgun-js');
const moment = require('moment');

Mailgun = {
  setup(key, domain) {
    /* Check settings existence */
    /* This is the best practice for app security */
    if (!key || !domain) {
      throw new Meteor.Error(401, 'Missing Mailgun settings');
    }
    Mailgun.client = MailgunClient({apiKey: key, domain});
  },
  validate(domain) {
    return new Promise((resolve, reject) => {
      Mailgun.client.domains(domain).info((err, res) => {
        if (err && err.statusCode == 401) {
          // console.log(err.statusCode);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
};

Meteor.startup(function() {
  let instance = Instance.get();
  let modules = instance && instance.modules;
  let email = modules && modules.email;
  email && email.type == 'mailgun' && Mailgun.setup(email.mailgun.key, instance.domain);
});

const buildMailgunAttachment = (file) => {
  return new Mailgun.client.Attachment({
    data:        request({encoding: null, url: Files.link(file)}),
    filename:    file.name,
    contentType: file.type,
    knownLength: file.size
  });
};

const buildSubject = (thread, message) => {
  let subject = thread.subject;
  if (thread.category === 'Chat') {
    let parentMessage = message.parent();
    let user = message.user();
    subject = parentMessage && parentMessage.email && parentMessage.email.subject || I18n.getFixedT(user.profile.language)("email_message_from_who", {user: user.name()});
  }
  return subject;
};

const buildTextContent = (message) => {
  let content = message.content;
  let p = message.parent();
  if (p) {
    content = content + `\r\n\r\n> ${moment(message.createdAt).format('YYYY-MM-DD HH:mm')}, ${_.escape(p.user().address())}: \r\n` + p.summary.replace(/^\s*[\r\n]/gm, ' ');
  }
  return content;
};

const buildHTMLContent = (message) => {
  let content = Markdown(message.content);
  let type = 'html';

  switch(message.contentType) {
  case 'image':
    let image = message.image;
    content = content + `<br/><img src="cid:${image.name}.${image.extension}"/>`;
  default:
    let p = message.parent();
    if (p) {
      content = content + `<br/>${moment(message.createdAt).format('YYYY-MM-DD HH:mm')}, ${_.escape(p.user().address())}: <blockquote style="padding:0 10px;margin:0;border-left:2px solid #ddd;">${p.content}</blockquote>`;
    }
  }

  let user = message.user();
  return content + '<br/><br/>' + Markdown(user.signature());
};

Mailgun.send = (message) => {
  Messages.update(message._id, {$set: {"email.state": 'sending'}});

  let threadId = message.threadId;
  let thread = Threads.findOne(threadId);
  let contacts = thread.externalMembers();
  contacts = _.reject(contacts, c => c.noreply());

  if (!_.isEmpty(contacts)) {
    let user = message.user();

    let params = {
      from:    (message.email && message.email.from) || user.address(),
      to:      contacts.map(c => c.address()),
      subject: buildSubject(thread, message)
    };

    switch (message.contentType) {
    case 'image':
      let image = message.image();
      _.extend(params, {
        text: message.content,
        html: buildHTMLContent(message),
        inline: buildMailgunAttachment(image),
        'v:MessageType': 'image'
      });
      break;
    case 'html':
      _.extend(params, {
        html: buildHTMLContent(message)
      });
      break;
    default:
      _.extend(params, {
        text: buildTextContent(message),
        html: buildHTMLContent(message),
        'v:MessageType': 'text'
      });
    }

    // attachments
    let files = message.files();
    if (files && files.count() > 0) {
      _.extend(params, {
        attachment: files.map(file => buildMailgunAttachment(file))
      });
    }

    // "h:Reply-To" last message
    let last = Messages.findOne({threadId, emailId: {$exists: true}}, {sort: {createdAt: -1}});
    let replyTo = last && last.emailId;
    if (replyTo) {
      _.extend(params, {"h:In-Reply-To": replyTo});
    }

    // "h:References"

    Mailgun.client.messages().send(params, Meteor.bindEnvironment((err, result) => {
      if (err) {
        Messages.update(message._id, {$set: {
          "email.state": 'failed'
        }});
        throw new Error(err);
      } else {
        Messages.update(message._id, {$set: {
          internal:        false,
          emailId:         result["id"],
          "email.state":   "ok",
          "email.subject": params.subject,
          "email.from":    params.from,
          "email.to":      params.to.join(", ")
        }});
      }
    }));
  }
};