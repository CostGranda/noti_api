const jose = require('node-jose');
const fs = require('fs');

const region = 'us-east-2';
const appClientId = '65pvpin6ekicld8bnk0pdfjb5d';

async function getPublicKeys() {
  const cert = fs.readFileSync('jwks.json');
  const { keys } = JSON.parse(cert);
  return keys;
}

class Verifier {
  constructor(params, claims = {}) {
    if (!params.userPoolId) throw Error('userPoolId param is required');
    if (!params.region) throw Error('region param is required');

    this.userPoolId = params.userPoolId;
    this.region = params.region;
    this.expectedClaims = claims;
  }

  async verify(token) {
    try {
      const sections = token.split('.');
      const { kid } = JSON.parse(jose.util.base64url.decode(sections[0]));

      const publicKeys = await getPublicKeys();

      const myPublicKey = publicKeys.find(k => k.kid === kid);

      if (!myPublicKey) throw Error('Public key not found.');

      const joseKey = await jose.JWK.asKey(myPublicKey);

      const verifiedToken = await jose.JWS.createVerify(joseKey).verify(token);

      const claims = JSON.parse(verifiedToken.payload);

      if (!claims.iss.endsWith(this.userPoolId)) {
        return {
          status: 401,
          msg: { message: 'Unknow issuer' },
        };
      }
      if (this.expectedClaims.aud !== appClientId) {
        return {
          status: 401,
          msg: { message: 'Token was not issued for this audience' },
        };
      }
      const now = Math.floor(new Date() / 1000);
      if (now > claims.exp) {
        return {
          status: 401,
          msg: { message: 'Token expired' },
        };
      }
      if (this.expectedClaims.aud && claims.token_use === 'access') {
        console.warn('WARNING! Access tokens do not have an aud claim');
      }
      return { status: 200, user: claims.sub };
    } catch (e) {
      return { status: 401, msg: { message: 'Invalid token' } };
    }
  }
}

module.exports = Verifier;
