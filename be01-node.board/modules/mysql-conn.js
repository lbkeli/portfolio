const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const pool = mysql.createPool({ // 10개 자리가 있는 수영장 (createconnection - 동접자 처리를 못해줌)
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10 // 동접자 10명까지 가능 (늘어갈수록 메모리 차지 많이 함)
});

const mysqlErr = (err) => {
	const error = new Error();
	error.msg = `[${err.code} / ${err.errno} / ${err.sqlState}] ${err.sqlMessage}`;
	return error; // 나를 호출한 애는 error 객체를 받게 됨 
}

const fileRev = (filename) => {
	return new Promise((resolve, reject) => { // 밑에 콜백이 있기 때문에 promise로 return 해줌
		let file = storagePath(filename);
		fs.unlink(file, (e) => {
			e ? reject(e) : resolve({code: 200}); // e가 존재하면 reject 시키고, 없으면 resolve 시켜줘
		});
	});
};

const storagePath = file => path.join(__dirname, '../storage', file.substr(0, 6), file); // 서버에서 쓰임
const uploadPath = file => '/upload/' + file.substr(0, 6) + '/' + file; // 내 컴퓨터에서만 쓰임

const queryExecute = (sql, sqlVal = []) => { // 기본값이 없다면 빈 배열 보내줌
	return new Promise( async (resolve, reject) => {
		let connect, result;
		try {
			connect = await pool.getConnection();
			result = await connect.execute(sql, sqlVal);
			connect.release();
			resolve(result[0]); // return = resolve / result[0]에 실제 결과가 담겨있으니 이 값을 return 해줌
		}
		catch(e) {
			connect.release();
			console.log(e);
			reject(e);
		}
	});
};

module.exports = { pool, mysqlErr, fileRev, queryExecute, storagePath, uploadPath };