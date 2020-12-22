const asyncHiveRequest = async (req) => {
    return(
        new Promise(function (resolve, reject) {
            try {
              const hive = require('hive-driver');
              const { TCLIService, TCLIService_types } = hive.thrift;
              const client = new hive.HiveClient(
                TCLIService,
                TCLIService_types
              );
              const utils = new hive.HiveUtils(
                TCLIService_types
              );
              client.connect(
                {
                  host: '10.106.79.70',
                  port: 10000,
                },
                new hive.connections.TcpConnection(),
                new hive.auth.PlainTcpAuthentication({
                  username: 'administrator',
                  password: 'masaka20'
                })
              ).then(async client => {
                const session = await client.openSession({
                  client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V5
                });

                const operation = await session.executeStatement(
                  req,
                  { runAsync : true }
                );
                
                utils.waitUntilReady(operation, true, (error) => {'HIVE_REJECT_ERROR:::',error}).then( async data=>{
                  await operation.close();
                  await session.close();
                  await client.close();
                  console.log('EverythingClose');
                });

                resolve({status : 'ok'})             

              }).catch( (err) => {
                console.log('HIVE_REQUEST_ERROR-first_cath:::',err)
                reject({
                    status : 'error',
                    error : err,
                    place : 'hive_manager.hive_request'
                })
              })
            } catch(err) {
                console.log('HIVE_REQUEST_ERROR:::',err)
                resolve({
                    status : 'error',
                    error : err,
                    place : 'hive_manager.hive_request'
                })
            }
        })
    )
}

module.exports = {
  asyncHiveRequest
}