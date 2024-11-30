const formidable = require('formidable');

const fileParser = async (req, res, next) => {
  const form = new formidable.IncomingForm(); 

  form.parse(req, (err, fields, files) => {
    if (err) {
      return next(err); 
    }

    if (!req.body) req.body = {};
    if (!req.files) req.files = {};

    for (const key in fields) {
      const filedValue = fields[key];
      if (filedValue) req.body[key] = filedValue[0];
    }

    for (const key in files) {
      const filedValue = files[key];
      if (filedValue) {
        if (filedValue.length > 1) {
          req.files[key] = filedValue;
        } else {
          req.files[key] = filedValue[0];
        }
      }
    }

    next();
  });
};

module.exports = fileParser;