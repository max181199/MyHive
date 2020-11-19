const updateUploadTable = async (login) => {
  const { _axiosGet } = require('./../../services/axios');
  const { queryPg, client } = require('./../../services/pg');
  const moment = require('moment');
  console.log('UPDATE_USER_REQUEST_TABLE')

  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }

  let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login);
  
    
  try {
    let { databases } = await _axiosGet('NIRAVANA', `http://10.106.79.70:50111/templeton/v1/ddl/database?user.name=admin`);
    databases = databases.filter((name)=>(name==db))
    for (let i = 0; i < databases.length; i++) {
      console.log(`${i+1} из ${databases.length} (${databases[i]})`);

      let data = [];
      const getOldData = `
        SELECT describe FROM hive_manager.tables
        WHERE name = '${databases[i]}';
      `;
      old_data = (await client.query(getOldData))['rows'][0]['describe']
      old_data = JSON.parse(old_data)
      old_data.forEach(dt => {
        //console.log('DT:',dt)
        if (dt['table'].startsWith('report_')){
          data.push(dt)
        }
      });

      let { tables } = await _axiosGet('SAINT_ASONIA', `http://10.106.79.70:50111/templeton/v1/ddl/database/${databases[i]}/table?user.name=admin`);
      tables = tables.filter((name)=>(!name.startsWith('report_')))
      for (let j = 0; j < tables.length; j++) {
        console.log('\t',`${j+1} из ${tables.length} (${tables[i]})`)
        const { columns } = await _axiosGet('METALICA', `http://10.106.79.70:50111/templeton/v1/ddl/database/${databases[i]}/table/${tables[j]}?user.name=admin`);
        data.push({
          table: tables[j],
          columns
        });
      }

      const updateQuery = `
        DELETE FROM hive_manager.tables
        WHERE name = '${databases[i]}';
    
        INSERT INTO hive_manager.tables(name, describe, updated_at)
        VALUES ('${databases[i]}', '${JSON.stringify(data)}', '${moment().format()}');
      `;

      //console.log('DATA:::',updateQuery)

      await client.query(updateQuery);
    }

    return {status: 'ok'};

  } catch(err) {
    console.log('UPDATE_UPLOAD_TABLE_ERROR:::',err)
    return {status: 'error',place : 'UPDATE_UPLOAD_TABLE_TABLE'};
  }

}
    
  module.exports = updateUploadTable;
    