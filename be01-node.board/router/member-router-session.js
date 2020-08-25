const express = require('express');
const router = express.Router();
const { mysqlErr, queryExecute } = require('../modules/mysql-conn');
const bcrypt = require('bcrypt');
const { alert, getIP } = require('../modules/util');
const { isAdmin, isUser, isGuest } = require('../modules/auth');
require('dotenv').config();

const pug = { headTitle: "Node/Express 회원관리", css: "member", js: "member" };
let sql, sqlVal = [], result;

/* 이 안에서 쓰여질 미들웨어 */
const useridChk = async (req, res, next) => {
	req.userid = req.query.userid;
	req.sendData = { code: 500 };
	if(req.userid.length < 4 || req.userid.length > 16) {
		req.sendData.msg = '아이디는 4 ~ 16자리 입니다.';
		res.json(req.sendData);
	}
	else {
		sql = `SELECT userid FROM member WHERE userid='${req.userid}'`;
		result = await queryExecute(sql);
		if(result[0] && result[0].userid) {
			req.sendData.msg = `${req.userid}는 사용하실 수 없습니다.`;
			res.json(req.sendData);
		}
		else next(); // 할 일을 하고 next(async)로 넘어감
	}
}

const formChk = (req, res, next) => {
	req.userid = req.body.userid;
	req.userpw = req.body.userpw;
	req.username = req.body.username;
	req.email = req.body.email;
	if (req.userid && req.userpw && req.username && req.userpw.length >= 8 && req.userpw.length <= 24 && req.userid.length >= 4 && req.userpw.length <= 16)	next();
	else res.send(alert('정상적인 접근이 아닙니다.', '/member/join')); // send = html을 만드는것
}

/* AJAX 요청 => 무조건 json으로 받음 */
router.get('/api/idchk', isGuest, useridChk, async (req, res, next) => { // req에 userid, sendData(200)이 담겨있음
	res.json({code: 200, msg: `${req.userid}은(는) 사용 가능합니다.`});
});

router.get('/join', isGuest, (req, res, next) => {
	pug.title = "회원가입";
	res.render('member/member-join.pug', pug);
});

router.get('/login', isGuest, (req, res, next) => {
	pug.title = "회원로그인";
	res.render('member/member-login.pug', pug);
});

router.post('/save', isGuest, formChk, async (req, res, next) => {
	sql = 'INSERT INTO member SET userid=?, userpw=?, username=?, email=?';
	req.userpw = await bcrypt.hash(req.userpw + process.env.SALT, 7) // 패스워드에 소금치기, 7번 암호화, 
	sqlVal = [ req.userid, req.userpw, req.username, req.email ];
	result = await queryExecute(sql, sqlVal);
	res.send(alert('회원가입이 완료되었습니다. 로그인 해 주세요.', '/member/login'));
});

router.post('/sign', isGuest, async (req, res, next) => {
	let { userid, userpw } = req.body;
	sql = 'SELECT * FROM member WHERE userid=?';
	result = await queryExecute(sql, [userid]);
	if (result[0]) { // 아이디가 존재할 때
		let match = await bcrypt.compare(userpw + process.env.SALT, result[0].userpw) // result[0].userpw = 암호화 된 패스워드 
		if (match) {
			// 세션구현 // 세션 정보이기 때문에 req를 쓰면 어느 페이지에서도 접근 가능해짐
			req.session.user = {
				userid,
				id: result[0].id, 
				username: result[0].username, 
				emeil: result[0].email,
				grade: result[0].grade
			}; 
			sql = 'INSERT INTO loginlog SET uid=?, ip=?'
			result = await queryExecute(sql, [result[0].id, getIP(req)]);
			res.send(alert('로그인 되었습니다.', '/'));
		}
		else res.send(alert('아이디 또는 패스워드가 올바르지 않습니다.', '/'));
	}
	else { // 아이디 없음
		res.send(alert('아이디 또는 패스워드가 올바르지 않습니다.', '/'));
	}
});

router.get('/logout', isUser, (req, res, next) => {
	req.session.destroy();
	res.send(alert('로그아웃 되었습니다.', '/'));
});

/* 
***** 암호화 / 복호화 *****
암호화 crypt (crypto) : 암호화 시키고 나면 풀 수가 없음
복호화 cipher : 암호를 푸는 것
*/

module.exports = router;