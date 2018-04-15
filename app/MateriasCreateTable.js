require('dotenv').config();
const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({
  profile: process.env.AWS_PROFILE,
});
AWS.config.credentials = credentials;

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: 'Materias',
  KeySchema: [
    { AttributeName: 'carrera', KeyType: 'HASH' },
    { AttributeName: 'codigo', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'carrera', AttributeType: 'S' },
    { AttributeName: 'codigo', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.log(
      'No se puedo crear la tabla. Eror JSON: ',
      JSON.stringify(err, null, 2),
    );
  } else {
    console.log('Tabla creada: ', JSON.stringify(data, null, 2));
  }
});
