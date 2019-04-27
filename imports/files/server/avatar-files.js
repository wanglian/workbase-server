import { Storage } from './storage';
import createThumbnails from './image-processing';

let client = Storage.client();

AvatarFiles = new FilesCollection({
  debug: false, // Change to `true` for debugging
  collectionName: 'avatar-files',
  storagePath() {
    let dir = process.env.UPLOADS_DIR;
    return (dir && `${dir}/avatar-files`) || "assets/app/uploads/avatars-files";
  },
  allowClientCode: false, // Disallow remove files from Client
  // Start moving files to AWS:S3
  // after fully received by the Meteor server
  onAfterUpload(fileRef) {
    try {
      // Run `createThumbnails` only over PNG, JPG and JPEG files
      if (/png|jpe?g/i.test(fileRef.extension || '')) {
        createThumbnails(this, fileRef, [{width: 180, crop: true, name: 'thumbnail'}]).then(() => {
          client.upload(this, fileRef);
        });
      } else {
        client.upload(this, fileRef);
      }
    } catch(error) {
      console.log("[Files] after upload error:");
      console.error(error);
    }
  },
  // Intercept access to the file
  // And redirect request to AWS:S3
  interceptDownload(http, fileRef, version) {
    let path;

    if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
      path = fileRef.versions[version].meta.pipePath;
    }

    if (path) {
      return client.stream(this, http, fileRef, version, path);
    }
    // While file is not yet uploaded to AWS:S3
    // It will be served file from FS
    return false;
  }
});

// Intercept FilesCollection's remove method to remove file from AWS:S3
let _origRemove = AvatarFiles.remove;
AvatarFiles.remove = function(search) {
  client.remove(this, search);

  //remove original file from database
  _origRemove.call(this, search);
};
