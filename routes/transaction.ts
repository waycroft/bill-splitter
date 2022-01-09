import * as express from 'express';
let router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send('POST /transaction');
});

module.exports = router;
