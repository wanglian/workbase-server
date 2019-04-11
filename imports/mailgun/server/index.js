import '../mailgun-emails';
import './outgoing/mailgun';
import './incoming';

MailgunEmails._ensureIndex({emailId: 1});
