'use strict';

require('dotenv').config();

const lib = require('./');

// Your first function handler
module.exports.thumbnail = (event, context, callback) => {

  if (!event.url || typeof event.url !== 'string') {
    callback(new Error('Please provide an image url'));
  }

  if (!process.env.THUMBNAILS_BUCKET) {
    callback(new Error('Please provide a THUMBNAILS_BUCKET env var'));
  }

  return lib.generateThumbnail(event.url)
    .then(thumbnailUrl => {
      const body = {
        message: 'Success! Here is your thumbnail image:',
        thumbnailUrl: thumbnailUrl,
      };

      const response = {
        statusCode: 200,
        body: JSON.stringify(body),
      };

      callback(null, response);
    })
    .catch(e => {
      callback(e);
    });
};
