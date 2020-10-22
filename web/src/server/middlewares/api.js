const fs = require('fs');
const multer = require('multer');
const { client2 } = require('../services/pg');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

var WebHDFS = require('webhdfs');
const { Stream } = require('stream');
var hdfs = WebHDFS.createClient({
  user: 'administrator',
  host: 'dad-proxy.consultant.ru/hadoop-manager1.consultant.ru',
  port: 50070,
});

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

      // Подготавливаем данные

      const { rows } = await client2.query(`
        SELECT name FROM smsuploadfileinfo WHERE id = ${req.body.id}`)
      let name = rows[0].name;
      let header = {};
 
      hdfs.mkdir('/user/admin/tmp/hive_upload_table',(error)=>{if (error !== null){console.log('HTFS_MKDIR_ERROR_CB:::',error)}})
      
      let stream = fs.createReadStream(req.files['csv_file'][0].path,{encoding: 'utf8'})
      
      let header_tmp = ''
      stream
        .on('open',()=>{})
        .on('readable',function(){
          let char = stream.read(1)
          while ( char !== '\n') {
            header_tmp+=char;
            char = stream.read(1)
          } 
          stream.close()
        })
        .on('close',()=>{
          header_tmp.split(',').forEach((el)=>{
            let el_tmp = el.replace(/ /g,'')
            if ( /\:/g.test(el_tmp)){
              let ar = el_tmp.split(':')
              header[ar[0]] = ar[1]
            } else {
              header[el_tmp] = 'TEXT'
            }
          })
          console.log('HEADER::',header)
        })

      

      //let remoteFileStream = hdfs.createWriteStream('/user/admin/tmp/hive_upload_table/' + name + '.csv');
      

      ///Start --> Создаем таблицу в Hive
        // const { rows : rw1 } = await client2.query(`
        //   UPDATE smsuploadfileinfo SET encoding='utf8',buffer='${tmp}', state = 'Создаем Hive таблицу' WHERE id = ${req.body.id};
        // `)
        //const createTable = require('./requests/createTable');
        //let result = await createTable(rows[0].name,header,req,res);
        //console.log(`CREATING_TABLE  ${rows[0].name}  DONE`)
      ///End  --> Создаем таблицу в Hive


      
      await unlinkAsync(req.files['csv_file'][0].path)
      const { rows : rw1 } = await client2.query(`
        UPDATE smsuploadfileinfo SET state = 'ok' WHERE id = ${req.body.id};`)
        
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
