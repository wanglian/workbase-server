import { StorageBase }   from "./base";
import { StorageGridFS } from "./gridfs";
import { StorageS3 }     from "./s3";

export class Storage {
  static setup() {
    let instance = Instance.get();
    let storage = instance && instance.modules && instance.modules.storage;
    if (storage) {
      switch (storage.type) {
      case "S3":
        Storage.engine = new StorageS3(storage.s3);
        break;
      case "GridFS":
        Storage.engine = new StorageGridFS();
        break;
      default:
        throw "Not supported storage: " + storage.type;
      }
    } else {
      Storage.engine = new StorageBase();
    }
  }
  static client() {
    if (!Storage.engine) {
      Storage.setup();
    }
    return Storage.engine;
  }
}
