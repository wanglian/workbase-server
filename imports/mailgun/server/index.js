import '../mailgun-emails';
import './outgoing/mailgun';
import './incoming';

MailgunEmails.rawCollection().createIndex({emailId: 1});
