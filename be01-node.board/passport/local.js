const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { queryExecute, mysqlErr } = require('../modules/mysql-conn');

const cb = async (userid, userpw, done) => {
	let sql, result;
	try {
		sql = 'SELECT * FROM member WHERE userid=?';
		result = await queryExecute(sql, [userid]); // = req.body.userid
		if(result[0]) { // 아이디가 존재할 때
			let compare = await bcrypt.compare(userpw + process.env.SALT, result[0].userpw); // 비밀번호 일치하는지 확인
			if(compare) done(null, result[0]); // 비밀번호 일치한다면 error 코드에 null 보냄
			else done(null, false, '아이디와 비밀번호를 확인하세요.'); // 비밀번호가 틀렸다면 error는 안보내지만 
		}
		else done(null, false, '아이디와 비밀번호를 확인하세요.'); // 아이디가 없을 때
	}
	catch(e) {
		done(e);
	}
}

// 함수가 하나만 있을 땐, 이렇게 써도 된다.
module.exports = (passport) => {
	passport.use(new LocalStrategy({
		usernameField: 'userid',
		passwordField: 'userpw'
	}, cb));
};