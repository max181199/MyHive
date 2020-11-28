const dropTable = async ( login , table_name ) => {
  const {	hiveRequest } = require('./../../services/hiveRequest');
  
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }
  let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login);

  try {
    let dropRequest = `DROP TABLE IF EXISTS ${db}.${table_name}`
    let res = await hiveRequest(dropRequest)
    console.log('DR:',res)
    return(res)
  } catch (err) {
    console.log('DROP_TABLE_ERROR:::',err)
    return({status : 'error', place : 'DROP_TABLE'})
  }
}

module.exports = {
  dropTable
}