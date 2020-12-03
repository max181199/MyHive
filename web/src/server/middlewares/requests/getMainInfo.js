const MySort = (a,b) => {
  
  let reg_a = a.table.match(/_\d+?$/gi)
  let reg_b = b.table.match(/_\d+?$/gi)
  if ( reg_a != null && reg_b != null){
    let int_a = parseInt(reg_a[0].replace(/_/gi,''))
    let int_b = parseInt(reg_b[0].replace(/_/gi,''))
    if (int_a < int_b) return 1; 
    if (int_a == int_b) return 0; 
    if (int_a > int_b) return -1;
  }
  if ( reg_a == null && reg_b == null){
    if (a.table > b.table) return 1; 
    if (a.table == b.table) return 0; 
    if (a.table < b.table) return -1
  }
  if ( reg_a == null && reg_b != null){
    return -1;
  }
  if ( reg_a != null && reg_b == null){
    return 1;
  }
}

const getMainInfo = async (req, res) => {
  const { client,client2 } = require('./../../services/pg');
  let login = req.cookies.login || 'NPSP-MalakhovDA';
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }

  //For test
  //login = 'admin' ////// DELETE

  const { rows } = await client2.query(`
    SELECT name, state FROM smsuploadfileinfo WHERE state != 'ok' AND login = '${req.cookies.login || req.signedCookies.login || 'DEFAULT'}' ORDER BY date DESC
  `)

  let resData = {
    consultant: [],
    userbase: [],
    uploaded: [],
    wait : rows || []
  }
  
  const consultantQuery = `
    SELECT *
    FROM hive_manager.tables
    WHERE name = 'consultant'
  `;
  
  let consultantData = await client.query(consultantQuery)
  consultantData = consultantData.rows
  
  if ((consultantData.length > 0) && consultantData[0].describe) {
    resData.consultant = JSON.parse(consultantData[0].describe);
  }

  const userbaseQuery = `
    SELECT *
    FROM hive_manager.tables
    WHERE name = 'userbase_${login}'
  `;
  let userbaseData = await client.query(userbaseQuery);
  userbaseData = userbaseData.rows

  if ((userbaseData.length > 0) && userbaseData[0].describe) {
    let userbase = []
    let uploaded = []
    let describe =  JSON.parse(userbaseData[0].describe)
    for( let table_key in describe ){
      let table_obj = describe[table_key]
      //console.log('TBOBJ',table_obj.table)
      if (table_obj.table.startsWith('report_')){
        userbase.push({...table_obj,table : table_obj.table.replace(/report_/,'')})
      } else {
        uploaded.push(table_obj)
      }
    }



    resData.userbase = userbase.sort(MySort)
    resData.uploaded = uploaded.sort(MySort)
  }
  
  //console.log(resData)

  return resData;
}

module.exports = getMainInfo;
