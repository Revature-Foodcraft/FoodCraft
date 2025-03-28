const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`
        })
    ),

    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "general.log" })
    ]
})

module.exports = {
    logger
}