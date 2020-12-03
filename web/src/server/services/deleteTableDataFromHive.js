const deleteTableDataFromHDFS = (db,table_name) => {
	return(
		new Promise(function(resolve,reject){
			try{
				let WebHDFS = require('webhdfs');
				let hdfs = WebHDFS.createClient({
					user: 'administrator',
					host: 'hadoop-manager1.consultant.ru',
					port: 50070,
				});
				hdfs.rmdir(`/user/hive/warehouse/${db}.db/` + table_name,true,(error)=>{
					console.log('DELETE_TABLE_DATA_FROM_HDFS_RMDIR_ERROR:::',error)
					resolve({
						status : 'error',
						place : 'DELETE_TABLE_DATA_FROM_HDFS_RMDIR',
					})
				})
				resolve({
					status : 'ok'
				})
			} catch(error) {
				console.log('DELETE_TABLE_DATA_FROM_HDSF_ERROR:::',error)
				resolve({
					status : 'error',
					place : 'DELETE_TABLE_DATA_FROM_HDSF',
				})
			}
		})
	)
}

module.exports = {
	deleteTableDataFromHDFS
}