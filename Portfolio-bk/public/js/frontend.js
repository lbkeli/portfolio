/******* 내비게이션 클릭, 닫기 *******/
$(".navi-icon").click(onNaviClick);
$(".bt-close").click(onModalClose);
$(".modal-navi-wrap").click(onModalClose);
$(".modal-navi-wrap .modal-wrap").click(onModalWrap);

function onNaviClick() {
  $(".dash-border").css({"z-index": 997, "background-color": "6fa485"});
  $(".dash-border section").css({"opacity": 0, "transition": "all 0.5s"});
  $(".bt-wrap img").css({"opacity": 0, "transition": "all 0.5s"});
  $(".page-title").css({"opacity": 0, "transition": "all 0.5s"});
  setTimeout(onModalOpen, 500);
}
function onModalOpen() {
  $(".modal-navi-wrap").css({"display": "flex", "animation-name": "flipInY"});
}
function onModalClose() {
  $(".modal-navi-wrap").css({"animation-name": "flipOutY"});
  setTimeout(function(){
    $(".dash-border").css({"z-index": 0, "background-color": "transparent", "transition": "all 0.5s"});
    $(".bt-wrap img").css({"opacity": 1, "transition": "all 0.5s"});
    $(".page-title").css({"opacity": 1, "transition": "all 0.5s"});
    $(".dash-border section").css({"opacity": 1, "transition": "all 0.5s"});
  }, 500);
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

/******* 슬라이드 동적 생성 *******/
var pfNow = 0;
var pfSize = 8, pfLast, pfTar;
var pfLt = [];
var pfRt = [];
var ltAni, rtAni;

$.get('../json/frontend.json', onFrontEndLoad);

function onFrontEndLoad(r){
  pfLast = r.frontend.length -1;
  var html;
  for (var i in r.frontend) {
    html  = '<div class="desc-wrapper">';
    html += '<div class="title-wrap">';
    html += '<h3 class="site-title">'+r.frontend[i].title+'</h3>';
    html += '<div class="desc-wrap">';
    html += '<p> 100% 개인 작업</p>';
    html += '<p>제작 기간 :'+r.frontend[i].during+'</p>';
    html += '</div>';
    html += '</div>';
    html += '<div class="sub-wrap">';
    html += '<p class="renewal">'+r.frontend[i].renewal+'</p>';
    html += '<p class="used">';
    html += '<span>#Used</span> &nbsp'+r.frontend[i].used+'';
    html += '</p>';
    html += '<p class="skill">'+r.frontend[i].skill+'</p>';
    html += '<div class="color-font-wrap">';
    html += '<div class="color-wrap">';
    html += '<div class="color-title">Color</div>';
    html += '<div class="color-flex">';
    html += '<div class="color1">';
    html += '<div class="color-box cb1" style="background-color:'+r.frontend[i].colorName1+';"></div>';
    html += '<div class="color-name">'+r.frontend[i].colorName1+'</div>';
    html += '</div>';
    html += '<div class="color2">';
    html += '<div class="color-box cb2" style="background-color:'+r.frontend[i].colorName2+';"></div>';
    html += '<div class="color-name">'+r.frontend[i].colorName2+'</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="font-wrap">';
    html += '<div class="font-title">Font</div>';
    html += '<p class="font1" style="font-family: '+r.frontend[i].font1+'">'+r.frontend[i].font1+'</p>';
    html += '<p class="font2" style="font-family: '+r.frontend[i].font2+'">'+r.frontend[i].font2+'</p>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    pfLt.push($(html));

    html  = '<div class="site-wrapper">';
    html += '<a href="'+r.frontend[i].siteHref+'" target="_blank" class="bt-view-mo">View Site</a>';
    html += '<img src="../img/f-site-top-800.png" alt="리뉴얼사이트" class="site-top img">';
    html += '<div class="site-video">';
    html += '<video muted autoplay loop preload>';
    html += '<source src="'+r.frontend[i].videoSrc+'" type="video/mp4">';
    html += '</video>';
    html += '</div>';
    html += '<a href="'+r.frontend[i].siteHref+'" target="_blank" class="bt-view">View Site</a>';
    html += '</div>';

	  pfRt.push($(html));
  }
  for (var i=0; i<=r.frontend.length-1; i++) $(".pager-wrap").append('<i class="pager fa-circle"></i> ');
	$(".pager").click(onPager);
  pfInit();
}

function pfInit() {
	$(".left-wrapper").html(pfLt[pfNow].clone());
  $(".right-wrapper").html(pfRt[pfNow].clone());
  $(".pager").removeClass("fa").addClass("far");
  $(".pager").eq(pfNow).removeClass("far").addClass("fa");
}

$(".bt-next").click(onNext);
$(".bt-prev").click(onPrev);


function onNext() {
  pfNow = (pfNow == pfLast) ? 0 : pfNow +1;
  pfAni();
}
function onPrev() {
  pfNow = (pfNow == 0) ? pfLast : pfNow -1;
  pfAni();
}
function onPager() {
  pfNow = $(this).index();
  pfAni();
}

ltAni = {"opacity": 0, "bottom": "-100%"};
rtAni = {"opacity": 0, "top": "-100%"};

$(window).resize(onResize).trigger("resize");
function pfAni() {
  $(".left-wrapper").stop().animate(ltAni, 300, function(){
    pfInit();
    $(this).stop().animate({"opacity": 1, "bottom": 0}, 500);
  });
  $(".right-wrapper").css("z-index", 10000).stop().animate(rtAni, 300, function(){
    // $(".dash-border").css("overflow-y", "hidden")
    pfInit();
    $(this).stop().animate({"opacity": 1, "top": 0}, 500);
  });
}

function onResize() {
	if($(this).width() > 1400) {
    ltAni = {"opacity": 0, "bottom": "-100%"};
		rtAni = {"opacity": 0, "top": "-100%"};
  }
	else {
		ltAni = {"opacity": 0};
		rtAni = {"opacity": 0, "top": "200%"};
  }
} 

/*
(function($){
  $(window).on("load",function(){
      $(".content").mCustomScrollbar();
  });
})(jQuery);
*/