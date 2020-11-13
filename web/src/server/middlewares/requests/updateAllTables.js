const updateAllTables = async (req, res) => {
  const { axiosGet } = require('./../../services/axios');
  const { queryPg, client } = require('./../../services/pg');
  const moment = require('moment');

  const { databases } = await axiosGet(res, `http://10.106.79.70:50111/templeton/v1/ddl/database?user.name=admin`);
  for (let i = 0; i < databases.length; i++) {
    console.log(`${i+1} из ${databases.length} (${databases[i]})`);
    let data = [];
    const { tables } = await axiosGet(res, `http://10.106.79.70:50111/templeton/v1/ddl/database/${databases[i]}/table?user.name=admin`);
    for (let j = 0; j < tables.length; j++) {
      const { columns } = await axiosGet(res, `http://10.106.79.70:50111/templeton/v1/ddl/database/${databases[i]}/table/${tables[j]}?user.name=admin`);
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
    await client.query(updateQuery);
  }
}

module.exports = updateAllTables;
