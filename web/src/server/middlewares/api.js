const fs = require('fs');
const multer = require('multer');
const { client2 } = require('../services/pg');
const { promisify } = require('util');
const createTable = require('./requests/createTable');
const unlinkAsync = promisify(fs.unlink)



let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/loadTable')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '.csv')
  }
})

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
        INSERT INTO smsuploadfileinfo (login, name, state) 
        VALUES ('${req.cookies.login || req.signedCookies.login || 'NON_LOGIN' }','${req.query.name.slice(0,req.query.name.length - 4) + new Date().valueOf() }', 'Загрузка данных на сервер')
        RETURNING id,name
      `)
      res.send({status : 'ok', place : 'addRows' ,id : rows[0].id,name : rows[0].name })
    } catch(err){
      res.send({status : 'error',place : 'addColumn', error : err})
    }
  });

  app.get('/api/getDisable',async(req,res) =>{
    try{
      const { rows } = await client2.query(`
        SELECT name, state FROM smsuploadfileinfo WHERE state != 'ok' AND login = '${req.cookies.login || req.signedCookies.login || 'DEFAULT'}'
      `)
      res.send({status : 'ok', names : rows })
    } catch(err){
      res.send({status : 'error',place : 'getDisable', error : err})
    }
  })

  app.post('/api/uploadCSV', upload, async (req, res) => {
    try{
      // Имя файла
      const { rows } = await client2.query(`
        SELECT name FROM smsuploadfileinfo WHERE id = ${req.body.id}`)
      let name = rows[0].name;
      // Заголовок для создания таблицы
      await client2.query(`
        UPDATE smsuploadfileinfo SET state = 'Анализируем заголовок' WHERE id = ${req.body.id};`)
      let  { getHeader } = require('../services/header')
      let header = await getHeader(req.files['csv_file'][0].path)
      // Копируем файл на сервер hadoop
      await client2.query(`
        UPDATE smsuploadfileinfo SET state = 'Передаем данные на сервер' WHERE id = ${req.body.id};`)
      let { copyToHDFS } = require('../services/copyToHDFS')
      let result = await copyToHDFS(req.files['csv_file'][0].path,header.offset,name)
      console.log('RESULT:::',result)
      // Проверяем на наличие схемы
      await client2.query(`
        UPDATE smsuploadfileinfo SET state = 'Проверяем наличие БД' WHERE id = ${req.body.id};`)
      let { createDatabase } = require('./requests/createDatabase')  
      let databaseName = await createDatabase(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',req,res)
      console.log('DATABASE_NAME:::',databaseName)
      //Удаляем файл на устройстве
      await unlinkAsync(req.files['csv_file'][0].path)
      //Архивируем запись о загруженных таблицах
      const { rows : rw1 } = await client2.query(`
        UPDATE smsuploadfileinfo SET state = 'ok' WHERE id = ${req.body.id};`)
      //Возвращаем ответ 
      res.send({ status: 'ok',name  });
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
