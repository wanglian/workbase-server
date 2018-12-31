import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import Grid from 'gridfs-stream';
import { MongoInternals } from 'meteor/mongo';
import fs from 'fs';

let gfs;
if (Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}

const uploadToGridFS = (collection, fileRef) => {
  Object.keys(fileRef.versions).forEach(versionName => {
    const metadata = {versionName, imageId: fileRef._id, storedAt: new Date()}; // Optional
    const writeStream = gfs.createWriteStream({filename: fileRef.name, metadata});

    fs.createReadStream(fileRef.versions[versionName].path).pipe(writeStream);

    writeStream.on('close', Meteor.bindEnvironment(file => {
      const property = `versions.${versionName}.meta.gridFsFileId`;

      // If we store the ObjectID itself, Meteor (EJSON?) seems to convert it to a
      // LocalCollection.ObjectID, which GFS doesn't understand.
      collection.update(fileRef._id, { $set: { [property]: file._id.toString() } });
      collection.unlink(collection.findOne(fileRef._id), versionName); // Unlink files from FS
    }));
  });
};

const streamFromGridFS = (collection, http, fileRef, version) => {
  // Serve file from GridFS
  const _id = (fileRef.versions[version] && fileRef.versions[version].meta || {}).gridFsFileId;
  if (_id) {
    const readStream = gfs.createReadStream({ _id });
    readStream.on('error', err => { throw err; });
    readStream.pipe(http.response);
  }
  return Boolean(_id); // Serve file from either GridFS or FS if it wasn't uploaded yet
};

const removeFromGridFS = (collection, search) => {
  let cursor = collection.collection.find(search);
  cursor.forEach(fileRef => {
    Object.keys(fileRef.versions).forEach(versionName => {
      const _id = (fileRef.versions[versionName].meta || {}).gridFsFileId;
      if (_id) gfs.remove({ _id }, err => { if (err) throw err; });
    });
  });
};

export default {
  upload: uploadToGridFS,
  stream: streamFromGridFS,
  remove: removeFromGridFS
};
