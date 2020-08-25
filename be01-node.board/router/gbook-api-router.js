const express = require('express');
const router = express.Router();
const { pool } = require('../modules/mysql-conn');
const pagerInit = require('../modules/pager-conn');
const moment = require('moment');

router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	let connect, sql, sqlVal, result, pager, jsonResult;
	try {
		// pager = await pagerInit(req, 'gbook', 'WHERE 1'); // where절이 있다면 인자 = (req, 테이블명, 조건절)
		pager = await pagerInit(req, null, 'gbook'); // api에서는 page.path가 필요없기 때문에 (안쓰는 데이터)
		connect = await pool.getConnection();
		sql = 'SELECT * FROM gbook ORDER BY id DESC LIMIT ?, ?';
		sqlVal = [ pager.stRec, pager.cnt ]; // 시작레코드, 갯수
		result = await connect.execute(sql, sqlVal);
		connect.release();
		result[0].forEach((v) => {
			v.createdAt = moment(v.createdAt).format('YYYY-MM-DD hh:mm:ss');
		});
		jsonResult = { code: 200, pager, lists: result[0], user: req.user }; 
		// pager: pager 키 값과 value의 값이 같기 때문에 하나만 써줘도 됨
		res.json(jsonResult);
	}
	catch(e) {
		console.log(e);
		next(e);
	}
});

router.post('/save', async (req, res, next) => {
	let connect, sql, sqlVal, result;
	let { writer, comment } = req.body;
	try {
		sql = 'INSERT INTO gbook SET writer=?, comment=?';
		sqlVal = [ writer, comment ];
		connect = await pool.getConnection();
		result = await connect.execute(sql, sqlVal); // execute : 실행해라 // sqlVal은 sql에 ?가 있을때 사용
		res.json({ code: 200, result: result[0] });
	}
	catch(e) {
		next(e);
	}
});

/*********** 오류 처리 **********/
router.use((req, res, next) => {
	const err = new Error();
	err.code = 404;
	err.msg = "요청하신 페이지를 찾을 수 없습니다.";
	next(err);
});
router.use((error, req, res, next) => {
	const code = error.code || 500;
	const msg = error.msg || "서버 내부 오류입니다. 관리자에게 문의하세요.";
	res.json({ code, msg, error });
});

module.exports = router;