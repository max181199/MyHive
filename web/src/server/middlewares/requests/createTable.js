const createTable = async ( name , column , req , res ) => {
  const { axiosPost, axiosGet } = require('./../../services/axios');

  let createTableQuery = 
    `CREATE EXTERNAL TABLE IF NOT EXISTS userbase_subd_fedyashkinma.${name}
     (${
       column
      })
      ROW FORMAT DELIMITED 
      FIELDS TERMINATED BY '\\t'
      STORED AS TEXTFILE  
    `


  let job = await axiosPost(res,'http://10.106.79.70:50111/templeton/v1/hive?user.name=admin',{execute : createTableQuery})
  

  return {job};

}

module.exports = createTable;