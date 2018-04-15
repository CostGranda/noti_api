process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;

const app = require('./app/app');

app.listen(port);

console.log(`Server running at http://localhost:${port}/`);
