const getMainInfo = async (req, res) => {
  const { queryPg } = require('./../../services/pg');
  let login = req.cookies.login || 'NPSP-MalakhovDA';
  if (login != 'admin') {
    login = login.replace(/-/g, '_').toLowerCase();
  }

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
  const consultantData = await queryPg(res, consultantQuery);

  if ((consultantData.length > 0) && consultantData[0].describe) {
    resData.consultant = JSON.parse(consultantData[0].describe);
  }

  const userbaseQuery = `
    SELECT *
    FROM hive_manager.tables
    WHERE name = 'userbase_${login}'
  `;
  const userbaseData = await queryPg(res, userbaseQuery);

  if ((userbaseData.length > 0) && userbaseData[0].describe) {
    resData.userbase = JSON.parse(userbaseData[0].describe);
  }
  
  return resData;
}

module.exports = getMainInfo;
