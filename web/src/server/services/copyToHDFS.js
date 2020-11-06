const copyToHDFS = (path,file_offset,name,res)=>{
    return(
        new Promise(function (resolve, reject) {
          try {
            const fs = require('fs');
            const { axiosPut,axiosPost } = require('../services/axios')
            // Создаем папку в hdfs
            axiosPut('http://hadoop-manager1.consultant.ru:50070/webhdfs/v1/tmp/hive_upload_table?op=MKDIRS&user=admin')
            .then( (data)=>{
              console.log('HDFS_MKDIR_RESULT:::', JSON.stringify(data,null,2))
            })
            .catch( (err)=>{
              console.log('HDFS_MKDIR_ERROR:::',err)
              resolve({
                status : 'error',
                'place' : 'HDFS_MKDIR'
              })
            })
            // Запрашиваем адреc dataNode hdfs для отправки данных
            axiosPut(`http://hadoop-manager1.consultant.ru:50070/webhdfs/v1/user/admin/tmp/hive_upload_table/${name}.csv?op=CREATE&overwrite=true`,null,{maxRedirects : 1})
            .then( (data)=>{
              console.log('HDFS_DATANODE_RESULT:::', JSON.stringify(data,null,2))
              resolve({
                status : 'ok'
              })
            })
            .catch( (err)=>{
              console.log('HDFS_DATANODE_ERROR:::',err)
              resolve({
                status : 'error',
                'place' : 'HDFS_DATANODE'
              })
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