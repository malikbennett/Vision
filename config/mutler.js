// config/multer.js
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() }) // keeps file in memory as buffer
module.exports = upload
