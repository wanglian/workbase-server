AvatarFiles = new FilesCollection({
  collectionName: 'avatar-files',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 2MB
    if (file.size <= 1024*1024*2) {
      return true;
    }
    // only in png/jpg/jpeg formats
    if (/png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload file, with size equal or less than 2MB';
  }
});