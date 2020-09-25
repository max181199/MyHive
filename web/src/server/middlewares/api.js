const fs = require('fs');
const multer = require('multer');
const { client2 } = require('../services/pg');
let storage = multer.memoryStorage()

const upload = multer({ storage: storage }).fields([
  { name: 'csv_file', maxCount: 99 },
  { id: 'id', maxCount: 1 },
])

module.exports = function setup(app) {

  app.get('/api/getMainInfo', async (req, res) => {
    const getMainInfo = require('./requests/getMainInfo');
    const mainInfo = await getMainInfo(req, res);
    res.send(mainInfo);
  });

  app.get('/api/addColumn', async(req,res) =>{
    try{
      const { rows } = await client2.query(`
        INSERT INTO smsuploadfileinfo (login, name, encoding, buffer, state) 
        VALUES ('${req.cookies.login || req.signedCookies.login || 'DEFAULT' }','${req.query.name + '-' + Date.now() }', '', '{}', 'Загрузка')
        RETURNING id
      `)
      res.send({status : 'ok', id : rows[0].id })
    } catch(err){
      res.send({status : 'error', error : err})
    }
  });

  app.get('/api/getDisable',async(req,res) =>{
    try{
      const { rows } = await client2.query(`
        SELECT name, state FROM smsuploadfileinfo WHERE state != 'ok' AND login = '${req.cookies.login || req.signedCookies.login || 'DEFAULT'}'
      `)
      res.send({status : 'ok', names : rows })
    } catch(err){
      res.send({status : 'error', error : err})
    }
  })

  app.post('/api/uploadCSV', upload, async (req, res) => {
    try{
      const { rows } = await client2.query(`
        UPDATE smsuploadfileinfo SET encoding='7bit', state='Отправка Hive' WHERE id == '${req.body.id}'
      `)
      res.send({ status: 'ok', name : req.files[0]});
    } catch(err){
      res.send({status : 'error', error : err})
    }
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
