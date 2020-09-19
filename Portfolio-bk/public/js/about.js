/******* 내비게이션 클릭, 닫기 *******/
$(".navi-icon").click(onNaviClick);
$(".bt-close").click(onModalClose);
$(".modal-navi-wrap").click(onModalClose);
$(".modal-navi-wrap .modal-wrap").click(onModalWrap);

function onNaviClick() {
  $(".dash-border").css({"z-index": 997, "background-color": "#bba8dc"});
  $(".dash-border section").css({"opacity": 0, "transition": "all 0.5s"});
  $(".dash-border h2").css({"opacity": 0, "transition": "all 0.5s"});
  setTimeout(onModalOpen, 500);
}
function onModalOpen() {
  $(".modal-navi-wrap").css({"display": "flex", "animation-name": "flipInY"});
}
function onModalClose() {
  $(".modal-navi-wrap").css({"animation-name": "flipOutY"});
  setTimeout(function(){
    $(".dash-border").css({"z-index": 0});
    $(".dash-border section").css({"opacity": 1, "transition": "all 0.5s"});
    $(".dash-border h2").css({"opacity": 1, "transition": "all 0.5s"});
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

/******* 그래프바 *******/
$(".design-wrap .photoshop-wrap .graph").css({"width": "90%", "transition": "all 1.5s"});
$(".design-wrap .illustrator-wrap .graph").css({"width": "95%", "transition": "all 1.5s"});
setTimeout(function(){
  $(".publishing-wrap .html-wrap .graph").css({"width": "95%", "transition": "all 1.5s"});
  $(".publishing-wrap .css-wrap .graph").css({"width": "95%", "transition": "all 1.5s"});
  $(".publishing-wrap .javascript-wrap .graph").css({"width": "75%", "transition": "all 1.5s"});
  $(".publishing-wrap .jquery-wrap .graph").css({"width": "85%", "transition": "all 1.5s"});
}, 700, setTimeout(function(){
  $(".development-wrap .node-wrap .graph").css({"width": "30%", "transition": "all 1.5s"});
  $(".development-wrap .vue-wrap .graph").css({"width": "30%", "transition": "all 1.5s"});
  $(".development-wrap .github-wrap .graph").css({"width": "85%", "transition": "all 1.5s"});
}, 1400));

$(".skill-wrapper .box").hover(function(){
  $(this).css({"transform": "scale(1.1)", "transition": "all 0.5s"});
}, function(){
  $(this).css({"transform": "scale(1)", "transition": "all 0.5s"});
});

$(".contact-wrapper > div").hover(function(){
  $(this).find("img").css({"transform": "scale(1.1) rotate(-15deg)", "transition": "all 0.5s"})
  $(this).find("p").css({"color": "#d7cbff", "transition": "all 0.5s", "text-shadow": "2px 2px 3px #7a69b3b7"});
}, function(){
  $(this).find("img").css({"transform": "scale(1) rotate(0)", "transition": "all 0.5s"})
  $(this).find("p").css({"color": "#fde7e9", "transition": "all 0.5s", "text-shadow": "none"});
});

$(".bk-wrap img").hover(function(){
  $(this).css({"transform": "rotate(-10deg)", "transition": "all 0.5s"});
}, function(){
  $(this).css({"transform": "rotate(0)", "transition": "all 0.5s"});
});

