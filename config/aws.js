const dotenv = require('dotenv');
const AWS = require('aws-sdk');

dotenv.config();

AWS.config.update({
  endpoint: process.env.AWS_ENDPOINT,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_SECRET_KEY_ID,
  region: process.env.AWS_REGION,
});

module.exports.DocumentClient = new AWS.DynamoDB.DocumentClient();
