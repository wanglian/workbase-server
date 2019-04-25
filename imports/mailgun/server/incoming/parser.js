// import SimpleSchema from 'simpl-schema';
// const REGEX_EMAIL = SimpleSchema.RegEx.Email;

// check: one-one email
isOneToOne = (toUser, toUsers, ccUsers) => {
  let users = _.compact(_.concat([toUser], toUsers, ccUsers));
  let userIds = _.uniq(users.map((u) => u._id));
  if (userIds.length === 2 && (!ccUsers || ccUsers.length === 0)) {
    // bcc/forward
    if (toUsers && toUsers.length === 1) return true;
  }
  return userIds.length === 1;
};
// query thread between users
findThreadIdBetweenUsers = (from, to) => {
  let threadIds = ThreadUsers.find({userType: from.className(), userId: from._id}).map((tu) => tu.threadId);
  let tu = ThreadUsers.findOne({threadId: {$in: threadIds}, userType: to.className(), userId: to._id});
  return tu && tu.threadId;
};
// mailgun auth URL
const URL = Npm.require('url');
const authURL = (url) => {
  let re = URL.parse(url);
  re.auth = "api:" + Instance.get().modules.email.mailgun.key;
  return re.format();
};
// promise
const uploadFile = (url, name, params) => {
  return new Promise((resolve, reject) => {
    Files.load(url, {
      fileName: name,
      meta: params
    }, (err, fileRef) => {
      if (err) {
        reject(err.toString());
      } else {
        let fileId = fileRef._id;
        let url    = Files.link(fileRef);
        resolve({fileId, url});
      }
    }, true);
  });
};

parseMailgunEmail = async (doc) => {
  // console.log("[mailgun] parse - " + doc.emailId);
  let params      = doc.params;
  let subject     = params['subject'];
  let from        = params['from'];
  let to          = params['To'];
  let cc          = params['Cc'];
  let bcc         = params['Bcc'];
  let recipient   = params['recipient'];
  let bodyHtml    = params['body-html'];
  let bodyPlain   = params['body-plain'];
  let replyTo     = params['In-Reply-To'];
  let date        = params['Date'];
  let references  = params['References'];
  let emailId     = params['Message-Id'];
  let attachments = params['attachments'];
  let cidMap      = params['content-id-map'];
  let variables   = params['X-Mailgun-Variables'];

  let fromUser = Contacts.parseOne(from);
  let toUser   = Contacts.parseOne(recipient);
  if (!toUser) throw new Error(`recipient not exist: ${recipient}`);

  // === grouping thread
  let threadId;
  // 1 references & replyTo
  references = references && references.split(' ') || [];
  if (replyTo) references = _.union(references, [replyTo]);
  if (!_.isEmpty(references)) {
    let message = Messages.findOne({emailId: {$in: references}});
    threadId    = message && message.threadId;
  }
  if (!threadId) {
    // 2 noreply
    if (fromUser.noreply()) {
      threadId = findThreadIdBetweenUsers(fromUser, toUser);
    }
  }
  let toUsers = to && to.match(/@/) && Contacts.parse(to);
  let ccUsers = cc && Contacts.parse(cc);
  let is121 = isOneToOne(toUser, toUsers, ccUsers);
  if (!threadId) {
    // 3 one-one emails
    if (is121) {
      let tu = ThreadUsers.findOne({category: "Chat", userType: 'Users', userId: toUser._id, "params.chat": fromUser._id});
      threadId = tu && tu.threadId;
      threadId = Threads.startChat(fromUser, toUser);
    }
  }
  if (!threadId) {
    threadId = Threads.create(fromUser, 'Email', subject);
  }
  let thread = Threads.findOne(threadId);

  // === thread users
  if (is121) {
    Threads.ensureMember(thread, fromUser, {chat: toUser._id, internal: toUser.internal()});
    Threads.ensureMember(thread, toUser, {chat: fromUser._id, internal: fromUser.internal()});
  } else {
    Threads.ensureMember(thread, fromUser);
    Threads.ensureMember(thread, toUser);
    toUsers && toUsers.forEach((user) => Threads.ensureMember(thread, user));
    ccUsers && ccUsers.forEach((user) => Threads.ensureMember(thread, user));
  }

  // === content
  let content = bodyHtml;
  let contentType = 'html';
  if (!content) {
    content = bodyPlain;
    contentType = 'text';
  }

  // === attachments
  let fileIds = [];
  let inlineFileIds = [];
  if (attachments) {
    attachments = JSON.parse(attachments);
    // cid
    if (cidMap) {
      cidMap = JSON.parse(cidMap);
      _.each(cidMap, (url, cid) => {
        let index = attachments.findIndex((a) => { return a.url === url; });
        // <RqCqStfKSrKJLrgE4.jpeg>
        attachments[index].cid = cid.match(/<(.*?)>/i)[1];
      });
    }
    // upload
    attachments.map((attachment, index) => {
      // attachment: url,name,content-type,size
      try {
        // cid
        let type = 'file';
        let regex;
        if (attachment.cid) {
          regex = new RegExp("cid:" + attachment.cid, 'g');
          if (regex.test(content)) {
            type = 'inline';
          }
        }
        let {fileId, url} = await uploadFile(authURL(attachment.url), attachment.name, {
          relations: [
            {
              threadId,
              type,
              userType:  'Contacts',
              userId:    fromUser._id,
              createdAt: new Date()
            }
          ]
        });
        if (type === 'inline') {
          inlineFileIds.push(fileId);
          content = content.replace(regex, url);
          // delete attachments[index];
        } else {
          fileIds.push(fileId);
        }
      } catch(e) {
        console.log("[mailgun] upload error: ");
        console.log(e);
      }
    });
  }

  // === customized
  if (variables) {
    variables = JSON.parse(variables);
    let messageType = variables['MessageType'];
    switch (messageType) {
    case 'image':
      contentType = 'image';
      content = bodyPlain;
      break;
    case 'text':
      contentType = 'text';
      content = bodyPlain
      break;
    default:
      //
    }
  }

  // === update subject
  // 1 Email
  // 2 Start from external
  if (thread.category === 'Email' || (thread.userType === 'Contacts')) {
    Threads.update(threadId, {$set: {subject}});
  }

  // console.log("save message");
  Threads.addMessage(thread, fromUser, {
    content,
    contentType,
    fileIds,
    inlineFileIds,
    emailId,
    internal: false,
    email: { subject, from, to, cc, bcc, date }
  });

  // remove the origin email
  MailgunEmails.remove(doc._id);
  return true;
};
