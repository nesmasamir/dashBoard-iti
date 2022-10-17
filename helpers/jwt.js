const { expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      // { url: /\/public\/upload(.*)/, methods: ['GET', 'OPTIONS'] },
      // { url: /\/api\/v1\/products(.*)/, methods: ["GET", "POST", "OPTIONS"] },
      // { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/api\/v1\/orders(.*)/, methods: ["POST","GET", "OPTIONS"] },
      // { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS"] },
      // { url: /\/api\/v1\/users(.*)/, methods: ["PUT", "OPTIONS"] },

      // `${api}/users/login`,
      // `${api}/users/register`

      { url: /\/public\/upload(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },
      { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },
      { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },

      `${api}/users/login`,
      `${api}/users/register`
    ],
  });
}
async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    return true;
  }
}

module.exports = authJwt;