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
    host: 'hadoop-manager1.consultant.ru',
    port: 10000,
  },
  new hive.connections.TcpConnection(),
  new hive.auth.PlainTcpAuthentication({
    username: 'administrator',
    password: 'masaka20'
  })
).then(async client => {
  try {

    const session = await client.openSession({
      client_protocol: TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V7
    });

    const selectDataOperation = await session.executeStatement(
      'select user_id from consultant.cs limit 10',
      {
        runAsync: true
      }
    );
    await utils.waitUntilReady(selectDataOperation, true, () => {});
    await utils.fetchAll(selectDataOperation);
    await selectDataOperation.close();

    const result = await utils.getResult(selectDataOperation).getValue();
    
    console.log(result);
    await session.close();
    await client.close();
  } catch (error) {
   console.log(error); 
  }
});
