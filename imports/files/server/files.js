// - meta.relations: [{}]
//   - threadId
//   - messageId
//   - userType
//   - userId
//   - type: file/inline
//   - createdAt

import createThumbnails from './image-processing';
import S3 from './s3';

Files = new FilesCollection({
  debug: false, // Change to `true` for debugging
  collectionName: 'files',
  storagePath: '/tmp/workbase/uploads/files',
  allowClientCode: false, // Disallow remove files from Client
  // Start moving files to AWS:S3
  // after fully received by the Meteor server
  onAfterUpload(fileRef) {
    // Run `createThumbnails` only over PNG, JPG and JPEG files
    if (/png|jpe?g/i.test(fileRef.extension || '')) {
      createThumbnails(this, fileRef, (error, fileRef) => {
        if (error) {
          console.error(error);
        } else {
          S3.upload(this, fileRef);
        }
      });
    } else {
      S3.upload(this, fileRef);
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
      S3.stream(this, http, fileRef, version, path);

      return true;
    }
    // While file is not yet uploaded to AWS:S3
    // It will be served file from FS
    return false;
  }
});

// Intercept FilesCollection's remove method to remove file from AWS:S3
let _origRemove = Files.remove;
Files.remove = function(search) {
  S3.remove(this, search);

  //remove original file from database
  _origRemove.call(this, search);
};
