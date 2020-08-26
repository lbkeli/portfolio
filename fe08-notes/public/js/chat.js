/*********** 전역 설정 ************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;
var ref = null;

/*********** 사용자 지정 ************/
function init() {
	db.ref("root/chats/").on("child_added", onAdded); // db.ref("root/chats/") 모든 글 다 받음
}

/*********** 이벤트 콜백 ************/
function onAdded(r) {
	var html;
	// ↓ 내가 보낸거라면
	if(user.uid === r.val().writer_id)	html  =	'<div class="chat p-2 me">';
	else html  =	'<div class="chat p-2">';
	html +=	'<div class="cont text-light p-3">'+r.val().chat+'</div>';
	html +=	'<div class="writer">'+r.val().writer+'</div>';
	html +=	'</div>';
	$(".chat-stage").append(html);
	$(".chat-stage").scrollTop($(".chat-stage")[0].scrollHeight); // 순수 자바스크립트
	// scrollHeight : 채팅이 많아지면 알아서 스크롤이 맨 밑으로 내려가게 하기
}

function onAuth(r) {
	if(r) { // 로그인 상태
		$(".bt-login").hide();
		$(".bt-logout").show();
		user = r;
		init();
	}
	else { // 로그아웃 상태
		$(".bt-login").show();
		$(".bt-logout").hide();
		user = null;
		$(".chat").remove();
	}
}

function onLogin() {
	auth.signInWithPopup(googleAuth);
}
function onLogout() {
	auth.signOut();
}

function onSave() {
	var chat = $("#chat-txt").val().trim(); // trim = 앞 뒤 공백 자르기
	if(chat == "") alert("메세지를 작성하세요.");
	else {
		db.ref("root/chats").push({
			chat: chat,
			writer: user.displayName,
			writer_id: user.uid,
			createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
		}).key;
	}
	$("#chat-txt").val('');
}

/*********** 이벤트 선언 ************/
auth.onAuthStateChanged(onAuth);
$(".bt-login").click(onLogin);
$(".bt-logout").click(onLogout);
$(".bt-save").click(onSave);