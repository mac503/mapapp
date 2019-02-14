const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const routes = require('./routes');

//TODO REMOVE CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//TODO REMOVE CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));
