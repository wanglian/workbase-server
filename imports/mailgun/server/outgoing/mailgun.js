const request = require('request');

const signature = (user, content) => {
  return content + '\r\n\r\n' + user.signature();
};

Mailgun = {
  api_key: Meteor.settings.mailgun.key,
  domain:  Meteor.settings.public.domain,
};
Mailgun.client = require('mailgun-js')({apiKey: Mailgun.api_key, domain: Mailgun.domain});

const buildMailgunAttachment = (file) => {
  return new Mailgun.client.Attachment({
    data:        request({encoding: null, url: Files.link(file)}),
    filename:    file.name,
    contentType: file.type,
    knownLength: file.size
  });
};
Mailgun.send = (message) => {
  let threadId = message.threadId;
  let contacts = ThreadUsers.find({threadId, userType: 'Contacts'}).map(tu => Contacts.findOne(tu.userId));
  contacts = _.reject(contacts, (c) => {return c.noreply;});

  if (!_.isEmpty(contacts)) {
    let thread = Threads.findOne(threadId);
    let user = message.user();

    let params = {
      from:    (message.email && message.email.from) || user.address(),
      to:      contacts.map(c => c.address()),
      subject: thread.subject
    };

    switch (message.contentType) {
    case 'image':
      let image = message.image();
      _.extend(params, {
        html: signature(user, `<img src="cid:${image.name}.${image.extension}"/>`),
        inline: buildMailgunAttachment(image),
        'v:MessageType': 'image'
      });
      break;
    default:
      _.extend(params, {
        text: signature(user, message.content) // Markdown(message.content): 需要html邮件模板
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
          internal: false,
          emailId: result["id"],
          email: {
            from: params.from,
            to:   params.to.join(", ")
          }
        }});
      }
    }));
  }
};