const createTable = async ( name , column , req , res ) => {
  const { axiosGet } = require('./../../services/axios');

  let createTable = 
    `CREATE EXTERNAL TABLE IF NOT EXISTS userbase_subd_fedyashkinma.${name}
     (${
       column
      })
      ROW FORMAT DELIMITED 
      FIELDS TERMINATED BY '\\t'
      STORED AS TEXTFILE  
    `
  const { databases } = await axiosGet(res, `http://10.106.79.70:50111/templeton/v1/ddl/database?user.name=admin`);
  
  for (let i = 0; i < databases.length; i++) {
    console.log(`${i+1} из ${databases.length} (${databases[i]})`);}

  return {createTable};

}

module.exports = createTable;