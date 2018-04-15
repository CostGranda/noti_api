const Materia = require('../../config/aws').DocumentClient;

const def = {
  TableName: 'Materias',
  KeyConditionExpression: 'carrera = :carr',
};

exports.getAll = (req, res, next) => {
  const params = {
    ...def,
    ExpressionAttributeValues: {
      ':carr': req.body.carrera || 'Ingeniería Informática',
    },
  };
  Materia.query(params, (err, data) => {
    if (err) {
      next(JSON.stringify(err, null, 2));
    } else {
      res.status(200).json(data.Items);
    }
  });
};
