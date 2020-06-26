const updateConsultantTable = async (req, res) => {
  const { axiosGet } = require('./../../services/axios');
  const { queryPg } = require('./../../services/pg');
  const moment = require('moment');

  let data = [];
  const { tables:consultantTables } = await axiosGet(res, `http://10.106.79.70:50111/templeton/v1/ddl/database/consultant/table?user.name=admin`);
  for (let index = 0; index < consultantTables.length; index++) {
    const { columns } = await axiosGet(res, `http://10.106.79.70:50111/templeton/v1/ddl/database/consultant/table/${consultantTables[index]}?user.name=admin`);
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
  await queryPg(res, updateQuery);
  
  return {status: 'OK'};
}

module.exports = updateConsultantTable;
