const fs = require('fs');
const jose = require('node-jose');

const region = 'us-east-2';
const userPoolId = 'us-east-2_QK2DJPFFU';
const appClientId = '65pvpin6ekicld8bnk0pdfjb5d';
const userPoolUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

const cert = fs.readFileSync('jwks.json');
const { keys } = JSON.parse(cert);
const token =
  'eyJraWQiOiJRVjViZkx5dVg5RmlvN3RPSWZ6Z1wvRk1Dc2tDeHJjUWpoV2RKOGVDUWJlbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2ODcyZmY4My1lMzQxLTRkYjAtYWI2NS1hZmZjNjMwZDAwMmIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfUUsyREpQRkZVIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiNjg3MmZmODMtZTM0MS00ZGIwLWFiNjUtYWZmYzYzMGQwMDJiIiwiYXVkIjoiNjVwdnBpbjZla2ljbGQ4Ym5rMHBkZmpiNWQiLCJldmVudF9pZCI6IjQ1MWViZGRkLTQ3NmQtMTFlOC04OTc0LWRkNGYwM2ZkNDdjNyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTI0NTM5NTI3LCJuYW1lIjoiSm9yZ2UiLCJwaG9uZV9udW1iZXIiOiIrNTczMDAyMDAxMDM0IiwiZXhwIjoxNTI0NTQzMTI3LCJpYXQiOjE1MjQ1Mzk1MjcsImVtYWlsIjoiZGF2aWRfcm9qYXM4MjE0MkBlbHBvbGkuZWR1LmNvIn0.DFW5sKkVH335MX2gAiJf0Mos0FG-LEf-mlDee9bFQ42EA2-FZsoHcqS1MbU_TfVDbj6LzWV9oHHzJkdQ42BoP6uZFtZHJtKJPludkuefhCg4j--T67PaRhslPVfiy3YQ3E8ht3HEs3mlhcEHCzjdGgik5d8YVn8jzBCGqi4EELp18MYy2VkIb-mya4QwNoiEkOotyFhvOyefXoM4lOXAbYfQz0loZbaXKOVUCmgP_8DXwVuj3sZsnjic2XAleS40QxMyOQ4wnmGSb9WEMm8vge3wBzYV26EG-VTmTILsEqxJ7JtZbhgB0iaPmCwFI25sG7P6gzvFiogl4aZrtGm3Fw';
const secciones = token.split('.');
const decoded = jose.util.base64url.decode(secciones[0]);
const cabecera = JSON.parse(decoded);
const { kid } = cabecera;

const pubKey = keys.filter(item => item.kid === kid);

if (Object.keys(pubKey).length === 0) {
  console.log('Public Key no encontrada', pubKey);
} else {
  jose.JWK.asKey(pubKey[0])
    .then((key) => {
      jose.JWS.createVerify(key, { allowAlgs: 'RS256' })
        .verify(token)
        .then((result) => {
          const claims = JSON.parse(result.payload);
          const currentTs = Math.floor(new Date() / 1000);
          if (currentTs > claims.exp) {
            console.log('Token is expired');
          }
          if (claims.iss !== userPoolUrl) {
            console.log('Invalid Issuer');
          }
          if (claims.aud !== appClientId) {
            console.log('Token was not issued for this audience');
          }
          if (claims.token_use !== 'id') {
            console.log('No concuerda el uso.');
          }
          // aqui retorno los claims
        })
        .catch(console.log('no key found'));
    })
    .catch(console.log('La verificación falló.'));
}
