const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const pug = {headTitle: "Node/Express 갤러리", css: "gallery", js: "gallery"};
const { pool, mysqlErr, queryExecute, fileRev, uploadPath, storagePath } = require('../modules/mysql-conn');
const { upload } = require('../modules/multer-conn');
const pagerInit = require('../modules/pager-conn');
const { isAdmin, isUser, isUserApi, isGuest, isMine } = require('../modules/auth');
const { alert } = require('../modules/util');

let sql, sqlVal=[], result, pager;

/* 미들웨어 : (req, res, next) 변수를 가진 함수 */
/* const booldook = ((req, res, next) => {
	req.booldool = "Booldook3";
	console.log();
})

router.get(['/wr', '/wr/:id'], booldook, (req, res, next) => { // 주소줄 아닌 폼에서 보내기 때문에 post
	pug.title = '갤러리 등록'
	res.render('gallery/gallery-wr.pug', pug);
}); */

router.get(['/', '/list', '/list/:page'], async (req, res, next) => {
	pug.title = 'Gallery List';
	try {
		req.query.cnt = req.query.cnt || 15;
		pager = await pagerInit(req, '/gallery/list', 'gallery');
		sql = 'SELECT * FROM gallery ORDER BY id DESC LIMIT ?, ?';
		sqlVal = [pager.stRec, pager.cnt];
		result = await queryExecute(sql, sqlVal);
		pug.pager = pager;
		pug.lists = result;
		for(let v of pug.lists) {
			v.src = '//via.placeholder.com/300'
			v.src2 = v.src;
			if(v.savefile) {
				v.src = uploadPath(v.savefile);
				v.src2 = v.src;
			}
			if (v.savefile2) {
				v.src2 = uploadPath(v.savefile2);
			}
		} 
		res.render('gallery/gallery-li.pug', pug);
	}
	catch(e) {
		next(e);
	}
});

router.get(['/wr', '/wr/:id'], async (req, res, next) => { // 주소줄 아닌 폼에서 보내기 때문에 post
	let id = req.params.id; // 그냥 id값은 undefined이기 때문에 false
	if(!id) { // id가 존재하지 않다면 
		pug.title = 'Gallery registration';
		pug.list = null;
	}
	else { // id값이 들어왔다면
		pug.title = 'Gallery modify';
		sql = 'SELECT * FROM gallery WHERE id=' +id;
		result = await queryExecute(sql);
		pug.list = result[0];
		// pug.list = 객체 {id: 1, title: ㅇㅇ, writer: ㅇㅇㅇ...}
		if(pug.list.savefile) pug.list.src = uploadPath(pug.list.savefile);
		if (pug.list.savefile2)	pug.list.src2 = uploadPath(pug.list.savefile2);
	}
	res.render('gallery/gallery-wr.pug', pug);
});

router.get('/view/:id', async (req, res, next) => { // 모달창으로 떠서 페이지 변화가 없으므로 res.json 을 사용
	let id = req.params.id;
	try {
		sql = 'SELECT * FROM gallery WHERE id=' +id;
		result = await queryExecute(sql);
		res.json(result[0]); // savefile 명
	}
	catch(e) {
		res.json(e);
	}
});

router.get('/rev/:id', isUser, async (req, res, next) => { // 실제 데이터 지우기
	try {
		let id = req.params.id;
		let savefile = req.query.savefile;
		let savefile2 = req.query.savefile2; // undefined or 파일명
		if(savefile) await fileRev(savefile);
		if(savefile2) await fileRev(savefile2);
		sql = `DELETE FROM gallery WHERE id=${id} AND uid=${req.user.id}`;
		result = await queryExecute(sql);
		if(result.affectedRows > 0) res.redirect('/gallery');
		else res.send(alert('본인의 글만 삭제하실 수 있습니다.', '/'));
	}
	catch(e) {
		next(e);
	}
});

router.get('/download/:id', async(req, res, next) => {
	let id = req.params.id;
	let seq = req.query.seq; // 첫번째 이미지냐 두번째 이미지냐
	let savefile, realfile;
	try {
		sql = `SELECT savefile${seq}, realfile${seq} FROM gallery WHERE id=${id}`;
		result = await queryExecute(sql);
		savefile = result[0][`savefile${seq}`]; // result[0][0]['savefile2'] == result[0][0].savefile2
		realfile = result[0][`realfile${seq}`];
		savefile = storagePath(savefile);
		// dirname : C:\Users\hi\Desktop\이보경\코딩\19.node-board\router
		// C:\Users\hi\Desktop\이보경\코딩\19.node-board\storage\200731\200731-aefe-2fe3-...jpg
		res.download(savefile, realfile);
	}
	catch(e) {
		next(e);
	}
});


// upload.fields
router.post('/save', isUser, isMine, upload.fields([{name: 'upfile'}, {name: 'upfile2'}]), async (req, res, next) => {
	sqlVal = []; // push 구문에서는 초기화 시키기
	let { id, savefile, savefile2, title, writer, content } = req.body;
	if(req.banExt) {
		res.send(`<script>alert('${req.banExt} 타입은 업로드 할 수 없습니다.')</script>`);
	}
	else {
		try {
			sqlVal[0] = title;
			sqlVal[1] = writer;
			sqlVal[2] = content;
			if(id) sql = 'UPDATE gallery SET title=?, writer=?, content=?';
			else sql = 'INSERT INTO gallery SET title=?, writer=?, content=?';
			if(req.files['upfile']) { // req.files.upfile // 기존의 파일을 없애기
				if(id && savefile) await fileRev(savefile); // 수정하는데 기존 파일이 있을 때 (파일 교체할 때)
				sql += ', realfile=?, savefile=?';
				sqlVal.push(req.files['upfile'][0].originalname);
				sqlVal.push(req.files['upfile'][0].filename);
			}
			if(req.files['upfile2']) {
				if(id && savefile2) await fileRev(savefile2);
				sql += ', realfile2=?, savefile2=?';
				sqlVal.push(req.files['upfile2'][0].originalname);
				sqlVal.push(req.files['upfile2'][0].filename);
			}
			sqlVal.push(req.user.id);
			if(id) sql += ' WHERE uid=? AND id='+id; // 수정모드
			else sql += ', uid=?'; // INSERT 부분
			result = await queryExecute(sql, sqlVal);
			if(result.affectedRows > 0) res.redirect('/gallery');
			else res.send(alert('본인의 글만 수정하실 수 있습니다.'), '/');
		}
		catch(e) {
			next(e);
		}
	}
});

// upload.array 
// gallery-wr.pug에서 name은 다 upfile로 하고, id를 다르게 주면 배열로 들어옴
/* router.post('/save', upload.array('upfile'), async (req, res, next) => {
	let id = req.body.id;
	if(req.banExt) {
		res.send(`<script>alert('${req.banExt} 타입은 업로드 할 수 없습니다.')</script>`);
	}
	else {
		try {
			sqlVal[0] = req.body.title;
			sqlVal[1] = req.body.writer;
			sqlVal[2] = req.body.content;
			if (id) sql = 'UPDATE gallery SET title=?, writer=?, content=?';
			else sql = 'INSERT INTO gallery SET title=?, writer=?, content=?';
			for(var i in req.files) {
				if (i == 0) sql += ', realfile=?, savefile=?';
				else sql += ', realfile'+(Number(i)+1)+'=?, savefile'+(Number(i)+1)+'=?';
				sqlVal.push(req.files[i].originalname);
				sqlVal.push(req.files[i].filename);
				}
				if (id) sql += '';
				const connect = await pool.getConnection();
				const result = await connect.execute(sql, sqlVal); 
				connect.release();
				res.redirect('/gallery');
			}
		catch(e) {
			console.log(e);
			next(e);
		}
	}
}); */

router.get('/api-img/:id', isUserApi, async (req, res, next) => {
	try {
		let id = req.params.id;
		let { n, file } = req.query;
		sql = `UPDATE gallery SET savefile${n}=NULL, realfile${n}=NULL WHERE id=${id} AND uid=${req.user.id}`;
		result = await queryExecute(sql);
		if(result.affectedRows > 0){
			result = await fileRev(file);
			res.json({code: 200, result});
		}
		else {
			res.json({error: {code: 500, msg: '본인의 글만 삭제할 수 있습니다.'}});
		}
	}
	catch(e) { // json을 보내는 애는 에러를 next로 보내는것보다 response 해주는것이 좋음
		res.json(e);
	}
});

module.exports = router;