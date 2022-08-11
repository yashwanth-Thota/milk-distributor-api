var express = require('express');
const cors = require('cors');
const pingRouter = require('./api/routes/pingRouter');
const rTracer = require('cls-rtracer');
const HttpStatusCodes = require('http-status-codes').StatusCodes;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const logger = require('./util/logger');
const adminRouter = require('./api/routes/adminRouter');
const orderRouter = require('./api/routes/orderRouter');

require('dotenv').config();
var app = express();
app.use(rTracer.expressMiddleware());


app.use(express.json());
app.options('*', cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function (req, res, next) {
  const request_id = rTracer.id();
  logger.info("request id: " + request_id);
  res.setHeader("request-id", request_id);
  next();
});


app.use("/ping",pingRouter)

app.use("/admin",adminRouter)

app.use("/",orderRouter)

app.use((err, req, res, next) => {

  if (err && err.error && err.error.isJoi) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      type: err.type,
      message: err.error.toString()
    });
  } else {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.json({ message: err.message, stack: err.stack });
    next(err)
  }
});

const PORT = process.env.PORT ||5000;
app.listen(PORT, () => {
    logger.info(`milkdistributor server has started! at port: 4849`)
})