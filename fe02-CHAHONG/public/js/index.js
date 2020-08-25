/************ 전역변수 *************/
var datas;
var mainNow = 0;
var mainPrev, mainNext, mainLast;
var infoChk = true;

/************ Initialize *************/
mainAjax();
emailjs.init('user_JzXbuCvvO9NMJ3mdMSt3S');

/************ 사용자함수 *************/
function mainAjax() {
	$.get("../json/banner.json", function(res){
		datas = res.banners;
		mainLast = datas.length - 1;
		mainPager();
		mainInit();
	});
}

function mainInit() {
	mainPrev = (mainNow == 0) ? mainLast : mainNow - 1;
	mainNext = (mainNow == mainLast) ? 0 : mainNow + 1;
	$(".main-wrap").find(".slide").remove();
	$(htmlMaker(mainNow)).appendTo(".main-wrap").css({
		"position": "relative",
		"transition": "transform 0.5s"
	});
	$(htmlMaker(mainPrev)).appendTo(".main-wrap").css("top", "-200vh");
	$(htmlMaker(mainNext)).appendTo(".main-wrap").css("top", "200vh");
	$(".main-wrap .pager").removeClass("active");
	$(".main-wrap .pager").eq(mainNow).addClass("active");
	setTimeout(function(){
		$(".main-wrap").find(".slide").eq(0).find(".ani-trans").css("transform", "translateX(0)");
	}, 300);
}

function htmlMaker(n) {
	html  = '<div class="slide">';
	html += '<img src="'+datas[n].src+'" class="img">';
	html += '<div class="mask"></div>';
	html += '<div class="slide-content '+datas[n].class+'">';
	html += '<h2 class="title serif ani-trans">'+datas[n].title+'</h2>';
	html += '<h3 class="desc kr ani-trans">'+datas[n].desc+'</h3>';
	html += '<div class="bts">';
	for(var i=0, bt; i<datas[n].buttons.length; i++) {
		bt = datas[n].buttons[i];
		html += '<a href="'+bt.link+'" class="'+bt.class+' ani-trans">'+bt.title+'</a>';
	}
	html += '</div>';
	html += '</div>';
	html += '</div>';
	return html;
}

function mainPager() {
	for(var i=0; i<=mainLast; i++) {
		$('<span class="pager"> </span>').appendTo(".main-wrap .pagers").click(onPagerClick);
	}
}

function fixShow(show) {
	if(show) {
		$(".header > .fix-wrap").css("display", "block");
		setTimeout(function(){
			$(".header > .fix-wrap").addClass("active");
			$(".header > .fix-wrap > div").addClass("active");
		}, 0);
	}
	else {
		$(".header > .fix-wrap").removeClass("active");
		$(".header > .fix-wrap > div").removeClass("active");
		setTimeout(function(){
			$(".header > .fix-wrap").css("display", "none");
		}, 500);
	}
}

/************ 이벤트콜백 *************/
function onResize() {
	$('#background').YTPlayer();
	$(".main-wrap").css("margin-top", $(".header").outerHeight() + "px");
	var classHei = $(".class-wrap .item").eq(0).outerWidth() * 0.75;
	$(".class-wrap .item").outerHeight(classHei);
}

function onScroll() { 
	var scTop = $(this).scrollTop();
	var bottom = scTop + $(this).innerHeight() - 200; 

	$(".ani").each(function(){
		if (bottom > $(this).offset().top) {
			if ($(this).hasClass("pers")) $(this).parent().css("perspective", "400px");
			if ($(this).data("delay")) $(this).css("animation-delay", $(this).data("delay"));
			$(this).css("animation-play-state", "running");
		}
	});

	if (bottom > $(".info-wrap").offset().top && infoChk){
		$(".info-wrap").find(".title").each(function(idx){
			var $obj = $(this).find(".score");
			var speed	  = Number ($(this).data("speed"));
			var gap 		= Number ($(this).data("gap"));
			var target  = Number ($(this).data("target"));
			var interval = setInterval(function(){ 
				var value = Number ($obj.html());
				$obj.html(value + gap);
				if (value >= target) {
					clearInterval(interval);
					$obj.html(target);
				} 
			}, speed);
		});	
	}
	if (scTop > 800) $(".bt-top").css("visibility", "visible"); 
	else $(".bt-top").css("visibility", "hidden");
}

function onNaviHover() {
	$(this).find(".subs").stop().fadeIn(500);
}

function onNaviLeave() {
	$(this).find(".subs").stop().fadeOut(500);
}

function onBarClick() {
	if($(this).hasClass("default")) {
		$(this).removeClass("default").addClass("active");
		fixShow(true);
	}
	else if($(this).hasClass("active")) {
		$(this).removeClass("active").addClass("default");
		fixShow(false);
	}
	else {
		$(this).addClass("active");
		fixShow(true);
	}
}

function onNaviChildClick() {
	$(this).next().stop().slideToggle(500);
	$(this).children("i").toggleClass("active");
}

function onMainPrev() {
	$(".main-wrap > .slide").eq(0).css("transform", "translateY(0)");
	$(".main-wrap > .slide").eq(1).stop().animate({"top": 0}, 500, function() {
		mainNow = (mainNow == 0) ? mainLast : mainNow - 1;
		mainInit();
	});
}

function onMainNext() {
	$(".main-wrap > .slide").eq(0).css("transform", "translateY(0)");
	$(".main-wrap > .slide").eq(2).stop().animate({"top": 0}, 500, function() {
		mainNow = (mainNow == mainLast) ? 0 : mainNow + 1;
		mainInit();
	});
}

function onPagerClick() {
	var target = [];
	var old = mainNow;
	mainNow  = $(this).index();
	if(mainNow > old) {
		target[0] = "0";
		target[1] = "-100vh";
	}
	else if(mainNow < old) {
		target[0] = "-0";
		target[1] = "100vh";
	}
	else {
		return false;
	}
	$(".main-wrap > .slide").not($(".main-wrap > .slide").eq(0)).remove();
	$(htmlMaker(mainNow)).appendTo(".main-wrap").css("top", target[0]);
	$(".main-wrap > .slide").eq(0).css("transform", "translateY("+target[1]+")");
	$(".main-wrap > .slide").eq(1).stop().animate({"top": 0}, 500, mainInit);
}

function onMasonry (){
		$masonry.masonry({
			itemSelector: '.class',
			columnWidth: '.class-sizer',
			percentPosition: true
		});
}

function onContact(event) {
	event.preventDefault();
	this.contact_number.value = Math.random() * 100000 | 0;
	emailjs.sendForm('gmail', 'gym-temp', this); 
	alert("온라인 예약이 완료되었습니다.");
	this.reset();
}

function onTopClick (){
	$("html, body").stop().animate({"scrollTop": 0}, 800);
}

/************ 이벤트선언 *************/
$(window).resize(onResize).trigger("resize");
$(window).scroll(onScroll).trigger("scroll");

$(".header .navi-child").hover(onNaviHover, onNaviLeave);
$(".header .navi-bars").click(onBarClick);
$(".header .navi-child-mo").click(onNaviChildClick);

$(".main-wrap > .bt-prev").click(onMainPrev);
$(".main-wrap > .bt-next").click(onMainNext);

$("section").imagesLoaded(onResize);

var $masonry = $(".classes").imagesLoaded(onMasonry);

$('#contactForm').submit(onContact);

$(".bt-top").click(onTopClick);