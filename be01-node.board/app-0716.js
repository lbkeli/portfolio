/*********** 프로젝트 시작 전 **********/
// git init
// npm init -y (package.json 생김)
// npm i express pug mysql2

// npm i ** : 한번만 설치
// npm i ** -g : 계속 설치 돼있음 (nodemon, supervisor)

/*********** 외부 모듈 **********/
const express = require('express');
const app = express();
const path = require('path');

/*********** 사용자 모듈 **********/
const { pool, mysqlErr } = require('./modules/mysql-conn');

/*********** 절대 경로 **********/
const publicPath = path.join(__dirname, './public');
const jsonPath = path.join(__dirname, './json');
const viewsPath = path.join(__dirname, './views');

/*********** 라우터 **********/
const boardRouter = require('./router/board');
const memberRouter = require('./router/member');

/*********** 서버 실행 **********/
app.listen(3000, () => { console.log("http://127.0.0.1:3000") });

/*********** pug 셋팅 **********/
app.set('view engine', 'pug');
app.set('views', viewsPath);
app.locals.pretty = true;
app.locals.headTitle = '노드 게시판'; // pug에 전달하는 변수들을 등록할 때 쓴다 (전역변수)

/*********** 라우터 셋팅 **********/
app.use('/', express.static(publicPath)); // 접근 가능한 정적인 폴더
app.use('/api', express.static(jsonPath)); // 
app.use('/board', boardRouter);
app.use('/member', memberRouter);

/* promise 모델 (async, await) */
app.get('/test', async (req, res, next) => {
	try { // 시도 해서 성공한다면 이대로 가고,
		let sql = 'INSERT INTO gbook SET writer=?, comment=?'; // 쿼리문
		let sql2 = 'SELECT * FROM gbook ORDER BY id DESC';
		let sqlValue = ['홍길동4', '방문했어영'];
		let connect = await pool.getConnection();
		const result = await connect.execute(sql, sqlValue); // 나를(await) 감싸고 있는 함수한테 async를 줌
		const result2 = await connect.execute(sql2); // 나를(await) 감싸고 있는 함수한테 async를 줌
		connect.release(); // createPool 수영장에서 빌려온 자리를 써먹고 다시 돌려주기
		res.json(result2);
	}
	catch(err) { // 에러가 난다면 이걸 실행
		next( mysqlErr(err) );
	}
});

/* 콜백모델 
app.get('/test', (req, res, next) => {
	let sql = 'INSERT INTO gbook SET writer=?, comment=?';
	let sqlValue = ['홍길동'];
	connect.query(sql, sqlValue, (err, result) =>  {
		if(err) next( mysqlErr(err) );
		else {
			res.json(result);
		}
	});
}); */

/*********** 오류 처리 **********/
app.use((req, res, next) => {
	const err = new Error();
	err.code = 404;
	err.msg = "요청하신 페이지를 찾을 수 없습니다.";
	next(err);
});
app.use((error, req, res, next) => {
	const code = error.code || 500;
	const msg = error.msg || "서버 내부 오류입니다. 관리자에게 문의하세요.";
	res.render('error.pug', { code, msg });
});