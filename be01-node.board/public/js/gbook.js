// uglyify 시키기
// uglifyjs ./public/js/gbook.js -c -m -o ./public/js/gbook.min.js
function onGbookSubmit(f) { // f = form
	if(f.writer.value.trim() == "") {// trim : 앞 뒤 공백 잘라냄
		alert('작성자란이 비어있습니다.');
		f.writer.focus();
		return false;
	}
	if(f.comment.value.trim() == "") {// trim : 앞 뒤 공백 잘라냄
		alert('한줄 내용이 비어있습니다.');
		f.comment.focus();
		return false;
	}
	return true;
}