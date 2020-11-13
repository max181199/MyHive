const getMainInfo = async (req, res) => {
  const { client } = require('./../../services/pg');
  let login = req.cookies.login || 'NPSP-MalakhovDA';
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }

  //For test
  //login = 'admin' ////// DELETE

  let resData = {
    consultant: [],
    userbase: [],
    uploaded: []
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
        userbase.push(table_obj)
      } else {
        uploaded.push(table_obj)
      }
    }
    resData.userbase = userbase
    resData.uploaded = uploaded
  }
  
  return resData;
}

module.exports = getMainInfo;
