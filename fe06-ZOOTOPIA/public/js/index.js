function onResize() {
  this.wid = $(this).innerWidth();
	this.hei = $(this).innerHeight();
}

function onScroll() {
  var scTop = $(this).scrollTop();
  if (scTop > $(".main-wrap").innerHeight()) {
    $(".header").stop().slideDown(500);
  }
  else $(".header").stop().slideUp(500);
}

function onTop() {
  $("html, body").stop().animate({"scrollTop": 0}, 500); 
}

$(window).resize(onResize).trigger("resize");
$(window).scroll(onScroll).trigger("scroll");
$(".bt-top").click(onTop);