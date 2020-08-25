var KAKAO_KEY = '3d2de5a4d928c0d39a85f3bea254d7a2'

/********** 슬라이드 직접 코딩 (main-wrap) **********/
var mainNow = 0;
var mainSlide = $(".main-wrap > .banner");
var mainLast = mainSlide.length -1;
var mainTitles = [
	"How our story begins",
	"Stand for something good",
	"Brand story"
];
var mainWriters = [
	'쉐이크쉑은 2001년, 뉴욕 메디슨 스퀘어 공원 복구 사업을 위한 USHG*의 핫도그 카트에서 시작되었습니다.<br>공원 내 "I ♥ TAXI" 아트워크로 꾸며진 핫도그 카트는 매해 여름, 쉑팬들이 길게 줄 섰을 정도로 인기를 끌었습니다. <br>2004년, 많은 인기에 힘입어 메디슨 스퀘어 공원에 ‘SHAKE SHACK’ 이라는 간판을 걸고 시작한 것이 전 세계가 사랑하는 브랜드, 쉐이크쉑이 되었습니다.', 
	'쉐이크쉑은 세상에 필요한 사려깊은 가치를 통해 좋은 사회를 만들고자 합니다.<br>깐깐하게 엄선한 최상의 식재료, 자연을 생각한 친환경 인테리어, 지역 사회와 함께 성장하는 공헌 활동까지 쉐이크쉑은 가치 실현을 위해 노력하고 있습니다.<br>“세상에 필요한 사려깊은 가치”는 쉐이크쉑의 신념이자 앞으로 나아가야할 방향입니다.',
	'쉐이크쉑의 모든 메뉴는 좋은 식재료에서 시작됩니다.<br>쉐이크쉑은 자연과 함께, 이웃과 함께하는 공간을 설계합니다.<br>쉐이크쉑은 활기 넘치는 지역 사회의 모임공간입니다.'
];
$(".main-wrap").find(".slogan").html(mainTitles[mainNow]);
$(".main-wrap").find(".writer > span").html(mainWriters[mainNow]);
mainInit();

function mainInit() {
	$(".main-wrap > .banner").remove();
	$(mainSlide[mainNow]).appendTo(".main-wrap");	
}

function mainAni() {
	var slide = $(mainSlide[mainNow]).appendTo(".main-wrap").css({"transform": "scale(1.3)", "opacity": 0});
	setTimeout(function(){
		slide.css({"transform": "scale(1)", "opacity": 1});
	}, 0);
	setTimeout(mainInit, 500);
	$(".main-wrap").find(".slogan").css({"transform": "scale(0.8)", "opacity": "0"});
	$(".main-wrap").find(".writer").css({"transform": "translateY(50px)", "opacity": "0"});
	setTimeout(function(){
		$(".main-wrap").find(".slogan").html(mainTitles[mainNow]);
		$(".main-wrap").find(".writer > span").html(mainWriters[mainNow]);
		$(".main-wrap").find(".slogan").css({"transform": "scale(1)", "opacity": "1"});
		$(".main-wrap").find(".writer").css({"transform": "translateY(0)", "opacity": "1"});
	}, 1000);
}

function onMainPrev() {
	mainNow = (mainNow == 0) ? mainLast : mainNow -1;
	mainAni();
}
function onMainNext() {
	mainNow = (mainNow == mainLast) ? 0 : mainNow + 1; 
	mainAni();
}

$(".main-wrap > .bt-prev").click(onMainPrev);
$(".main-wrap > .bt-next").click(onMainNext);


/********** 슬라이드 직접 코딩2 (special-wrap) **********/
var prdNow = 0, prdSize = 6;
var prds = [], prdArr = [];
var prdLast, prdLeft, prdNext, prdTar;

$(".prd-wrapper > .bt-left").click(onPrdLeft);
$(".prd-wrapper > .bt-right").click(onPrdRight);

$.get("../json/prds.json", onPrdLoad);
function onPrdLoad(r) {
	prdLast = r.prds.length - 1;
	var html = '';
	for(var i in r.prds) {
		html  = '<li class="prd">';
		html += '<div class="prd-img"><img src="'+r.prds[i].src+'" alt="" class="img"></div>';
		html += '<div class="prd-title">'+r.prds[i].title+'</div>';
		html += '<div class="prd-price">'+r.prds[i].price+'</div>';
		html += '</li>'
		console.log($(html));
		prds.push($(html));
	}
	prdInit();
}

function prdInit() { 
	prdArr = [];
	prdArr[1] = prdNow;
	prdArr[0] = (prdNow == 0) ? prdLast : prdNow - 1;
	for(var i=2; i<prdSize; i++) prdArr[i] = (prdArr[i-1] == prdLast)? 0 : prdArr[i-1] + 1;
	for(var i=0; i<prdArr.length; i++) $(prds[prdArr[i]]).clone().appendTo(".prd-wrap");
}

function onPrdLeft() {
	prdTar = 0;
	prdNow = (prdNow == 0) ? prdLast : prdNow -1;
	prdAni();
}
function onPrdRight() {
	prdTar = prdLeft * 2 + "%";
	prdNow = (prdNow == prdLast) ? 0 : prdNow +1;
	prdAni();
}
function prdAni() {
	$(".prd-wrap").stop().animate({"left": prdTar}, 500, function(){
		$(this).empty().css({"left": prdLeft+"%"});
		prdInit();
	});
}

/********** loc-wrap 동적 생성 **********/
$.get("../json/locations.json", onLocationLoad);

function onLocationLoad(r) {
	var html = '';
	for(var i in r.locs) {
		html  = '<li class="store">';
		html += '<div class="photo">';
		html += '<img src="'+r.locs[i].src+'" alt="매장사진" class="img">';
		html += '<div class="loc-photo"><img src="'+r.locs[i].addrsrc+'" alt="매장이름" class="img"></div>';
		html += '</div>';
		html += '<div class="cont-wrapper">';
		html += '<p class="cont">'+r.locs[i].cont+'';
		html += '</p>';
		html += '<div class="cont-bottom">';
		html += '<div class="addr">';
		html += '<i class="fa fa-map-marker-alt"></i>';
		html += '<span>Address : '+r.locs[i].addr+'</span>';
		html += '</div>';
		html += '<div class="time">';
		html += '<i class="fa fa-clock"></i>';
		html += '<span>Open : '+r.locs[i].time+'</span>';
		html += '</div>';
		html += '<div class="phone">';
		html += '<i class="fa fa-phone"></i>';
		html += '<span>Phone : '+r.locs[i].tel+'</span>';
		html += '</div>';
		html += '<button data-lat="'+r.locs[i].lat+'" data-lon="'+r.locs[i].lon+'" class="bt-map bt-green" >See on Map</button>';
		html += '</div>';
		html += '</div>';
		html += '</li>';
		$(".loc-wrap .store-wrap").append(html);
	}
	$(".store-wrap").find(".bt-map").click(onMapOpen);
	$(".modal-map").find(".bt-close").click(onMapClose);
	$(".modal-map").click(onMapClose);
	$(".modal-map .modal-wrap").click(onModalWrap)
	$(".modal-map .modal-wrap").on("mousewheel", onModalWheel);
	$(".modal-map .modal-wrap").on("DOMMouseScroll", onModalWheel);
}

function onMapOpen() {
	$(".modal-map").css({"display": "flex", "opacity": 0}).stop().animate({"opacity": 1}, 500);
	var lat = $(this).data("lat");
	var lon = $(this).data("lon");
	var container = document.getElementById('map'); 
	var options = {center: new kakao.maps.LatLng(lat, lon), level: 2};
	var map = new kakao.maps.Map(container, options);
	var markerPosition  = new kakao.maps.LatLng(lat, lon);
	var marker = new kakao.maps.Marker({position: markerPosition});
	marker.setMap(map);
}
function onMapClose() {
	$(".modal-map").stop().animate({"opacity": 0}, 500, function(){
		$(this).css("display", "none");
	})
}
function onModalWrap(e) {
	e.stopPropagation();  
}

function onModalWheel(e) {
	e.stopPropagation();
	e.preventDefault();
}

/********** Menu 동적 생성 **********/
$.get("../json/menus.json", onMenuLoad);

function onMenuLoad(r) {
	var html = '';
	for(var i in r.menus) {
	html  = '<li class="menu clear">';
	html += '<div class="menu-img"><img src="'+r.menus[i].src+'" alt="" class="img"></div>';
	html += '<h3 class="menu-title rc">'+r.menus[i].title+'</h3>';
	html += '<div class="menu-price rc">'+r.menus[i].price+'</div>';
	html += '</li>';
	$(".menus").append(html);
	}
}

/********** news-wrap 동적 생성 **********/
var newsNow = 0,  newsSize = 5, newsLast, newsLeft, newsTar;
var newss = [], newsArr = [];

$(".news-wrapper > .bt-left").click(onNewsLeft);
$(".news-wrapper > .bt-right").click(onNewsRight);

$.get("../json/news.json", onnewsLoad);
function onnewsLoad(r) {
	newsLast = r.news.length - 1;
	var html = '';
	for(var i in r.news) {
		html  = '<li class="news">';
		html += '<div class="news-img">';
		html += '<img src="'+r.news[i].src+'"class="img">';
		html += '<div class="badge-tag rc">';
		for(var j in r.news[i].badge) {
			html += '<div class="badge">'+r.news[i].badge[j]+'</div>';
		}
		html += '</div>';
		html += '<div class="badge-date rc">';
		html += '<div class="month">'+moment(r.news[i].date).format('MMM')+'</div>';
		html += '<div class="day">'+moment(r.news[i].date).format('DD')+'</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="news-title rc">'+r.news[i].title+'</div>';
		html += '<div class="news-tag">';
		for(var j in r.news[i].tag) {
		html += '<span class="tag">'+r.news[i].tag[j]+'</span>';
	}
		html += '</div>';
		html += '<div class="news-cont">'+r.news[i].cont+'</div>';
		html += '<button class="bt-ghost bt-more">Read more <span>▶</span></button>';
		html += '</li>';
		newss.push($(html));		
	}
	newsInit();
}

function newsInit() {
	newsArr = [];
	newsArr[1] = newsNow;
	newsArr[0] = (newsNow == 0) ? newsLast : newsNow - 1;
	for(var i=2; i<newsSize; i++) newsArr[i] = (newsArr[i-1] == newsLast) ? 0 : newsArr[i-1] + 1;
	for(var i=0; i<newsArr.length; i++) $(newss[newsArr[i]]).clone().appendTo(".news-wrap");
}

function onNewsLeft() {
	newsTar = 0;
	newsNow = (newsNow == 0) ? newsLast : newsNow - 1;
	newsAni();
}

function onNewsRight() {
	newsTar = newsLeft * 2 + "%";
	newsNow = (newsNow == newsLast) ? 0 : newsNow + 1;
	newsAni();
}

function newsAni() {
	$(".news-wrap").stop().animate({"left": newsTar}, 500, function(){
		$(this).empty().css({"left": newsLeft+"%"});
		newsInit();
	});
}

/********** press-wrap 동적 생성 **********/
$.get("../json/press.json", onPressLoad);
function onPressLoad(r) {
	var html;
	for(var i in r.press) {
		html  =	'<li class="press">';
		html +=	'<div class="logo"><img src="'+r.press[i].logo+'" alt=""></div>';
		html +=	'<div class="cont">'+r.press[i].content+'</div>';
		html +=	'<div class="writer">'+r.press[i].writer+'</div>';
		html +=	'</li>';
		$(".press-ul").append(html);
	}
}

/********** 이벤트 콜백 **********/
function onResize() {
	this.wid = $(this).innerWidth();
	this.hei = $(this).innerHeight();
	
	if(wid > 991) {
		prdLeft = -25;
		newsLeft = -33.3333;
		onNaviHide();
	 } 
	else if(wid > 767) {
		prdLeft = -33.3333;
		newsLeft = -50; 
	}
	else if(wid > 479) {
		prdLeft = -50;
		newsLeft = -100; 
	}
	else if(wid <= 479) {
		prdLeft = -100;
		newsLeft = -100;
	}
	$(".prd-wrap").css("left", prdLeft+"%");
	$(".news-wrap").css("left", newsLeft+"%");
}

function onScroll() {
	this.scTop = $(this).scrollTop();
	if(scTop + 84 > hei) { 
		$(".header").css({"top": 0, "bottom": "auto", "position": "fixed"});
	}
	else {
		$(".header").css({"top": "auto", "bottom": 0, "position": "absolute"});
	}


	var nowPage = -10;
	for(var i=$(".page").length -1; i>=0; i--) {
		if(	$(".page").eq(i).offset().top <= scTop) {
			nowPage = i;
			break;
		}
	}
	$(".navi-mo").find(".navi").css("color", "#333");
	$(".navi-mo").find(".navi").eq(nowPage).css("color", "#e6ac65");

	var locStart = $(".loc-wrap").offset().top;
	var locHei = $(".loc-wrap").innerHeight();
	var locEnd = locStart + locHei + hei;
	var locGap = 0;
	var locSpeed = 400
	if(scTop + hei > locStart && scTop + hei < locEnd) {
		locGap = (locSpeed/2) - Math.round((scTop + hei - locStart) / (locEnd - locStart) * locSpeed);
		$(".loc-wrap").css("background-position-y", locGap+"%");
	}

	var pressStart = $(".press-wrap").offset().top;
	var pressHei = $(".press-wrap").innerHeight();
	var pressEnd = pressStart + pressHei + hei;
	var pressGap = 0;
	var pressSpeed = 200;
	if(scTop + hei > pressStart && scTop + hei < pressEnd) {
		pressGap = (pressSpeed/2) - Math.round((scTop + hei - pressStart) / (pressEnd - pressStart) * pressSpeed); 
		$(".press-wrap").css("background-position-y", pressGap + "%");
	}
	(scTop > hei) ? $(".bt-top").show() : $(".bt-top").hide();
}

function onTop() {
	$("html, body").stop().animate({"scrollTop": 0}, 500);
}

function onNaviShow() {
	$(".navi-mo").css("display", "block");
	setTimeout(function(){
		$(".header .bt-close").css("opacity", 1);
		$(".navi-mo").css("background-color", "rgba(0,0,0,0.7)");
		$(".navi-mo").find(".navi-wing").css("right", 0);
	}, 0);
}

function onNaviHide() {
	$(".navi-mo").css("background-color", "transparent");
	$(this).stop().animate({"opacity": 0}, 500, function(){
		$(".navi-mo").find(".navi-wing").css("right", "-320px");
		setTimeout(function(){
			$(".navi-mo").css("display", "none");
		}, 500);
	});
}

function onNaviClick() {
	console.log(	$(this).index()	);
	var tar = $(".page").eq($(this).index()).offset().top +1;
	$("html, body").stop().animate({"scrollTop": tar}, 500);
}

function onLogoClick() {
	$("html, body").stop().animate({"scrollTop": 0}, 500);
}

/********** 이벤트 등록 **********/
$(window).resize(onResize).trigger("resize");
$(window).scroll(onScroll).trigger("scroll");

$(".bt-top").click(onTop);
$(".header .navi-bars").click(onNaviShow);
$(".header .bt-close").click(onNaviHide);
$(".header > .navi").click(onNaviClick); 
$(".header .navi-mo .navi").click(onNaviClick); 
$(".header > .logo").click(onLogoClick);