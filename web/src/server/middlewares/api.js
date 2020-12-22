const fs = require('fs');
const multer = require('multer');
const { client2,client } = require('../services/pg');
const { promisify } = require('util');
const createTable = require('./requests/createTable');
const { _axiosGet,_axiosPost,_axiosDelete } = require('../services/axios');
const { throws } = require('assert');
const unlinkAsync = promisify(fs.unlink)
const readline = require('readline');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/administrator/tmp/hive')
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

  app.get('/api/preview',async(req,res)=>{
    try {
      let login = req.cookies.login || req.signedCookies.login || 'NON_LOGIN';
      if (login != 'admin') {
        login = login.replace(/-/g, '_').toLowerCase();
      }
      let db = 'userbase_' + (login == 'non_login' ? 'default' : login); 
      let real_name = req.query.base == 'userbase' ? 'report_' + req.query.name : req.query.name;
      // Для тестов создадим readable поток для локального файла
      let {previewData} = require('../services/previewData')
      let data = await previewData(db,real_name)
      res.send({status : 'ok' , data : data.data })
    } catch(err) {
      console.log('API_PREVIEW_ERROR:::',err)
      res.send({
        status : 'error',
        place  : 'API_PREVIEW',
        data : []
      })
    }
  })

  app.get('/api/download',async(req,res)=>{
    try {
        let login = req.cookies.login || req.signedCookies.login || 'NON_LOGIN';
        if (login != 'admin') {
          login = login.replace(/-/g, '_').toLowerCase();
        }
        let db = 'userbase_' + (login == 'non_login' ? 'default' : login); 
        // Для тестов создадим readable поток для локального файла
        let WebHDFS = require('webhdfs');
        let hdfs = WebHDFS.createClient({
          user: 'administrator',
          host: 'hadoop-manager1.consultant.ru',
          port: 50070,
        });
        res.attachment(`${req.query.name}.txt`);
        let real_name = req.query.base == 'userbase' ? 'report_' + req.query.name : req.query.name ;
        hdfs.readdir(`/user/hive/warehouse/${db}.db/${real_name}`,(err,files)=>{
          //console.log('FILES::',files)
          //console.log('ERR:',err)
          if (err !== null ){
            console.log('API_DOWNLOAD_READDIR_ERROR:::',err)
          } else {
            files.forEach( file => {
              try {
                downloadFile = hdfs.createReadStream(`/user/hive/warehouse/${db}.db/${real_name}/${file.pathSuffix}`)
                downloadFile.on('error', (e)=>{console.log('DOWNLOAD_FILE_ERROR:::',e);res.send(e)})
                downloadFile.pipe(res)
              } catch (error) {
                console.log('DATANODE:::',error)
              }
            });
          }
        })
      } catch(err) {
        console.log('API_DOWNLOAD_ERROR:::',err)
        res.send({
          status : 'error',
          place  : 'API_DOWNLOAD'
        })
    }
  })

  app.get('/api/getAlterTableInfo',async(req,res)=>{
    try{
      let login = req.cookies.login || req.signedCookies.login || 'NON_LOGIN';
      if (login != 'admin') {
        login = login.replace(/-/g, '_').toLowerCase();
      }
      let db = 'userbase_' + (login == 'non_login' ? 'default' : login); 

      let _deletingTable = []
      let _renameTables = []
      let _usedNames = []

      // Таблицы, которые удаляются (DeletingTable) :
      let { rows } = await client.query(` SELECT oldname FROM hive_manager.altertableinfo WHERE db='${db}' AND newname = ''`)
      if ( rows.length != 0 ){
        _deletingTable = rows.map(el=>el.oldname.replace(/^report_/,''));
        //console.log("OTL__deletingTable:",_deletingTable);
      }
      // Таблицы которые переименовываются (RenameTables)
      let { rows : rows1 } = await client.query(` SELECT oldname FROM hive_manager.altertableinfo WHERE db='${db}' AND newname != ''`)
      if ( rows1.length != 0 ){
        _renameTables = rows1.map(el=>el.oldname.replace(/^report_/,''));
        //console.log("OTL__renameTables:",_renameTables);
      }
      // Имена которые заняты для переимонавания
      let { rows : rows2} = await client.query(` SELECT newname FROM hive_manager.altertableinfo WHERE db='${db}' AND newname != ''`)
      if ( rows2.length != 0 ){
        _usedNames = rows2.map(el=>el.newname.replace(/^report_/,''));
        //console.log("OTL__usedNames:",_usedNames);
      }
      // Отправляем данные на фронт
      res.send({
          status : 'ok', 
          data : {
            deletingTable : JSON.stringify(_deletingTable),
            renameTables : JSON.stringify(_renameTables),
            usedNames : JSON.stringify(_usedNames),
          }
      })
    } catch (err) {
      console.log('API_GET_ALTER_TABEL_INFO_ERROR:::',err)
      res.send({status : 'error' , place : 'API_GET_ALTER_TABEL_INFO' , 
          data : {
            deletingTable : JSON.stringify([]),
            renameTables : JSON.stringify([]),
            usedNames : JSON.stringify([]),
          }
      })
    }
  })

  app.get('/api/foggot_error',async(req,res)=>{
    try {
      client.query(`
        UPDATE hive_manager.smsuploadfileinfo SET state = 'ok' WHERE name = '${req.query.name}';`)
      res.send({status : 'ok'})
    } catch (error) {
      console.log("FOGGOT_ERROR_ERROR:::",error);
      res.send({status : 'error', place : 'FOGGOT_ERROR'});
    }
  })

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
      const { rows } = await client.query(`
        INSERT INTO hive_manager.smsuploadfileinfo (login, name, state) 
        VALUES ('${req.cookies.login || req.signedCookies.login || 'NON_LOGIN' }','${req.query.name.slice(0,req.query.name.length - 4) + '_' + new Date().valueOf() }', 'ok')
        RETURNING id,name
      `)
      res.send({status : 'ok', place : 'addRows' ,id : rows[0].id,name : rows[0].name })
    } catch(err){
      res.send({status : 'error',place : 'addColumn', error : err})
    }
  });

  app.get('/api/dropTable', async(req,res)=>{
    try{
      let login = req.cookies.login || req.signedCookies.login || 'NON_LOGIN';
      if (login != 'admin') {
        login = login.replace(/-/g, '_').toLowerCase();
      }
      let db = 'userbase_' + (login == 'non_login' ? 'default' : login);
      let real_name = req.query.dbase == 'userbase' ? 'report_' + req.query.name : req.query.name;
      // Добавляем информацию об удаляемой таблице
      await client.query(`
        INSERT INTO hive_manager.altertableinfo (db,oldname,newname)
        VALUES ('${db}','${real_name}','');
      `)
      let { dropTable } = require('./requests/dropTable')
      await dropTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',real_name)
      if (req.query.dbase == 'userbase'){
        let updateUserRequestTable = require('./requests/updateUserRequestTable')
        await updateUserRequestTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
      } else {
        let updateUploadTable = require('./requests/updateUploadTable')
        await updateUploadTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
      }
      // Считаем таблицу обновленной
      await client.query(`
        DELETE FROM hive_manager.altertableinfo * WHERE oldname = '${real_name}';
      `)
      res.send({status : 'ok'})
    } catch (err){
      // Считаем что удаление завершилось не удачно
      await client.query(`
        DELETE FROM hive_manager.altertableinfo * WHERE oldname = '${real_name}';
      `)
      console.log('API_DROP_TABLE_ERROR:::',err)
      res.send({
        status : 'error',
        place : 'API_DROP_TABLE'
      })
    }
  })

  app.get('/api/renameTable', async(req,res)=>{
    try{

      let login = req.cookies.login || req.signedCookies.login || 'NON_LOGIN';
      if (login != 'admin') {
        login = login.replace(/-/g, '_').toLowerCase();
      }
      let db = 'userbase_' + (login == 'non_login' ? 'default' : login);
      let real_old_name = req.query.dbase == 'userbase' ? 'report_' + req.query.old_name : req.query.old_name;
      let real_new_name = req.query.dbase == 'userbase' ? 'report_' + req.query.new_name : req.query.new_name;
      // Добавляем информацию об переименовываемой таблице
      await client.query(`
        INSERT INTO hive_manager.altertableinfo (db,oldname,newname)
        VALUES ('${db}','${real_old_name}','${real_new_name}');
      `)

      let {renameTable} = require('./requests/renameTable')
      await renameTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',real_old_name,real_new_name)
      if (req.query.dbase == 'userbase'){
        let updateUserRequestTable = require('./requests/updateUserRequestTable')
        await updateUserRequestTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
      } else {
        let updateUploadTable = require('./requests/updateUploadTable')
        await updateUploadTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
      }

      await client.query(`
        DELETE FROM hive_manager.altertableinfo * WHERE oldname = '${real_old_name}';
      `)
      
      res.send({status : 'ok'})
    } catch (err){

      await client.query(`
        DELETE FROM hive_manager.altertableinfo * WHERE oldname = '${real_old_name}';
      `)

      console.log('API_RENAME_TABLE_ERROR:::',err)
      res.send({
        status : 'error',
        place : 'API_RENAME_TABLE'
      })
    }
  })


  app.post('/api/uploadCSV', upload, async (req, res) => {
    try{

      let result = null
      // Начинаем загрузку файла
      await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'Готовимся к отправке' WHERE id = ${req.body.id};`)

      // Имя файла
        const { rows } = await client.query(`
          SELECT name FROM hive_manager.smsuploadfileinfo WHERE id = ${req.body.id}`)
        let name = rows[0].name;

      // Заголовок
        let header_type = req.body.header_type
        let header_name = req.body.header_name
        console.log('HEADERS:::',header_name,header_type)

      //Копируем файл на сервер hadoop 
        await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'Передаем данные на сервер' WHERE id = ${req.body.id};`)
        let { copyToHDFS,_ASYNC_SEND_FILE_ } = require('../services/copyToHDFS')
        result = await copyToHDFS(req.files['csv_file'][0].path,name)
        // Временное решение, тяжелое и не эффективное( для маленьких файлов сойдет)
        //result = await _ASYNC_SEND_FILE_(req.files['csv_file'][0].path,name) 
        if ( result.status != 'ok') throw({err : 'Ошибка копирование данных на сервер'})
      
      //Проверяем на наличие схемы 
        await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'Проверяем наличие БД' WHERE id = ${req.body.id};`)
        let { createDatabase } = require('./requests/createDatabase')  
        result = await createDatabase(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',res)
        if ( result.status != 'ok') throw({err : 'Не получилось создать БД'})
        let databaseName = result.db
      
      //Создаем таблицу
        await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'Создаем таблицу' WHERE id = ${req.body.id};`)
        let { createTable } = require('./requests/createTable')
        result = await createTable(header_type,header_name,req.cookies.login || req.signedCookies.login || 'NON_LOGIN',name,res)
        console.log("CHECK:::",result);
        if ( result.status != 'ok') throw({err : 'Не получилось создать таблицу'})
      
      // Заполняем таблицу данными
        await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'Заполняем таблицу' WHERE id = ${req.body.id};`)
        let { fillTable } = require('./requests/fillTable')
        result = await fillTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',name)
        if ( result.status != 'ok') throw({err : 'Не получилось заполнить таблицу'})

      //Удаляем файл на сервере hdfs ( Не требуется т.к. hive перемещает файлик себе)
        //let { deleteFromHDFS } = require('../services/deleteFromHDFS')
          //await deleteFromHDFS(name)

      //Удаляем файл на устройстве
        await unlinkAsync(req.files['csv_file'][0].path)

      //Обновляем данные о таблицах
        await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'Обновялем список таблиц' WHERE id = ${req.body.id};`)
        let updateUploadTable = require('./requests/updateUploadTable')
        result = await updateUploadTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
        if ( result.status != 'ok') throw({err : 'Не можем обновить список таблиц'})

      //Архивируем запись о загруженных таблицах
        await client.query(`
          UPDATE hive_manager.smsuploadfileinfo SET state = 'ok' WHERE id = ${req.body.id};`)

      //Возвращаем ответ 
        res.send({ status: 'ok'});

    } catch(err){
      // Говорим пользователю, что произошла ошибка
      // Префикс error_ нужен, для понимания фронта, что это ошибка
      // остальная часть содержит дополнительную информацию отображаемую на фронте
      await client.query(`
        UPDATE hive_manager.smsuploadfileinfo SET state = 'error_${err.err}' WHERE id = ${req.body.id};
      `)
      // Возвращаем данные об ошибках
      console.log("API_uploadCSV_ERROR",err)
      res.send({status : 'error'})
    }
  });

/// CREATE_JOB_API

  app.post('/api/create_hive_job', async(req,res)=>{
    let key = new Date
    // Добавляем информацию о джобе в бд
    await client.query(`
      INSERT INTO hive_manager.hive_request (login,job_id,request,state) 
      VALUES ('${req.cookies.login || req.signedCookies.login || 'NON_LOGIN' }','${key}','${req.body.user_req}','{"state":"loading","job_id":"${key}"}')
    `)
    // Проверяем что существует БД для загрузки отчета
    let { createDatabase } = require('./requests/createDatabase')  
    let tsm = await createDatabase(req.cookies.login || req.signedCookies.login || 'NON_LOGIN',res)
    console.log('TST:::',tsm)
    // Создаем джобу
    const { create_hive_job } = require('../services/create_hive_job')
    const result = await create_hive_job(res,req.body.user_req,req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
    console.log('CRJ:::',result)
    // Обновляем в БД информациею о джобе
    if ( result.state === 'ok'){
      await client.query(`
       UPDATE hive_manager.hive_request SET job_id = '${result.job_id}', state = '{"state":"creating","job_id":"${result.job_id}"}' WHERE job_id = '${key}';`)
    } else {
      await client.query(`
       UPDATE hive_manager.hive_request SET job_id = '${result.job_id}', state = '{"state":"cancel","job_id":"${result.job_id}"}' WHERE job_id = '${key}';`)
    }
    res.send(result)
  })

  app.get('/api/get_job_status', async(req,res)=>{
    try{
      const job_id = req.query.job_id;
      if ( job_id.startsWith('job')){

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
          let { rows } = await client.query(`
            SELECT state FROM hive_manager.hive_request WHERE job_id = '${job_id}'
          `)
          if ( rows[0].state !== undefined ){
            if ( (JSON.parse(rows[0].state)).state != 'SUCCEEDED'  ){
              const updateUserRequestTable = require('./requests/updateUserRequestTable')
              await updateUserRequestTable(req.cookies.login || req.signedCookies.login || 'NON_LOGIN')
            }
          }
        }
  
        await client.query(`
         UPDATE hive_manager.hive_request SET state = '${JSON.stringify(res_obj)}' WHERE job_id = '${job_id}';`)
        res.send({state : 'ok', status : res_obj})
      } else {
        const res_obj = {
          job_id : job_id,
          runState : 'loading',
          state : 'loading',
          mapProgress : 0,
          reduceProgress : 0,
          setupProgress : 0,
          cleanupProgress : 0,
          percentComplete : 0,
        }
        await client.query(`
          UPDATE hive_manager.hive_request SET state = '${JSON.stringify(res_obj)}' WHERE job_id = '${job_id}';`)
        res.send({state : 'ok', status : res_obj})
      }
    } catch (err) {
      console.log('GET_JOB_STATUS_ERROR',err)
      res.send({state : 'error',place : 'GET_JOB_STATUS',error : err })
    }
  })

  app.get('/api/get_jobs', async(req,res)=>{
    try{
      //console.log('GET_JOBS_OK')
      const { rows } = await client.query(`
        SELECT job_id,request,state,date FROM hive_manager.hive_request WHERE login = '${req.cookies.login || req.signedCookies.login || 'NON_LOGIN'}'
        ORDER BY date DESC
      `)
      //console.log('GET_JOBS_DONE')
      
      res.send({state : 'ok', rows})
    } catch(err){
      console.log('GET_JOBS_ERROR',err)
      res.send({state : 'error'})
    }
  })

  app.get('/api/forgot_job',async(req,res)=>{
    try{
      const job_id = req.query.job_id;
      await client.query(`
        DELETE from hive_manager.hive_request WHERE job_id='${job_id}'  AND login = '${req.cookies.login || req.signedCookies.login || 'NON_LOGIN'}';
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
