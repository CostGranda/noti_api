const Verifier = require('./validate');

const {
  AWS_COGNITO_REGION,
  AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_APP_CLIENT_ID,
} = process.env;

const params = {
  region: AWS_COGNITO_REGION,
  userPoolId: AWS_COGNITO_USER_POOL_ID,
};

const claims = {
  aud: AWS_COGNITO_APP_CLIENT_ID,
};

const verifier = new Verifier(params, claims);

const isAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const token = req.headers.authorization.split(' ')[1];

  verifier.verify(token).then((response) => {
    if (response.status !== 200) {
      return res.status(response.status).send(response.msg);
    }
    req.user = response;
    return next();
  });
};

module.exports = isAuth;
