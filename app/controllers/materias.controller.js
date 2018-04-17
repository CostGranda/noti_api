const Materia = require('../../config/aws').DocumentClient;

/**
 * Objeto con valores por defecto que se reutilizará en los métodos que
 * no utilizen indices para construir la consulta
 */
const def = {
  TableName: 'Pensums',
  KeyConditionExpression: 'carrera = :carr',
};

/**
 * Obtiene las materias por carrera, por defecto devuelve las de informática.
 * @function getByCarrera
 * @param {objetc} req En el body se le puede indicar la carrera para hacer el query.
 * @param {object} res
 * @param {object} next
 * @returns JSON con cada materia y la cantidad de items en el query.
 */
exports.getByCarrera = (req, res, next) => {
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
      res.status(200).json(data);
    }
  });
};

exports.getByIndex = (req, res, next) => {
  if (!req.body.codigo) {
    return next();
  }
  const params = {
    TableName: 'Pensums',
    IndexName: 'codigo-nombre-index',
    KeyConditionExpression: 'codigo = :cod',
    ExpressionAttributeValues: {
      ':cod': req.body.codigo,
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
