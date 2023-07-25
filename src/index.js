const express = require('express');
require('./db/mongoose');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoutes);
app.use(orderRoutes);

app.listen(port, () => {
  console.log('server is running' + port);
});
