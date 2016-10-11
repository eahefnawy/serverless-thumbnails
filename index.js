'use strict';

const BbPromise = require('bluebird');
const rp = require('request-promise');
const gm = require('gm').subClass({imageMagick: true});
const path = require('path');
const tmpFile = path.join(require('os').tmpdir(), 'overwrite');
const fs = require('fs');
const shortid = require('shortid');
const AWS = require('aws-sdk');
const s3 = BbPromise.promisifyAll(new AWS.S3());

BbPromise.promisifyAll(gm.prototype);

module.exports = {
  generateThumbnail(url) {
    return rp({
      uri: url,
      encoding: null,
    }) //gm.thumb forces u to output file :(
    .then((body) => BbPromise.all([gm(body), gm(body).thumbAsync(100, 100, tmpFile, 85, 'center')]))
    .spread((img) => fs.readFileSync(tmpFile))
    .then((imgBuffer) => this.uploadToS3(imgBuffer));
  },

  uploadToS3(imgBuffer) {
    console.log(process.env.THUMBNAILS_BUCKET)
    console.log(JSON.stringify(AWS.config, null, 4))
    const imgBucket = process.env.THUMBNAILS_BUCKET;
    const key = ['thumbnails', shortid.generate() + '.jpg'].join('/');
    const params = {
        Bucket: imgBucket,
        Key: key,
        ACL: 'public-read',
        Body: imgBuffer,
        ContentType: 'image/jpeg'
    };

    return s3.putObjectAsync(params)
      .then(() => `https://${s3.endpoint.hostname}/${imgBucket}/${key}`)
  }
};



