/*******  첫화면 글씨 움직임 *******/
setTimeout(function(){
  $(".sans-serif").eq(0).css({"transform": "translateX(0)", "transition": "transform 0.5s"});
  $(".sans-serif").eq(1).css({"transform": "translateX(7vw)", "transition": "transform 0.75s"});
  setTimeout(function(){
    $(".serif").eq(0).css({"transform": "translateX(-4vw)", "transition": "transform 0.75s"});
    $(".serif").eq(1).css({"transform": "translateX(-10vw)", "transition": "transform 0.5s"});
  }, 0)
}, 200);
setTimeout(function(){
  $(".char-icon").css("animation-name", "bounceIn");
}, 1000)

/******* 캐릭터 호버 *******/
$(".char-icon").hover(onCharHover, onCharLeave);
function onCharHover() {
  $(this).css({"transform": "rotate(0)"});
  $(".y-circle").css("background-color", "#bcb7ff");
}
function onCharLeave() {
  $(this).css({"transform": "rotate(10deg)"});
  $(".y-circle").css("background-color", "#fadc41");
}

/******* 내비게이션 클릭, 닫기 *******/
$(".navi-icon").click(onNaviClick);
$(".bt-close").click(onModalClose);
$(".modal-navi-wrap").click(onModalClose);
$(".modal-navi-wrap .modal-wrap").click(onModalWrap);

function onNaviClick() {
  $(".dash-border").css({"z-index": 997, "background-color": "#f4a6b9"});
  $(".dash-border div").css({"opacity": 0, "transition": "all 0.5s"});
  setTimeout(onModalOpen, 500);
}
function onModalOpen() {
  $(".modal-navi-wrap").css({"display": "flex", "animation-name": "flipInY"});
}
function onModalClose() {
  $(".modal-navi-wrap").css({"animation-name": "flipOutY"});
  setTimeout(function(){
    $(".dash-border").css({"z-index": 0});
    $(".dash-border div").css({"opacity": 1, "transition": "all 0.5s"});
  }, 600);
}
function onModalWrap(e) {
  e.stopPropagation();
}

/******* 내비게이션 호버 *******/
$(".modal-h2-1").hover(function(){
	$(this).css({"color": "#ffd1d1", "background-image": "url(../img/modal-bar.png)"});
}, function(){
	$(this).css({"color": "#e97f65", "background-image": "unset"});
});
$(".modal-h2-2").hover(function(){
	$(this).css({"color": "#ffd1d1", "background-image": "url(../img/modal-bar2.png)"});
}, function(){
	$(this).css({"color": "#e97f65", "background-image": "unset"});
});

/******* 텍스트 움직임 효과 *******/
var liY = ['0vw', '2vw','11vw', '21vw', '31vw'], liX = ['0vw', '27vw','15vw', '2vw', '15vw'];

$(window).mousemove(onMove);
function onMove(e) {
	var x=[], y=[];
	var gap1 = 0.01;
	var gap2 = 0.02;
	var gap3 = 0.03;
	var gap4 = 0.04;
	var gap5 = 0.05;
	var halfWidth = $(this).innerWidth() / 2;
	var halfHeight = $(this).innerHeight() / 2;
	var $li = $(".title-wrap").find("li");

	x[0] = (e.pageX - halfWidth) * gap2;
	y[0] = (e.pageY - halfHeight) * gap2;

	x[1] = (e.pageX - halfWidth) * gap4;
	y[1] = (e.pageY - halfHeight) * gap1;

	x[2] = (e.pageX - halfWidth) * gap1;
	y[2] = (e.pageY - halfHeight) * gap3;

	x[3] = (e.pageX - halfWidth) * gap5;
	y[3] = (e.pageY - halfHeight) * gap4;

	x[4] = (e.pageX - halfWidth) * gap1;
	y[4] = (e.pageY - halfHeight) * gap1;

	for(var i=0; i<$li.length; i++) {
		gap = Math.random() * 0.2 + 0.1;
		if(i == 2 || i == 4) {
			$li.eq(i).css("left", "calc("+liX[i]+" + "+ x[i] +"px)");
			$li.eq(i).css("top", "calc("+liY[i]+" + "+ y[i] +"px)");
		}
		else {
			$li.eq(i).css("left", "calc("+liX[i]+" - "+ x[i] +"px)");
			$li.eq(i).css("top", "calc("+liY[i]+" - "+ y[i] +"px)");
		}
	}
}

$(window).resize(onResize).trigger("resize");
function onResize() {
	$(".title-wrap").find("li").each(function(i){
		$(this).css({"left": liX[i], "top": liY[i]});
	});
}
