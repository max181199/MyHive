const create_hive_job = (res , user_req , login) => {
    return(
        new Promise(function (resolve, reject) {
          try{
            const { _axiosPost,axiosPost, _axiosGet } = require('./axios')
            const moment = require('moment');
            const {	asyncHiveRequest } = require('./asyncHiveRequest');

            if (login != 'admin') {
              login = login.replace(/-/g, '_').toLowerCase();
            }
            let db = 'userbase_' + (login == 'non_login' ? 'default' : login); 
            
            let time = moment().format('YYYYMMDDHHmmss');
            let prefix = `
              --${time}
              CREATE TABLE IF NOT EXISTS ${db}.${'report_report_' + time}
              ROW FORMAT DELIMITED 
              FIELDS TERMINATED BY '\t'
              LINES TERMINATED BY '\n'
              STORED AS TEXTFILE
              LOCATION '/user/hive/warehouse/${db}.db/${'report_report_' + time}'
              AS
            `;

            let job_id = null;
            asyncHiveRequest(prefix + user_req).then(async (data)=>{
              while( job_id == null){
                let jobs = await _axiosGet('LACRIMOSA','http://10.106.79.70:50111/templeton/v1/jobs?user.name=administrator') || [];
                for (let i = jobs.length - 1 ; i >= jobs.length - 30; i--) { // 30 эврестическое число в будущем может потребоваться изменить
                  console.log('JOBS::',jobs[i]);
                  let info = await _axiosGet('For Whom The Bell Tolls',`http://10.106.79.70:50111/templeton/v1/jobs/${jobs[i]["id"]}?user.name=administrator`);
                  //console.log(info["profile"]["jobId"],info["profile"]["jobName"],time,info["profile"]["jobName"].startsWith(`--${time}`) );
                  console.log('state',job_id);
                  if ( info["profile"]["jobName"].startsWith(`--${time}`)  ){
                    console.log("FOUND", info["profile"]["jobId"] )
                    job_id = info["profile"]["jobId"];
                    resolve({
                      state : 'ok',
                      job_id : job_id
                    })
                    break;
                  }
                }
              }
            }).catch( err => {
              console.log('CREATE_HIVE_ASYNC_HIVE_ERROR',err)
              resolve({
                state : 'error',
                error : err,
                place : 'CREATE_HIVE_JOB'
              })
            });

           

            //console.log('TEST:::',prefix + user_req)
            
            // _axiosPost(res,'http://10.106.79.70:50111/templeton/v1/hive?user.name=administrator',{
            //   execute : prefix + user_req
            // }).then( (data)=>{
            //   console.log('DATA:::',data)
            //   resolve({
            //     state : 'ok',
            //     job_id : data.id,
            //   })
            // }).catch( (err)=>{
            //   console.log('CREATE_HIVE_JOB_POST_ERROR',err)
            //   resolve({
            //     state : 'error',
            //     error : err,
            //     place : 'CREATE_HIVE_JOB_POST'
            //   })
            // })


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