const renameTable = async ( login , old_name , new_name ) =>{
  const {	hiveRequest } = require('./../../services/hiveRequest');
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }
  let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login);

  try{
    let renameReq = `
      ALTER TABLE ${db}.${old_name} RENAME TO ${db}.${new_name}
    `;
    let res = await hiveRequest(renameReq);
    console.log('RNM:',res)
    return(res)
  } catch(err) {
    console.log('RENAME_TABLE_ERROR:::',err);
    return({ status : 'error', place : 'RENAME_TABLE'});
  }
}

module.exports = {
  renameTable
}