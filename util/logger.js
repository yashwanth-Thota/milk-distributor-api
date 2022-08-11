const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format
const rTracer = require('cls-rtracer')

const validLogLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']; 
const defaultLevel = 'info';

let logLevel = defaultLevel

if (validLogLevels.includes(process.env["APP_FABRIC_LOG_LEVEL"])) {
  logLevel = process.env["APP_FABRIC_LOG_LEVEL"]; // set the passed log level
}


const rTracerFormat = printf((info, ...meta) => {
  const rid = rTracer.id()
  return JSON.stringify({request_id:rid, ...info, ...meta})
})

const logger = createLogger({
  format: combine(
    timestamp(),
    rTracerFormat   
  ),
  transports: [new transports.Console({level: logLevel})]
})

module.exports = logger;