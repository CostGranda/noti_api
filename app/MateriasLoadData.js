const AWS = require('aws-sdk');
const fs = require('fs');

const credentials = new AWS.SharedIniFileCredentials({
  profile: 'dynamo-cred',
});

AWS.config.credentials = credentials;

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
});

const docCliente = new AWS.DynamoDB.DocumentClient();
console.log('Importando materias en DynamoDB');

const allMaterias = JSON.parse(fs.readFileSync('civil.json', 'utf8'));
allMaterias.forEach((materia) => {
  const params = {
    TableName: 'Materias',
    Item: {
      carrera: materia.carrera,
      codigo: materia.codigo,
      nombre: materia.nombre,
      preReq: materia.preReq,
      coReq: materia.coReq,
      creditos: materia.creditos,
      nivel: materia.nivel,
    },
  };
  docCliente.put(params, (err, data) => {
    if (err) {
      console.error(
        'No se cargar la materia.',
        materia.title,
        '. JSON: ',
        JSON.stringify(err),
      );
    } else {
      console.log('Archivo insertado', materia.nombre);
    }
  });
});
