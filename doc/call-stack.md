# Call Stack

- Channel - ChannelUser
- Thread  - ThreadUser
- Message

## Models

### Messages

before.insert
- model/server/hooks: createdAt/internal/contentType/summary
- chat/server/hooks: Threads.ensureMember
- channel/server/hooks: email.from
after.insert
- charts/server/hooks: MessageRecords.insert
- cordova/server/hooks: app push
- email/server/hooks: send email
- files/server/hooks: updateRelations
before.update
- none
after.update
- channel/server/hooks: ThreadUsers.update {read: true}

### Threads

before.insert
- model/server/hooks: scope/createdAt/updatedAt
- channel/server/hooks: scope
after.insert
- none
before.update
- model/server/hooks: updatedAt
after.update
- none

### ThreadUsers

before.insert
- model/server/hooks: createdAt/updatedAt
after.insert
- none
before.update
- model/server/hooks: updatedAt
after.update
- none

## Functions

Thread.addMessage
- Messages.insert
- Threads.update
- ThreadUsers.update x2

Threads.create
- Threads.insert

Threads.ensureMember
- ThreadUsers.insert

Contacts.parse/parseOne
- Contacts.insert

## Methods

sendMessage
- Thread.addMessage

addComment Shared
- Threads.addMessage

sendEmail
- Contacts.parse
- Threads.create
- Threads.ensureMember
- Threads.addMessage

sendLiveChat
- Contacts.parseOne
- Threads.create
- Threads.ensureMember
- Threads.addMessage

parseEmail
- Contacts.parseOne
- Contacts.parse
- Threads.create
- Threads.ensureMember
- Threads.addMessage
