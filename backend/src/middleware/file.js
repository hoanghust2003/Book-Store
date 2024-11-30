const formidable = require('formidable');

const fileParser = async (req, res, next) => {
  const form = formidable();
  
  const [fields,files] = await form.parse(req);

  // console.log("body: ",req.body)
  // console.log("files: ",req.files)
  
  if (!req.body) req.body = {}
  if (!req.files) req.files = {}

  for (const key in fields){
    const fieldValue = fields[key]
    if (fieldValue) req.body[key] = fieldValue[0]
  }

  for (const key in fields){
    const fieldValue = fields[key]
    if (fieldValue) {
      if (fieldValue.length > 1){
        req.files[key] = fieldValue
      } else {
        req.files[key] = fieldValue[0]
      }
    }
  }

  // console.log("Fields: ",fields)
  // console.log("Files: ",files)
}
module.exports = fileParser;