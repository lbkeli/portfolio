const multer = require('multer');
const moment = require('moment');
const path = require('path');
const fs = require('fs'); // file system (mkdir, exist 사용 위해)
const {	v4: uuidv4 } = require('uuid');

const allowImgExt = ['jpg', 'png', 'jpeg', 'gif'];
const allowFileExt = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp', 'pdf', 'txt', 'zip', 'jpg', 'png', 'jpeg', 'gif'];

/* 
// fs.Promises 사용하기
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir); 
*/

// req , file: 사용자가 업로드한 파일, cb: 함수(err, folder명/file명)
/*
	const result = makeFolder(); // 콜백이 나한테 다시 돌아오는 재귀 패턴
	if(result.err) cb(err);	// 에러를 보내주면 multer가 에러를 처리해줄 것임
	else cb(null, result.folder); // 에러가 없을 때 result.folder를 넣어줘라
*/
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const result = makeFolder();
		result.err ? cb(err) : cb(null, result.folder);
	},
	filename: (req, file, cb) => {
		let ext = path.extname(file.originalname); // 확장자 
		let saveName = moment().format('YYMMDD') + '-' + uuidv4() + ext; 
		cb(null, saveName);
	}
});
const upload = multer({ storage, limits: { fileSize: 2048000 }, fileFilter });

function makeFolder() {
	/*
	result : {err: null, folder: 'c:\..\..'} 폴더만들거나 존재할때
	result : {err: err, folder: 'c:\..\..'} 폴더만들기 실패
	*/
	const result = { err: null };
	let folder = path.join(__dirname, '../storage', moment().format('YYMMDD'));
	result.folder = folder;
	if (!fs.existsSync(folder)) { // 내가 준 폴더가 존재하는지 true / false로 알려줌
		fs.mkdir(folder, (e) => {
			if(e) result.err = e;
			return result;
		});
	}
	return result;
}

function fileFilter(req, file, cb) {
	let ext = path.extname(file.originalname).toLowerCase().substr(1); // 몽땅 소문자로
	if(allowImgExt.indexOf(ext) > -1) cb(null, true);
	// else cb(new Error({code : 415, msg : '허용되지 않는 파일 형식 입니다.'})); // indexOf : 배열에 얘가 있는지 찾기 / 못찾으면 -1, 찾으면 해당 위치의 자릿수
	else { 
		req.banExt = ext; 
		cb(null, false);
	}
}

module.exports = { upload };