/********** 사용자 지정 **********/
function mainAnimation(top, bot) {
	$(".main-wrap .main-purple").stop().animate({
		"top": 0,
		"left": 0
	}, 700, function () {
		$(".main-wrap .main-title").stop().animate({
			"top": top,
			"opacity": 1
		}, 500, function () {
			$(".main-wrap .main-person").stop().animate({
				"opacity": 1
			}, 700, function () {
				$(".main-wrap .main-cali").stop().animate({
					"bottom": bot
				}, 1000)
			});
		});
	});
}

/********** album-wrap 동적 생성 **********/
$.get("../json/album.json", onAlbumLoad);

function onAlbumLoad(r) {
	var html;
	for (var i in r.album) {
		html = '<li class="list">';
		html += '<div class="list-lt">';
		html += '<div class="title">' + r.album[i].title + '</div>';
		html += '<div class="artist">' + r.album[i].artist + '</div>';
		html += '</div>';
		html += '<div class="list-rt">';
		html += '<div class="time">' + r.album[i].time + '</div>';
		html += '<div class="down"><i class="fa fa-download"></i></div>';
		html += '<div class="play">▷</div>';
		html += '</div>';
		html += '</li>';
		$(".album-wrap .lists").append(html);
	}
}

/********** tour-wrap 직접 코딩 **********/
var tourNow = 0, tourSize = 7; 
var tours = [], tourArr = [];
var tourLast;
var tourLeft;
var tourTar = 0;
var root = $(".tour-wrap");
var tours = $(".tours", root);

$.get("../json/tours.json", onToursLoad);

function onToursLoad(r) {
	tourLast = r.tours.length - 1;
	tourBars();
	var html = '';
	for (var i in r.tours) {
		html  = '<li class="tours">';
		html += '<div class="tour-img">';
		html += '<img src="' + r.tours[i].src + '" alt="" class="img">';
		html += '<div class="badge">';
		html += '<div class="badge-date">' + r.tours[i].date + '</div>';
		html += '<div class="badge-txt">';
		html += '<div class="tour-name">' + r.tours[i].name + '</div>';
		html += '<div class="tour-place">' + r.tours[i].place + '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</li>';
		tours.push($(html).appendTo(".tour-slide-wrap", root));
	}
	tourInit();
}

function tourBars() {
	for (var i = 0; i <= tourLast; i++) {
		$('<span class="bar"></span>').appendTo(".tour-slide-bar", root)
	}
}

$(".bt-prev", root).click(onPrev);
$(".bt-next", root).click(onNext);


function tourInit() {
	var trans = tourNow%2;
	$(".tour-slide-wrap", root).css("left", "-20%");
	$(".tours", root).remove();
	tourArr = [];
	tourArr[1] = tourNow;
	tourArr[0] = (tourNow == 0) ? tourLast : tourNow - 1;
	for (var i = 2; i < tourSize; i++) {
		tourArr[i] = (tourArr[i - 1] == tourLast) ? 0 : tourArr[i - 1] + 1;
	} 
	for (var i in tourArr) {
		$(tours[tourArr[i]]).clone().appendTo(".tour-slide-wrap", root);
	}
	$(".tours").each(function(){
		if($(this).index()%2) $(this).css("transform", "translateY(50px)");
		else $(this).css("transform", "none");
	});
	$(".tour-slide-bar .bar", root).removeClass("active");
	$(".tour-slide-bar .bar", root).eq(tourNow).addClass("active");
}

function onPrev() {
	tourNow = (tourNow == 0) ? tourLast : tourNow - 1;
	tourTar = 0;
	tourAni();
}

function onNext() {
	tourNow = (tourNow == tourLast) ? 0 : tourNow + 1;
	tourTar = "-40%";
	tourAni();
}

console.log($(".tour-slide-bar .bar", root).click("hi"));
$(".tour-slide-bar .bar", root).click(onTourBarClick);
function onTourBarClick() {
	$(".tour-slide-bar .bar", root).removeClass("active");
	$(".tour-slide-bar .bar", root).eq(0).addClass("active");
	var tourTar = [];
	var old = tourNow;
	tourNow = $(this).index();
	tourTar = (tourNow > old) ? "-40%" : 0;
	$(".tour-slide-wrap", root).stop().animate({"left": tourTar}, 500, tourInit);
	tourAni();
}

function tourAni() {
	$(".tours").each(function(){
		if($(this).css("transform") == "none") {
			$(this).css("transform", "translateY(50px)")
		}
		else {
			$(this).css("transform", "none");
		}
	});
	$(".tour-slide-wrap", root).stop().animate({"left": tourTar}, 500, tourInit);
}

/********** shop-wrap 직접 코딩 **********/
var prdNow = 0;
var prdSize = 8;
var prdTar = 0;
var root2 = $(".prd-wrap");
var prd = $(".prd", root2);
var prdLast = prd.length -3;
var prdArr = [];
var interval;
prdBars();

function prdBars() {
	for (var i=0; i<=prdLast; i++) $('<span class="bar"></span>').appendTo(".prd-slide-bar", root2);
}

$(".bt-prev", root2).click(onPrdPrev);
$(".bt-next", root2).click(onPrdNext);
$(".bar", root2).click(onPrdBarClick);


interval = setInterval(onPrdNext, 3000);
$(root2).hover(function(){
	clearInterval(interval);
}, function(){
	interval = setInterval(onPrdNext, 3000);
});

prdInit();

function prdInit() {
	$(".prds", root2).css("left", "-30%");
	$(".prd", root2).remove();
	prdArr = [];
	prdArr[1] = prdNow;
	prdArr[0] = (prdNow == 0) ? prdLast : prdNow -1;
	for (var i=2; i<prdSize; i++) {
		prdArr[i] = (prdArr[i-1] == prdLast) ? 0 : prdArr[i-1] + 1;
	} 
	for (var i in prdArr) {
		$(prd[prdArr[i]]).clone().appendTo(".prds", root);
	}
	$(".bar", root2).removeClass("active");
	$(".bar", root2).eq(prdNow).addClass("active");
}

function onPrdPrev() {
	prdNow = (prdNow == 0) ? prdLast : prdNow -1;
	prdTar = "-10%";
	prdAni();
}
function onPrdNext() {
	prdNow = (prdNow == prdLast) ? 0 : prdNow +1;
	prdTar = "-50%";
	prdAni();
}
function onPrdBarClick() {
	var prdTar = [];
	var old = prdNow;
	prdNow = $(this).index();
	prdTar = (prdNow > old) ? "-50%" : "-10%";
	prdAni();
}

function prdAni() {
	$(".prds", root2).stop().animate({"left": prdTar}, 500, prdInit);
}

/********** 이벤트 콜백 **********/
function onResize() {
	this.wid = $(this).innerWidth();
	this.hei = $(this).innerHeight();

	if (wid > 1800) mainAnimation("50%", "-1%");
	if (wid > 1700) mainAnimation("50%", "24px"); 
	else if (wid > 1200) {} 
	else if (wid > 991) mainAnimation("10%", "60px"); 
	else if (wid > 767) mainAnimation("40%", "85px");
}

function onScroll() {
	var idx = 0;
	var offsetY = [];
	var scTop = $(this).scrollTop();
	var header = $(".header-wrap .header2");
	if (scTop >= $(".main-wrap").innerHeight()) {
		header.css({
			"display": "flex",
			"position": "fixed"
		});
		if (!header.hasClass("active")) header.addClass("active").stop().animate({
			"top": 0
		}, 300);
		$(".bt-top").stop().fadeIn(200);
	} else if (scTop < $(".main-wrap").innerHeight()) {
		header.stop().animate({
			"top": "-70px"
		}, 300, function () {
			$(this).css({
				"display": "none"
			});
			$(this).removeClass("active");
		});
		$(".bt-top").stop().fadeOut(200);
	}
	if (scTop >= this.innerHeight/2) {
		$(".header .navi-wing-wrap").stop().animate({"right": "-512px"}, 500);
	}
	for (var i=0; i < $(".page").length; i++) {
		offsetY[i] = $(".page").eq(i).offset().top;
	}
	for (var i=0; i < offsetY.length; i++) {
		if (scTop <= offsetY[i]) {
			idx = i;
			break;
		}
	}
	$(".listen-icon").css("background-color", $(".page").eq(idx).data("bg"));
	$(".listen-icon").css("color", $(".page").eq(idx).data("color"));
	$(".listen-text ").css("color", $(".page").eq(idx).data("bg"));
	$(".bt-top").css("color", $(".page").eq(idx).data("bg"));
}

function onTop() {
	$("html, body").stop().animate({"scrollTop": 0}, 500);
}

var naviIdx = $(".header .navi-c").index();
$(".header .navi-c").hover(onNaviHover, onNaviLeave);
function onNaviHover(){
	$(this).siblings().addClass("active");
	$(this).find(".navi-sub").eq(naviIdx).css("opacity", 1).stop().slideDown(300);
}
function onNaviLeave(){
	$(this).siblings().removeClass("active");
	$(this).find(".navi-sub").eq(naviIdx).stop().slideUp(200);
}

$(".header .navi-sub .sub").hover(onSubHover, onSubLeave);
function onSubHover(){
	$(this).not(".active").css({"transform": "translateX(8px)", "color": "rgba(93,81,108,.7)"});
}
function onSubLeave(){
	$(this).not(".active").css({"transform": "translateX(0)", "color": "#5d516c"});
}

$(".header .navi-sub .sub.ab").hover(onAbHover, onAbLeave);
function onAbHover(){
	$(this).find(".sub-abs").css("opacity", 1).fadeIn(300);
}
function onAbLeave(){
	$(this).find(".sub-abs").fadeOut(200);
}

$(".header .navi-sub .sub-abs-sub").hover(onAbsHover, onAbsLeave);
function onAbsHover(){
	$(this).css({"transform": "translateX(8px)", "color": "rgba(93,81,108,.7)"});
}
function onAbsLeave(){
	$(this).css({"transform": "translateX(0)", "color": "#5d516c"});
}

function onWingClick() {
	$(".header .navi-wing-wrap").stop().animate({"right": "0"}, 500);
}
function onWingClose() {
	$(".header .navi-wing-wrap").stop().animate({"right": "-512px"}, 500);
}

function onBookingClick() {
	alert("예약이 완료되었습니다.");
}

/********** 이벤트 등록 **********/
$(window).resize(onResize).trigger("resize");
$(window).scroll(onScroll).trigger("scroll");

$(".bt-top").click(onTop);
$(".logo").click(onTop);
$(".header .navi-icon.wing").click(onWingClick);
$(".navi-wing-wrap .navi-wing-icon").click(onWingClose);
$(".booking-wrap .bt-booking").click(onBookingClick);