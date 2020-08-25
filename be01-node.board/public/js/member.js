function onMemberSubmit(f) {
	if ($("input[name='useridChk']", "form[name='memberForm']").val() && $("input[name='userpwChk']", "form[name='memberForm']").val() && $("input[name='usernameChk']", "form[name='memberForm']").val()) return true;
	else return false;
}

// member form 안의 userid (find 역할)
$("input[name='userid']", "form[name='memberForm']").blur(function(){ 
	var $input = $(this);
	$.get('/member/api/idchk', { userid: $(this).val() }, function(r) {
		if(r.code == 200) {
			$input.addClass('border-blue').removeClass('border-red');
			$input.next().attr('class', 'text-primary').html(r.msg);
			$("input[name='useridChk']", "form[name='memberForm']").val(true);
		}
		else {
			$input.addClass('border-red').removeClass('border-blue');
			$input.next().attr('class', 'text-danger').html(r.msg);
			$("input[name='useridChk']", "form[name='memberForm']").val(false);
			$input.focus();
		}
	});
});

// $("body, html")	 = $("html")과 $("body")
// $("body", "html") = $("html").find("body")
$("input[name='userpw'], input[name='userpw2']", "form[name='memberForm']").blur(function(){
	var $input = $(this);
	var $pw = $("input[name='userpw']", "form[name='memberForm']")
	var $pw2 = $("input[name='userpw2']", "form[name='memberForm']")
	var value = $input.val().trim();
	if (value.length < 8 || value.length > 24) {
		$input.addClass('border-red').removeClass('border-blue');
		$input.next().attr('class', 'text-danger').html('패스워드는 8 ~ 24자 입니다.');
		$("input[name='userpwChk']", "form[name='memberForm']").val(false);
	}
	else {
		if ($pw.val() == $pw2.val()) {
			$pw2.next().html('');
			$pw.addClass('border-blue').removeClass('border-red');
			$pw2.addClass('border-blue').removeClass('border-red');
			$pw.next().attr('class', 'text-primary').html('사용 가능합니다.');
			$("input[name='userpwChk']", "form[name='memberForm']").val(true);
		}
		else {
			$pw.addClass('border-red').removeClass('border-blue');
			$pw2.addClass('border-red').removeClass('border-blue');
			$pw.next().attr('class', 'text-danger').html('패스워드가 일치하지 않습니다.');
			$("input[name='userpwChk']", "form[name='memberForm']").val(false);
		}
	}
});

$("input[name='username']", "form[name='memberForm']").blur(function(){
	var $input = $(this);
	var value = $input.val().trim();
	if (value == "") {
		$input.addClass('border-red').removeClass('border-blue');
		$input.next().attr('class', 'text-danger').html('이름을 작성하세요.');
		$("input[name='usernameChk']", "form[name='memberForm']").val(false);
	}
	else {
		$input.addClass('border-blue').removeClass('border-red');
		$input.next().attr('class', 'text-primary').html('사용 가능합니다.');
		$("input[name='usernameChk']", "form[name='memberForm']").val(true);
	}
});

var $userid = $("form[name='loginForm']").find("input[name='userid']"); // DOM
var $userpw = $("form[name='loginForm']").find("input[name='userpw']");

function onLoginSubmit(f) {
	var userid = $userid.val().trim(); // 값
	var userpw = $userpw.val().trim();
	if (userid == "") {
		$userid.next().removeClass("d-none");
		$userid.focus();
		return false;
	}
	if (userpw == "") {
		$userpw.next().removeClass("d-none");
		$userpw.focus();
		return false;
	}
	return true;
}
$userid.keyup(onKeyUp);
$userpw.keyup(onKeyUp);

function onKeyUp() { // js = onkeyup / jquery = keyup
	if ($(this).val().trim().length > 0) {
		$(this).next().addClass("d-none");
	}
}