/*********** 프로젝트 시작 전 **********/
// git init
// npm init -y (package.json 생김)
// npm i express pug mysql2
// package.json에서 test 밑에 "start" : "nodemon" 해주면
// 터미널 창에서 npm start 만 치면 된다.

// npm i ** : 한번만 설치
// npm i ** -g : 계속 설치 돼있음 (nodemon, supervisor)

// res를 만나면 흐름이 더 이어지지 않고 바로 보내줌 (return)

/*********** 외부 모듈 **********/
// (PW 등 유출되면 안되는 정보들이 있기 때문에 gitignore에도 들어가있음)
require('dotenv').config(); // .env : 중요한 정보들 넣어놓는 곳 
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const session = require('./modules/session-conn');
const logger = require('./modules/morgan-conn');
const passportModule = require('./passport'); // './passport/index.js'

/*********** 내부 모듈 **********/
const navi = require('./modules/navi-conn');

/*********** 절대 경로 **********/
const publicPath = path.join(__dirname, './public');
const viewsPath = path.join(__dirname, './views');
const uploadPath = path.join(__dirname, './storage');

/*********** 세션 / 쿠키 **********/
app.set('trust proxy', 1); // trust first proxy
app.use(session);

/*********** 라우터 **********/
const gbookRouter = require('./router/gbook-router');
const gbookRouterApi = require('./router/gbook-api-router');
const boardRouter = require('./router/board-router');
const galleryRouter = require('./router/gallery-router');
const memberRouter = require('./router/member-router');

/*********** 서버 실행 **********/
app.listen(process.env.PORT, () => { console.log("http://127.0.0.1:"+process.env.PORT) });

/*********** pug 셋팅 (뷰엔진) **********/
app.set('view engine', 'pug');
app.set('views', viewsPath);
app.locals.pretty = true;
app.locals.headTitle = '노드 게시판'; // .locals : pug에 전달하는 변수들을 등록할 때 쓴다 (전역변수)
app.locals.navis = navi;

/***** AJAX / POST 데이터를 json으로 변경 *****/
app.use(express.json());
app.use(express.urlencoded({extended: false}));

/*********** Passport **********/
passportModule(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => { // 어느 페이지에서도 세션 정보를 가지고 있음
	// console.log(req.session.user); // { userid: 'lbke5', username: '이보경', emeil: 'lbke@naver.com' }
	// app.locals.user = req.session.user ? req.session.user : {}; // 세션에서 쓰이던 방식
	app.locals.user = req.user? req.user : {};
	next();
});

/*********** logger(morgan) Init **********/
app.use(logger);

/*********** 라우터 셋팅 **********/
app.use('/', express.static(publicPath)); // 접근 가능한 정적인 폴더
app.use('/gbook', gbookRouter);
app.use('/gbook/api', gbookRouterApi);
app.use('/upload', express.static(uploadPath));
app.use('/board', boardRouter);
app.use('/gallery', galleryRouter);
app.use('/member', memberRouter);

/*********** 오류 처리 **********/
app.use((req, res, next) => {
	const err = new Error();
	err.code = 404;
	err.msg = "요청하신 페이지를 찾을 수 없습니다.";
	next(err);
});
app.use((error, req, res, next) => {
	if(error.code !== 404) console.log(error);
	const code = error.code || 500;
	const msg = error.msg || "서버 내부 오류입니다. 관리자에게 문의하세요.";
	res.render('error.pug', { code, msg });
});