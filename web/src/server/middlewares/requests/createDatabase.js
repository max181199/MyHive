const createDatabase = async (login, res) => {
	const { axiosGet } = require('./../../services/axios');
	const {	hiveRequest } = require('./../../services/hiveRequest');
	try {
		// Определяем имя БД
		let tmp = login.split('-')
		let db = 'userbase_' + (login === 'NON_LOGIN' ? 'default' : (tmp[0].toLowerCase() + '_' + tmp[1].toLowerCase()));
		// Узнаем существующие БД
		let {	databases } = await axiosGet(res, 'http://dad-proxy.consultant.ru/10.106.79.70:50111/templeton/v1/ddl/database/?user.name=admin')
		// Проверяемя есть ли среди БД нужная нам ( если нет создаем)
		let finding_our_db = databases.find((el) => {
			el == db
		})
		if (finding_our_db !== undefined) {
			return (finding_our_db)
		} else {
			let res = await hiveRequest(`CREATE DATABASE IF NOT EXISTS ${db}`)
			console.log('CDQ:',res)
			return (db)
		}
	} catch (err) {
		console.log('CREATE_DATABASE_ERROR:::', err)
		return ({
			status: 'error',
			place: 'CREATE_DATABASE'
		})
	}
}

module.exports = {
	createDatabase
}