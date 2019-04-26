export class StorageBase {
  constructor() { }
  upload(collection, fileRef) {
    console.log("saved in local file system");
    return true;
  }
  stream(collection, http, fileRef, version, path) {
    console.log("stream from local file system");
    return false;
  }
  remove(collection, search) {
    console.log("remove from local file system");
    return true;
  }
}