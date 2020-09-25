const fs = require('fs');
const multer = require('multer');
const { client2 } = require('../services/pg');
let storage = multer.memoryStorage()

const upload = multer({ storage: storage }).fields([
  { name: 'csv_file', maxCount: 99 },
])

module.exports = function setup(app) {

  app.get('/api/getMainInfo', async (req, res) => {
    const getMainInfo = require('./requests/getMainInfo');
    const mainInfo = await getMainInfo(req, res);
    res.send(mainInfo);
  });

  app.post('/api/uploadCSV', upload, async (req, res) => {
    const { rows } = await client2.query(`
      INSERT INTO smsuploadfileinfo (login, name, encoding, buffer, state) 
      VALUES ('TEST', '', '', '{1,2,3}', 'Loading to Hive'); 
    `)
    res.send({ status: 'EXCELLENT', fls: req.files[0],rows:rows });
  });

  app.get('/api/updateConsultantTable', async (req, res) => {
    const updateConsultantTable = require('./requests/updateConsultantTable');
    const status = await updateConsultantTable(req, res);
    res.send(status);
  });

  app.get('/api/updateAllTables', async (req, res) => {
    const updateAllTables = require('./requests/updateAllTables');
    updateAllTables(req, res);
    res.send({ status: 'OK' });
  });
};
