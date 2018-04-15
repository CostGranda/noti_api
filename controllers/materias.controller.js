const materia = require('../materia.model').docClient;

exports.list = (req, res, next) => {
  const params = {
    TableName: 'Materias',
    ProjectionExpression: 'codigo, nombre, creditos, coReq, preReq',
  };
  materia.scan(params, (err, data) => {
    if (err) {
      console.error(err);
    }
    res.status(200).json(data.Items);
  });
};
