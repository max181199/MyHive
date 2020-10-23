const copyToHDFS = (path,file_offset,name)=>{
    return(
        new Promise(function (resolve, reject) {
          try {
            const fs = require('fs');
            let WebHDFS = require('webhdfs');
            let hdfs = WebHDFS.createClient({
                user: 'admin',
                host: 'dad-proxy.consultant.ru/hadoop-manager1.consultant.ru',
                port: 50070,
            });
            // Создаем папку в hdfs
            hdfs.mkdir('/user/admin/test/hive_upload_table',(error)=>{
              if (error !== null){
                console.log('HTFS_MKDIR_ERROR:::',error)
                reject({
                  'error' : err,
                  'place' : 'COPY_TO_HDFS_MKDIR'
                })
              }
            })
            // Тестовое создание файла в hdfs
            // hdfs.writeFile('/user/admin/test/hive_upload_table/' + name + '.csv', 'TestInfo', (error)=> {
            //   console.log('HTFS_WRITEFILE_ERROR:::',error)
            //     reject({
            //       'error' : error,
            //       'place' : 'HTFS_WRITEFILE_ERROR'
            //     })
            // });

            resolve({
              status : 'ok'
            })
            // Создаем файл и переносим в него данные ( Отбрасываем заголовок )
            // Файл для записи
            // let remoteFileStream = hdfs.createWriteStream('/user/admin/test/hive_upload_table/' + name ,{ encoding: 'utf8'})
            //   .on('error',(error)=>{
            //     console.log('HTFS_COPY_HDFS_FILE_ERROR:::',error)
            //     reject({
            //       'error' : erorr,
            //       'place' : 'HTFS_COPY_HDFS_FILE'
            //     })
            //   })
            // // Файл для чтения
            // let localFileStream = fs.createReadStream(path,{ encoding: 'utf8',start : file_offset + 1})
            // .on('error',(error)=>{
            //   console.log('HTFS_COPY_LOCAL_FILE_ERROR:::',error)
            //   reject({
            //     'error' : erorr,
            //     'place' : 'HTFS_COPY_LOCAL_FILE'
            //   })
            // })

            // localFileStream.pipe(remoteFileStream)

            // remoteFileStream.on('finish',()=>{
            //   resolve({status : 'ok'})
            // })

          } catch(err) {
            console.log('COPY_FILE_TO_HDFS_ERROR:::',err)
            reject({
              'error' : err,
              'place' : 'COPY_TO_HDFS'
            })
          }
        })
    )
}

module.exports = {
  copyToHDFS
}