const fs = require('fs');
const multer = require('multer');
const { client2,client } = require('../services/pg');
const { promisify } = require('util');
const createTable = require('./requests/createTable');
const { _axiosGet,_axiosPost,_axiosDelete } = require('../services/axios');
const unlinkAsync = promisify(fs.unlink)



let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/max/Work/tmp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '.csv'  )
  }
})

const upload = multer({ storage: storage }).fields([
  { name: 'csv_file', maxCount: 99 },
  { id: 'id', maxCount: 1 },
])

module.exports = function setup(app) {

  app.get('/api/updateAllTables', async(req,res)=>{
    try {
      const updateAllTables = require('./requests/updateAllTables')
      await updateAllTables(req,res)
      res.send({status : 'ok'})
    } catch(err) {
      res.send({status : 'error', place : 'updateAllTables'})
    }
  })

  app.get('/api/getMainInfo', async (req, res) => {
    const getMainInfo = require('./requests/getMainInfo');
    const mainInfo = await getMainInfo(req, res);
    res.send(mainInfo);
  });

  app.get('/api/addColumn', async(req,res) =>{
    try{
      const { rows } = await client2.query(`
        INSERT INTO smsuploadfileinfo (login, name, state) 
        VALUES ('${req.cookies.login || req.signedCookies.login || 'NON_LOGIN' }','${req.query.name.slice(0,req.query.name.length - 4) + '_' + new Date().valueOf() }', 'Загрузка данных на сервер')
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

      // Заголовок
        let header_type = req.body.header_type
        let header_name = req.body.header_name
        console.log('HEADERS:::',header_name,header_type)

      //Копируем файл на сервер hadoop 
        await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'Передаем данные на сервер' WHERE id = ${req.body.id};`)
        let { copyToHDFS,_ASYNC_SEND_FILE_ } = require('../services/copyToHDFS')
        //let result = await copyToHDFS(req.files['csv_file'][0].path,name)
        // Временное решение, тяжелое и не эффективное( для маленьких файлов сойдет)
          //await _ASYNC_SEND_FILE_(req.files['csv_file'][0].path,name) 
      
      //!!!Считаем, что наш файлик уже лежит на сервере и все хорошо) и имя его >>>
        name = 'test_csv_1605183710984' // Магия ошибок 
        
      //Проверяем на наличие схемы 
        await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'Проверяем наличие БД' WHERE id = ${req.body.id};`)
        let { createDatabase } = require('./requests/createDatabase')  
        let databaseName = await createDatabase(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',res)
  
      //Создаем таблицу
        await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'Создаем таблицу' WHERE id = ${req.body.id};`)
        let { createTable } = require('./requests/createTable')
        await createTable(header_type,header_name,req.cookies.login || req.signedCookies.login || 'NON_LOGIN',name,res)

      // Заполняем таблицу данными
        await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'Заполняем таблицу' WHERE id = ${req.body.id};`)
        let { fillTable } = require('./requests/fillTable')
        await fillTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',name)

      //Удаляем файл на сервере hdfs
        //let { deleteFromHDFS } = require('../services/deleteFromHDFS')
          //await deleteFromHDFS(name)

      //Удаляем файл на устройстве
        await unlinkAsync(req.files['csv_file'][0].path)

      //Обновляем данные о таблицах
        await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'Обновялем список таблиц' WHERE id = ${req.body.id};`)
        let updateUploadTable = require('./requests/updateUploadTable')
        await updateUploadTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')

      //Архивируем запись о загруженных таблицах
        await client2.query(`
          UPDATE smsuploadfileinfo SET state = 'ok' WHERE id = ${req.body.id};`)

      //Возвращаем ответ 
      res.send({ status: 'ok',name});
    } catch(err){
      // Говорим пользователю, что произошла ошибка
      await client2.query(`
        UPDATE smsuploadfileinfo SET state = 'error' WHERE id = ${req.body.id};
      `)
      // Возвращаем данные об ошибках
      console.log("API_uploadCSV_ERROR",err)
      res.send({status : 'error'})
    }
  });

/// CREATE_JOB_API

  app.post('/api/create_hive_job', async(req,res)=>{
    const { create_hive_job } = require('../services/create_hive_job')
    const result = await create_hive_job(res,req.body.user_req)
    if ( result.state === 'ok'){
      await client2.query(`
        INSERT INTO hive_request (login,job_id,request,state) 
        VALUES ('${req.cookies.login || req.signedCookies.login || 'NON_LOGIN' }','${result.job_id}','${req.body.user_req}','{"state":"creating","job_id":"${result.job_id}"}')
      `)
      console.log('DB_IT_DB_ERROR')
    }
    res.send(result)
  })

  app.get('/api/get_job_status', async(req,res)=>{
    try{
      const job_id = req.query.job_id;
      const result =  await _axiosGet(res,`http://10.106.79.70:50111/templeton/v1/jobs/${job_id}?user.name=admin`)
      const res_obj = {
        job_id : job_id,
        runState : result.status.runState,
        state : result.status.state,
        mapProgress : result.status.mapProgress,
        reduceProgress : result.status.reduceProgress,
        setupProgress : result.status.setupProgress,
        cleanupProgress : result.status.cleanupProgress,
        percentComplete : result.percentComplete,
      }
      if ( result.status.state == 'SUCCEEDED'){
        const updateUserRequestTable = require('./requests/updateUserRequestTable')
        await updateUserRequestTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
      }

      await client2.query(`
       UPDATE hive_request SET state = '${JSON.stringify(res_obj)}' WHERE job_id = '${job_id}';`)
      res.send({state : 'ok', status : res_obj})
    } catch (err) {
      console.log('GET_JOB_STATUS_ERROR',err)
      res.send({state : 'error',place : 'GET_JOB_STATUS',error : err })
    }
  })

  app.get('/api/get_jobs', async(req,res)=>{
    try{
      console.log('GET_JOBS_OK')
      const { rows } = await client2.query(`
        SELECT job_id,request,state,date FROM hive_request WHERE login = '${req.cookies.login || req.signedCookies.login || 'DEFAULT'}'
        ORDER BY date DESC
      `)
      console.log('GET_JOBS_DONE')
      
      res.send({state : 'ok', rows})
    } catch(err){
      console.log('GET_JOBS_ERROR',err)
      res.send({state : 'error'})
    }
  })

  app.get('/api/forgot_job',async(req,res)=>{
    try{
      const job_id = req.query.job_id;
      await client2.query(`
        DELETE from hive_request WHERE job_id='${job_id}'  AND login = '${req.cookies.login || req.signedCookies.login || 'DEFAULT'}';
      `)
      res.send({state : 'ok'})
    } catch(err){
      console.log('FORGOT_JOB_ERROR',err)
      res.send({state : 'error'})
    }
  })

  app.get('/api/kill_job',async(req,res)=>{
    try{
      const job_id = req.query.job_id;
      await _axiosDelete(res,`http://10.106.79.70:50111/templeton/v1/jobs/${job_id}?user.name=admin`)
      res.send({state : 'ok'})
    } catch(err){
      console.log('KILL_JOB_ERROR',err)
      res.send({state : 'error'})
    }
  })

/// END_CREATE_JOB_API


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
