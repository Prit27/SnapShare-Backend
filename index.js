const app = require('./app');
const { PORT } = require('./src/util/constants/constants');
app.listen(process.env.PORT || PORT);
console.log('Server Started on port 8080')


