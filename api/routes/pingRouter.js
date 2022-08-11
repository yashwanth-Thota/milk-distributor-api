var express = require("express")

var pingRouter = express.Router()

pingRouter.get('/', function(req, res) {
  res.json({
    pong: true,
  });
})

module.exports = pingRouter