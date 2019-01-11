import S3Client from 'aws-sdk/clients/s3'; /* http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html */
/* See fs-extra and graceful-fs NPM packages */
/* For better i/o performance */
import fs from 'fs';
import stream from 'stream';
import moment from 'moment';

/* Example: S3='{"s3":{"key": "xxx", "secret": "xxx", "bucket": "xxx", "region": "xxx""}}' meteor */
// if (process.env.S3) {
//   Meteor.settings.s3 = JSON.parse(process.env.S3).s3;
// }

const bound  = Meteor.bindEnvironment((callback) => {
  return callback();
});

let s3Conf, s3Client;

const setupS3 = () => {
  let modules = Instance.get().modules;
  let storage = modules && modules.storage;
  if (storage && storage.type === 'S3') {
    s3Conf = storage.s3;

    /* Check settings existence */
    /* This is the best practice for app security */
    if (!s3Conf || !s3Conf.key || !s3Conf.secret || !s3Conf.bucket || !s3Conf.region) {
      throw new Meteor.Error(401, 'Missing Meteor file settings');
    }

    // Create a new S3 object
    s3Client = new S3Client({
      secretAccessKey: s3Conf.secret,
      accessKeyId: s3Conf.key,
      region: s3Conf.region,
      // sslEnabled: true, // optional
      httpOptions: {
        timeout: 6000,
        agent: false
      }
    });
  }
};

const uploadToS3 = (collection, fileRef) => {
  let now = moment();
  let [year, month, day] = [now.year(), now.month() + 1, now.date()];
  // Run through each of the uploaded file
  let randomId = Random.id();
  _.each(fileRef.versions, (vRef, version) => {
    // We use Random.id() instead of real file's _id
    // to secure files from reverse engineering on the AWS client
    let filePath = `files/${year}/${month}/${day}/` + randomId + '-' + version + '.' + fileRef.extension;

    // Create the AWS:S3 object.
    // Feel free to change the storage class from, see the documentation,
    // `STANDARD_IA` is the best deal for low access files.
    // Key is the file name we are creating on AWS:S3, so it will be like files/XXXXXXXXXXXXXXXXX-original.XXXX
    // Body is the file stream we are sending to AWS
    s3Client.putObject({
      // ServerSideEncryption: 'AES256', // Optional
      StorageClass: 'STANDARD',
      Bucket: s3Conf.bucket,
      Key: filePath,
      Body: fs.createReadStream(vRef.path),
      ContentType: vRef.type,
    }, (error) => {
      bound(() => {
        if (error) {
          console.log("[Files] S3 upload error:");
          console.error(error);
        } else {
          // Update FilesCollection with link to the file at AWS
          let upd = { $set: {} };
          upd['$set']['versions.' + version + '.meta.pipePath'] = filePath;

          collection.collection.update({
            _id: fileRef._id
          }, upd, (updError) => {
            if (updError) {
              console.error(updError);
            } else {
              // Unlink original files from FS after successful upload to AWS:S3
              collection.unlink(collection.collection.findOne(fileRef._id), version);
            }
          });
        }
      });
    });
  });
};

const streamFromS3 = (collection, http, fileRef, version) => {
  let path;
  if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
    path = fileRef.versions[version].meta.pipePath;
  }
  if (!path) return false;

  // If file is successfully moved to AWS:S3
  // We will pipe request to AWS:S3
  // So, original link will stay always secure

  // To force ?play and ?download parameters
  // and to keep original file name, content-type,
  // content-disposition, chunked "streaming" and cache-control
  // we're using low-level .serve() method
  let opts = {
    Bucket: s3Conf.bucket,
    Key: path
  };

  if (http.request.headers.range) {
    let vRef  = fileRef.versions[version];
    let range = _.clone(http.request.headers.range);
    let array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    let start = parseInt(array[1]);
    let end   = parseInt(array[2]);
    if (isNaN(end)) {
      // Request data from AWS:S3 by small chunks
      end     = (start + collection.chunkSize) - 1;
      if (end >= vRef.size) {
        end   = vRef.size - 1;
      }
    }
    opts.Range = `bytes=${start}-${end}`;
    http.request.headers.range = `bytes=${start}-${end}`;
  }

  let fileColl = collection;
  s3Client.getObject(opts, function(error) {
    if (error) {
      console.error(error);
      if (!http.response.finished) {
        http.response.end();
      }
    } else {
      if (http.request.headers.range && this.httpResponse.headers['content-range']) {
        // Set proper range header in according to what is returned from AWS:S3
        http.request.headers.range = this.httpResponse.headers['content-range'].split('/')[0].replace('bytes ', 'bytes=');
      }

      let dataStream = new stream.PassThrough();
      fileColl.serve(http, fileRef, fileRef.versions[version], version, dataStream);
      dataStream.end(this.data.Body);
    }
  });
  return true;
};

const removeFromS3 = (collection, search) => {
  let cursor = collection.collection.find(search);
  cursor.forEach((fileRef) => {
    _.each(fileRef.versions, (vRef) => {
      if (vRef && vRef.meta && vRef.meta.pipePath) {
        // Remove the object from AWS:S3 first, then we will call the original FilesCollection remove
        s3Client.deleteObject({
          Bucket: s3Conf.bucket,
          Key: vRef.meta.pipePath,
        }, (error) => {
          bound(() => {
            if (error) {
              console.error(error);
            }
          });
        });
      }
    });
  });
};

export default {
  setup:  setupS3,
  upload: uploadToS3,
  stream: streamFromS3,
  remove: removeFromS3
};
