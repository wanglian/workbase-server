const request = require('request');
const MailgunClient = require('mailgun-js');

const signature = (user, content, contentType) => {
  let signature = user.signature();
  if (contentType != 'text') {
    signature = Markdown(signature);
  }
  return content + '\r\n\r\n' + signature;
};

Mailgun = {
  setup() {
    let instance = Instance.get();
    let modules = instance && instance.modules;
    let email = modules && modules.email;
    if (email && email.type === 'mailgun') {
      Mailgun.api_key = email.mailgun.key;
      Mailgun.domain = Instance.domain();

      /* Check settings existence */
      /* This is the best practice for app security */
      if (!Mailgun.api_key || !Mailgun.domain) {
        throw new Meteor.Error(401, 'Missing Mailgun settings');
      }

      Mailgun.client = MailgunClient({apiKey: Mailgun.api_key, domain: Mailgun.domain});
    }
  }
};

Meteor.startup(function() {
  Mailgun.setup();
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
    let tu = ThreadUsers.findOne({threadId: thread._id, userType: 'Users', userId: message.userId});
    let chat = Users.findOne(tu.params.chat);
    let parentMessage = message.parent();
    let user = message.user();
    subject = parentMessage && parentMessage.email && parentMessage.email.subject || I18n.getFixedT(user.profile.language)("Message from", {user: user.name()});
  }
  return subject;
};
Mailgun.send = (message) => {
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
        html: signature(user, `<img src="cid:${image.name}.${image.extension}"/>`, 'image'),
        inline: buildMailgunAttachment(image),
        'v:MessageType': 'image'
      });
      break;
    case 'html':
      _.extend(params, {
        html: signature(user, message.content, 'html') // Markdown(message.content): 需要html邮件模板
      });
      break;
    default:
      _.extend(params, {
        text: signature(user, message.content, 'text'), // Markdown(message.content): 需要html邮件模板
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

    console.log("[mailgun] send email: ")
    console.log(params);
    Mailgun.client.messages().send(params, Meteor.bindEnvironment((err, result) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log(result);
        Messages.update(message._id, {$set: {
          internal:        false,
          emailId:         result["id"],
          "email.subject": params.subject,
          "email.from":    params.from,
          "email.to":      params.to.join(", ")
        }});
      }
    }));
  }
};