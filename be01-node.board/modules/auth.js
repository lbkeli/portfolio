const { alert } = require('../modules/util');
const { queryExecute } = require('../modules/mysql-conn')

const isAdmin = (req, res, next) => {
	if(req.user.grade == 9) next();
	else res.send(alert('정상적인 접근이 아닙니다.', '/'));
}
const isUser = (req, res, next) => { // request 요청 들어왔을 때
	if(req.isAuthenticated()) next(); // 인증이 통과된다면
	else res.send(alert('회원만 사용 가능합니다. 로그인 후 사용하세요', '/member/login'));
}
const isUserApi = (req, res, next) => { // Ajax 요청 들어왔을 때
	if(req.isAuthenticated()) next();
	else res.json({error: {code: 500, msg: '정상적인 접근이 아닙니다.'}});
}
const isGuest = (req, res, next) => {
	if(!req.isAuthenticated()) next();
	else res.send(alert('정상적인 접근이 아닙니다. 로그아웃 후에 이용하세요.', '/'));
}
const isMine = async (req, res, next) => {
	let id = req.query.id || req.params.id || req.body.id;
	let uid = req.user.id;
	if (id) { // id가 있다면
		let sql = `SELECT * FROM gallery WHERE id=${id} AND uid=${uid}`;
		let result = await queryExecute(sql);
		if(result.affectedRows > 0) next();
		else res.send(alert('본인의 글만 접근 가능합니다.', '/'));
	}
	else next();
}

module.exports = { isAdmin, isUser, isUserApi, isGuest, isMine };