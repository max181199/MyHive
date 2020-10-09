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
        VALUES ('${req.cookies.login || req.signedCookies.login || 'NON_LOGIN' }','${req.query.name + new Date().valueOf() }', '', '{}', 'Загрузка')
        RETURNING id
      `)
      res.send({status : 'ok', place : 'addRows' ,id : rows[0].id })
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

      let tmp = req.files['csv_file'][0].buffer.toString('utf8');
      let header = tmp.match(/.*?\n/)[0].slice(0,tmp.match(/.*?\n/)[0].length -1).split(',')
        .reduce((pr,el)=>(pr+el+','),'')
      header = header.slice(0,header.length-1)

      const { rows : rw1 } = await client2.query(`
        UPDATE smsuploadfileinfo SET encoding='utf8',buffer='${tmp}', state = 'Создаем Hive таблицу' WHERE id = ${req.body.id};
      `)

      const { rows } = await client2.query(`
        SELECT name FROM smsuploadfileinfo WHERE id = ${req.body.id}
      `)

      ///Start --> Создаем таблицу в Hive
        const createTable = require('./requests/createTable');
        let result = await createTable(rows[0].name,header,req,res);
        let { rows: rw2 } = await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'Заполнем таблицу' WHERE id = ${req.body.id};
        `)
      ///End  --> Создаем таблицу в Hive
      

      res.send({ status: 'ok' , res : result , header : header });
    } catch(err){
      res.send({status : 'error', place : 'uploadCSV', error : err})
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
