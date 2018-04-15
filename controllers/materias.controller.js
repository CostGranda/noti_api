const Materia = require('../config/aws').DocumentClient;

const def = { TableName: 'Materias' };

exports.getAll = (req, res, next) => {
  const params = def;
  Materia.scan(params, (err, data) => {
    if (err) {
      next(err);
    }
    res.status(200).json(data.Items);
  });
};
