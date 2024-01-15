const uuid = require('uuid');
const httpStatus = require('http-status');

// Middleware to validate UUID
const validateUUID = (req, res, next) => {
    const userId = req.params.userId;
    if (!uuid.validate(userId)) {

      return res.status(httpStatus.BAD_REQUEST).send({ statusCode: httpStatus.BAD_REQUEST, msg: "Invalid userId format", error: error });

    }
    next();
};

module.exports = {
    validateUUID
}

