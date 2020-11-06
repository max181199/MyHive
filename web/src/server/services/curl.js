const curlCreateFile = async (path,file_offset,name,res) => {
  return(
    new Promise ( function(resolve,reject){
      try {
        



      } catch(err) {
        console.log('HDFS_CURL_CREATE_FILE_ERROR:::',err)
        reject({
          status : 'error',
          place : 'HDFS_CURL_CREATE_FILE'
        })}
    })
  )
}

module.exports = {
  curlCreateFile
}