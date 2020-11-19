const createTable = async ( header_type, header_name, login, table_name, res ) => {
  const { axiosPost, axiosGet } = require('./../../services/axios');
  const {	hiveRequest } = require('./../../services/hiveRequest');

  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }
  let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login);

  header_type = header_type.split(',')
  header_name = header_name.split(',')

  try {
    let column = ''
    for (let i = 0; i < header_name.length; i++) {
      column = column + ' ' + header_name[i] + ' ' + header_type[i] + ',' 
    }
    column = column.slice(0,column.length - 1)

    let createTableQuery = 
    `CREATE EXTERNAL TABLE IF NOT EXISTS ${db}.${table_name}
      (${column})
      ROW FORMAT DELIMITED 
      FIELDS TERMINATED BY '\\t'
      STORED AS TEXTFILE  
    `
    console.log('CTQ:::',createTableQuery)

    let res = await hiveRequest(createTableQuery)

    return {status: 'ok'};
  } catch(err) {
    console.log('CREATE_TABLE_ERROR:::',err)
    return {status: 'error', place : 'CREATE_TABLE'};
  }

}

module.exports = {
  createTable
}