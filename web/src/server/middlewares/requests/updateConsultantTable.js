const updateConsultantTable = async () => {
  const { _axiosGet } = require('./../../services/axios');
  const { queryPg,client } = require('./../../services/pg');
  const moment = require('moment');

  console.log('UPDATE_CONSULTANT_TABLES')

  let data = [];
  const { tables:consultantTables } = await _axiosGet('Ozzy', `http://10.106.79.70:50111/templeton/v1/ddl/database/consultant/table?user.name=admin`);
  for (let index = 0; index < consultantTables.length; index++) {
    const { columns } = await _axiosGet('DIO', `http://10.106.79.70:50111/templeton/v1/ddl/database/consultant/table/${consultantTables[index]}?user.name=admin`);
    data.push({
      table: consultantTables[index],
      columns
    });
  }

  const updateQuery = `
    DELETE FROM hive_manager.tables
    WHERE name = 'consultant';

    INSERT INTO hive_manager.tables(name, describe, updated_at)
    VALUES ('consultant', '${JSON.stringify(data)}', '${moment().format()}');
  `;
  await client.query(updateQuery);
  
  return {status: 'OK'};
}

module.exports = updateConsultantTable;
