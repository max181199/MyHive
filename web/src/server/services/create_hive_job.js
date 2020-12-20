const create_hive_job = (res , user_req , login) => {
    return(
        new Promise(function (resolve, reject) {
          try{
            const { _axiosPost,axiosPost } = require('./axios')
            const moment = require('moment');
            const {	hiveRequest } = require('./hiveRequest');

            if (login != 'admin') {
              login = login.replace(/-/g, '_').toLowerCase();
            }
            let db = 'userbase_' + (login == 'NON_LOGIN' ? 'default' : login); 

            let prefix = `
              CREATE TABLE IF NOT EXISTS ${db}.${'report_report_' + moment().format('YYYYMMDDHHmmss')}
              ROW FORMAT DELIMITED 
              FIELDS TERMINATED BY '\t'
              LINES TERMINATED BY '\n'
              STORED AS TEXTFILE
              LOCATION '/user/hive/warehouse/${db}.db/${'report_report_' + moment().format('YYYYMMDDHHmmss')}'
              AS
            `;

            // hiveRequest(prefix + user_req).then((data)=>{
            //   console.log("CRJOB:",data)
            // });

            console.log('TEST:::',prefix + user_req)
            
            _axiosPost(res,'http://10.106.79.70:50111/templeton/v1/hive?user.name=administrator',{
              execute : prefix + user_req
            }).then( (data)=>{
              console.log('DATA:::',data)
              resolve({
                state : 'ok',
                job_id : data.id,
              })
            }).catch( (err)=>{
              console.log('CREATE_HIVE_JOB_POST_ERROR',err)
              resolve({
                state : 'error',
                error : err,
                place : 'CREATE_HIVE_JOB_POST'
              })
            })
          } catch(err) {
            console.log('CREATE_HIVE_JOB_ERROR',err)
            resolve({
              state : 'error',
              error : err,
              place : 'CREATE_HIVE_JOB'
            })
          }
        })
    )
}

module.exports = {
  create_hive_job
}