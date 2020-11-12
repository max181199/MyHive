const { error } = require('console');

const copyToHDFS = (path,name)=>{
    return(
        new Promise(function (resolve, reject) {
          try {
            const fs = require('fs');
            let WebHDFS = require('webhdfs');
            let hdfs = WebHDFS.createClient({
              user: 'administrator',
              host: 'hadoop-manager1.consultant.ru',
              port: 50070,
            });
            hdfs.mkdir('/user/admin/tmp/hive_upload_table',(err)=>{
              if (err !== null){
                console.log('HDFS_COPY_MKDIR_ERR:',err);
                resolve(
                  {
                    status : 'error',
                    place : 'HDFS_COPY_MKDIR',
                  })
              }
            })
            //Открываем файлы
              let remoteFileStream = hdfs.createWriteStream('/user/admin/tmp/hive_upload_table/' + name)
              let localFileStream  = fs.createReadStream(path)

            // Обработка файла для чтения (local)
              localFileStream
              .on('error',(error)=>{
                console.log('HTFS_COPY_HDFS_LOCAL_FILE_ERROR:::',error)
                resolve({
                  status : 'error',
                  place : 'HDFS_COPY_LOCAL_FILE'
                })
              })

            // Обработка файла для записи (remote)
              remoteFileStream
              .on('error',(error)=>{
                console.log('HTFS_COPY_REMOTE_FILE_ERROR:::',error)
                resolve({
                  status : 'error',
                  place : 'HDFS_COPY_LOCAL_FILE'
                })
              })
              remoteFileStream.on('finish',()=>{
                resolve({status : 'ok'})
              })
            //  Потоковая отправка данных
              localFileStream.pipe(remoteFileStream)
          } catch(error) {
            console.log('COPY_TO_HDFS_ERROR:::',error)
            resolve({
              status : 'error',
              place : 'COPY_TO_HDFS',
            })
          }
        })
    )
}

const _ASYNC_SEND_FILE_ = (path,name) => {
  return(
    new Promise( async function(resolve,reject){
      try {
        console.log('_ASYNC_SEND_FILE_BEGIN_')
        let sending_count = 5
        let promise_array = []
        for (let i = 0; i < sending_count; i++) {
          let new_promise = copyToHDFS(path,name)
          promise_array.push(new_promise)          
        }
        await Promise.all(promise_array).then( (result)=>{
          let sent = false
          result.forEach((el)=>{
            if (el.status == 'ok') {
              sent = true
            }
          })
          if (sent){
            console.log('_ASYNC_SEND_FILE_CATCH_OK_:::',result)
            resolve({
              status : 'ok'
            })
          } else {
            console.log('_ASYNC_SEND_FILE_ALL_TIMEOUT_:::',result)
            reject({
              status : 'error',
              place : '_ASYNC_SEND_FILE_'
            })
          }
        })
      } catch(error) {
        console.log('_ASYNC_SEND_FILE_ERROR:::',error)
        resolve({
          status : 'error',
          place : '_ASYNC_SEND_FILE_'
        })
      }
    })
  )
}


module.exports = {
  _ASYNC_SEND_FILE_,
  copyToHDFS
}