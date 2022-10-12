const { PORT } = require('./config')
const app = require('./app')

const port = PORT || 8000

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});