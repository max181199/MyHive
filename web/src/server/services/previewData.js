const previewData = ( db,real_name) => {
  return(
    new Promise((resolve,reject)=>{
      try {
        const readline = require('readline');
        const fs = require('fs')
        let WebHDFS = require('webhdfs');
        let hdfs = WebHDFS.createClient({
          user: 'administrator',
          host: 'hadoop-manager1.consultant.ru',
          port: 50070,
        });

        let data    = []
        let count = 0

        hdfs.readdir(`/user/hive/warehouse/${db}.db/${real_name}`,(err,files)=>{
          if (err !== null ){
            console.log('API_DOWNLOAD_READDIR_ERROR:::',err)
          } else {
            //console.log('FILES::',files)
            let file_path = `/user/hive/warehouse/${db}.db/${real_name}/` + files[0].pathSuffix;
            //let downloadFile = hdfs.createReadStream(file_path)
            let downloadFile = hdfs.createReadStream(file_path)

            downloadFile.on('error', (e)=>{
              console.log('PREVIEW_FILE_ERROR:::',e);
              resolve({
                status : 'error',
                place : 'PREVIEW_FILE',
                data : []
              })
            })

            const rl = readline.createInterface({
              input: downloadFile,
              crlfDelay: Infinity
            });

            rl.on('line',(line) => {
              console.log(`Line from file: ${line}`);
              if ( count < 100){
                data.push(line)
                count = count + 1
              } else {
                rl.close()
              }
            })

            rl.on('close',()=>{
              resolve({status : 'ok',data})
            })

            rl.on('error',(e)=>{
              console.log('PREVIEW_FILE_LINE_ERROR:::',e);
              resolve({
                status : 'error',
                place : 'PREVIEW_FILE_LINE',
                data : []
              })
            })
          }
        })
      } catch(err) {
        console.log('PREVIEW_DATA_ERROR:::',err)
        resolve({
          status : 'error',
          place : 'PREVIEW_DATA',
          data : []
        })
      }
    })
  )
}

module.exports = {
  previewData
}