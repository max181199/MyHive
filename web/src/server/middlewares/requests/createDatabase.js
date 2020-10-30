const createDatabase = async (login,req,res) =>{
    const { axiosPost, axiosGet } = require('./../../services/axios');
    const { hiveRequest } = require('./../../services/hiveRequest');
    try{
        let db  = 'userbase_' + (login === 'NON_LOGIN' ? 'default' : login);
        ////TODO::: Узнать где можно найти название отдела и воспользоваться им
        let { databases } = await axiosGet(res,'http://dad-proxy.consultant.ru/10.106.79.70:50111/templeton/v1/ddl/database/?user.name=admin')
        let finding_our_db = databases.find((el)=>{
           el === db 
        })
        if (finding_our_db !== undefined){
            return(finding_our_db)
        } else {
            console.log('TEST_RESULT', await hiveRequest('select * from consultant.cs limit 10'))
            return('nothing')
        }
    } catch(err) {
        console.log('CREATE_DATABASE_ERROR:::',err)
        return(
            {
                error : err,
                place : 'CREATE_DATABASE'
            }
        )
    }



}
module.exports = {
    createDatabase
}