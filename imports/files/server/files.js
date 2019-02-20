// - meta.relations: [{}]
//   - threadId
//   - messageId
//   - userType
//   - userId
//   - type: file/inline
//   - createdAt

import Storage from './storage';
import createThumbnails from './image-processing';

Files = new FilesCollection({
  debug: false, // Change to `true` for debugging
  collectionName: 'files',
  storagePath() {
    let dir = process.env.UPLOADS_DIR;
    return (dir && `${dir}/files`) || "assets/app/uploads/files";
  },
  allowClientCode: false, // Disallow remove files from Client
  // Start moving files to Storage
  // after fully received by the Meteor server
  onAfterUpload(fileRef) {
    try {
      // Run `createThumbnails` only over PNG, JPG and JPEG files
      if (/png|jpe?g/i.test(fileRef.extension || '')) {
        createThumbnails(this, fileRef, {width: 800, name: 'thumbnail'}, (error, fileRef) => {
          if (error) {
            console.log("[Files] resize image error:");
            console.error(error);
          } else {
            Storage.upload(this, fileRef);
          }
        });
        createThumbnails(this, fileRef, {width: 2048, name: 'preview'}, (error, fileRef) => {
          if (error) {
            console.log("[Files] resize image error:");
            console.error(error);
          } else {
            Storage.upload(this, fileRef);
          }
        });
      } else {
        Storage.upload(this, fileRef);
      }
    } catch(error) {
      console.log("[Files] after upload error:");
      console.error(error);
    }
  },
  // Intercept access to the file
  // And redirect request to Storage
  interceptDownload(http, fileRef, version) {
    return Storage.stream(this, http, fileRef, version);
  }
});

// Intercept FilesCollection's remove method to remove file from Storage
let _origRemove = Files.remove;

Files.remove = function(search) {
  Storage.remove(this, search);

  //remove original file from database
  _origRemove.call(this, search);
};
