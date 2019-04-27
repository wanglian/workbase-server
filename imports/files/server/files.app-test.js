import { resetDatabase } from "meteor/xolvio:cleaner";
import fs from 'fs';
import "/imports/test/test-helpers";
import "/imports/test/server/generate-data.app-test";
import "./index";

Factory.define("file", Files.collection, { });

describe("Files", function() {
  let user, file;

  beforeEach(function() {
    resetDatabase();
    let instance = createInstance();
    user = Users.findOne(instance.adminId);
  });

  describe("when mesage removed", function() {
    let thread, message;

    beforeEach(function() {
      thread = Factory.create("thread", {userId: user._id});
      file = Factory.create("file", {meta: {relations: [{
        threadId: thread._id,
        userType: "Users",
        userId: user._id,
        type: "file"
      }]}});
      message = Factory.create("message", {userId: user._id, threadId: thread._id, fileIds: [file._id]});
      // mock
      Files.remove = (id) => {
        Files.collection.remove(id);
      };
    });

    it("should remove the file", function() {
      Messages.remove(message._id);
      file = Files.collection.findOne(file._id);
      should.not.exist(file);
    });

    it("should not remove the file if relations still exist", function() {
      Factory.create("message", {userId: user._id, threadId: thread._id, fileIds: [file._id]});
      Messages.remove(message._id);
      file = Files.collection.findOne(file._id);
      should.exist(file);
    });
  });
});