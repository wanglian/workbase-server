const emailParser = require('address-rfc2822');

export const parseEmailAddress = (emails) => {
  // purge
  emails = purgeEmails(emails);
  let result;
  try {
    result = emailParser.parse(emails);
  } catch (e) {
    // 将邮箱之间的逗号分割符替换成特殊的分隔符，以便split分割
    let splitSparator = '#%&';
    // emailSuffix: @ + domain
    let emailSuffix = '@(?:[\\w](?:[\\w-]*[\\w])?\.)+[\\w](?:[\\w-]*[\\w])?';
    // eg. aaa@bb.com, ccc@dd.com  替换成 aaa@bb.com#%& ccc@dd.com 
    let splitSparatorRegex = new RegExp(emailSuffix + '>?(\\s*,)', 'g');
    let formattedEmails = emails.replace(splitSparatorRegex, (match, p1) => {
      return match.replace(p1, splitSparator);
    });

    let _emails = formattedEmails.split(splitSparator);
    result = [];

    _.each(_emails, (email) => {
      result.push(formattedAddr(email));
    });
  }
  return result;
};

const purgeEmails = (emails) => {
  emails = emails.trim();
  // ending with ',': 'abc@example.com,'
  let length = emails.length;
  if (emails[length-1] == ',') {
    emails = emails.substring(0, length - 1);
  }
  // names with '@': abc@example.com <abc@example.com>
  // TODO
  return emails;
};

/**
 * Parse one irregular email address
 * @param   {String} email
 * @return  {Object}
 * https://github.com/jackbowman/email-addresses/issues/13
 */
const emailRegex = "[\\w]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?";
const formattedAddr = (email) => {
  // 规范化Email地址 给别名加上双引号
  let regex = new RegExp("^[^\"|\'].*(?=<" + emailRegex + ">)");
  return emailParser.parse(email.replace(regex, '"' + '$&'.trim() + '" '));
};
