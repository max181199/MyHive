const renameTable = async ( login , old_name , new_name ) =>{
  const {	hiveRequest } = require('./../../services/hiveRequest');
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }
  let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login);

  try{
    let extFalse = `
      ALTER TABLE ${db}.${old_name} SET TBLPROPERTIES('EXTERNAL'='FALSE')
    `;
    let renameReq = `
      ALTER TABLE ${db}.${old_name} RENAME TO ${db}.${new_name}
    `;
    let extTrue = `
      ALTER TABLE ${db}.${new_name} SET TBLPROPERTIES('EXTERNAL'='TRUE')
    `;
    let off = await hiveRequest(extFalse);
    let res = await hiveRequest(renameReq);
    let on  = await hiveRequest(extTrue);
    console.log('RNM:',off,res,on)
    return(res)
  } catch(err) {
    console.log('RENAME_TABLE_ERROR:::',err);
    return({ status : 'error', place : 'RENAME_TABLE'});
  }
}

module.exports = {
  renameTable
}