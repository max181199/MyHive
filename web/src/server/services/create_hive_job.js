const create_hive_job = (res , user_req) => {
    return(
        new Promise(function (resolve, reject) {
          try{
            const { _axiosPost,axiosPost } = require('./axios')
            _axiosPost(res,'http://10.106.79.70:50111/templeton/v1/hive?user.name=admin',{
              execute : user_req
            }).then( (data)=>{
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