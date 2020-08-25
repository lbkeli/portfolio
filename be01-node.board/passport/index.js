// const passport = require('passport');
const { queryExecute, mysqlErr } = require('../modules/mysql-conn');
const local = require('./local');
const kakao = require('./kakao');

module.exports = (passport) => {
	passport.serializeUser((user, done) => { // 세션에서 id 가져오는 과정
		done(null, user.id); // user = req.session.user
	});
	passport.deserializeUser(async (id, done) => { // 가져온 id로 실제 데이터 쿼리
		let sql, result;
		try {
			sql = 'SELECT * FROM member WHERE id='+id;
			result = await queryExecute(sql);
			done(null, result[0]);
		}
		catch(e) {
			done(e);
		}
	});
	local(passport); // 콜백으로 세션 생성해라
	kakao(passport); // 콜백으로 세션 생성해라
}