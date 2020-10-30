const copyToHDFS = async ({ path, name })=> {
  const fs = require('fs');
  let WebHDFS = require('webhdfs');
  let hdfs = WebHDFS.createClient({
    user: 'administrator',
    host: 'hadoop-manager1.consultant.ru',
    port: 50070,
  });

  return new Promise((resolve, reject) => {
    hdfs.mkdir('/user/admin/test/hive_upload_table',(err)=>{
      if (err !== null){
        reject('ERROR')
      }
    })
    
    const localFileStream = fs.createReadStream(`./${name}`);
    const remoteFileStream = hdfs.createWriteStream(`${path}/${name}`);

    localFileStream.pipe(remoteFileStream);

    remoteFileStream.on('error', (err) => {
      reject('ERROR')
    });

    remoteFileStream.on('finish', () => {
      resolve('OK')
    });
  });
}

(async () => {
  try {
    const status = await copyToHDFS({
      path: '/user/admin/test/hive_upload_table',
      name: 'test.txt'
    });
    console.log('Файл скопирован');
  } catch (error) {
    console.log('Произошла ошибка'); 
  }
})();

module.exports = {
  copyToHDFS
}
