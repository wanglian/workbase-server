Files = new FilesCollection({
  collectionName: 'files',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 50MB
    if (file.size <= 1024 * 1024 * 50) {
      return true;
    }
    // only in png/jpg/jpeg formats
    // if (/png|jpg|jpeg/i.test(file.extension)) {
    //   return true;
    // }
    return 'Please upload file, with size equal or less than 50MB';
  }
});

// Files.collection.helpers({
//   user() {
//     return Users.findOne(this.userId);
//   }
// });

export {Files};
