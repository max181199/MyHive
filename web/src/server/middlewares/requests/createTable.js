const createTable = async ( name , column ) => {
  const { axiosPost } = require('./../../services/axios');
  const { queryPg } = require('./../../services/pg');
  const moment = require('moment');

  const createTable = 
    `CREATE EXTERNAL TABLE IF NOT EXISTS userbase_subd_fedyashkinma.${name}
     (${
       column
      })
      ROW FORMAT DELIMITED 
      FIELDS TERMINATED BY '\\t'
      STORED AS TEXTFILE  
    `
  return createTable;

}

module.exports = createTable;