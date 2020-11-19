const fillTable = async (login,name) => {
  const {	hiveRequest } = require('./../../services/hiveRequest');
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }
  let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login);
  try{
    let loadQuery = `LOAD DATA INPATH '/user/admin/tmp/hive_upload_table/${name}' OVERWRITE INTO TABLE ${db}.${name}`
    console.log('LQ:',loadQuery)
    let res = await hiveRequest(loadQuery)
    console.log('res_tmp',res)
    return({status : 'ok'})  
  } catch(err) {
    console.log('FILL_TABLE_ERROR:::',err)
    return({status : 'error',place : 'FILL_TABLE'})
  }
}

module.exports = {
  fillTable
}