import S3 from './s3';

Storage = {
  type: 'local',
  options: {},
  addOption(type, definition) {
    this.options[type] = definition;
  },
  load(type) {
    let t = this.options[type];
    if (t) {
      console.log("[Files] use storage: " + type);
      this.type = type;
      this.upload = t.upload;
      this.stream = t.stream;
      this.remove = t.remove;
    } else {
      console.log("[Files] use local file system");
    }
  },
  upload(collection, fileRef) {
    console.log("saved in local file system");
    return true;
  },
  stream(collection, http, fileRef, version, path) {
    console.log("stream from local file system");
    return false;
  },
  remove(collection, search) {
    console.log("remove from local file system");
    return true;
  }
};

Storage.addOption('S3', S3);

let modules = Meteor.settings.modules;
if (modules) {
  Storage.load(modules.storage);
}

export default Storage;
