var Slide = (function(){
	function Slide(container, slide, type, cb) { // new Slide를 객체로 받겠다
		this.container = $(container);
		this.slide = $(container).find(slide);
		if (typeof type == "string") {
			this.type = type;  // type의 타입이 string이라면 
			this.cb = cb;
		}
		else if(typeof type == "function") {
			this.type = 'hori';
			this.cb = type;
		}
		else {
			this.type = 'hori';
			this.cb = undefined;
		}
		if(this.type == 'hori') horiInit();
		else if(this.type == 'scale') this.scaleInit();
		else if(this.type == 'vert') this.vertInit();
		else if(this.type == 'fade') this.fadeInit();
		else if(this.type == 'step') this.stepInit();
	}
	Slide.prototype.scaleInit = function() {
		var obj = this; // this = slide
		var now = 0;
		this.container.addClass("slide-wrap");
		this.slide.addClass("slide");
		this.btPrev = $('<div class="bt bt-prev"></div>').appendTo(this.container);
		this.btNext = $('<div class="bt bt-next"></div>').appendTo(this.container);
		// remove();는 jQuery를 return해줌 = 지워진 놈을 return
		var last = this.slide.length -1;

		this.btPrev.click(onPrev);
		this.btNext.click(onNext);
	
		function init() {
			obj.btPrev.show();
			obj.btNext.show();
			obj.container.children(".slide").remove();
			$(obj.slide[now]).appendTo(obj.container); // 초기화
		}
		function ani() {
			$(obj.slide[now]).appendTo(obj.container).css({"opacity": 0, "transform": "scale(1.2)"}); 
			setTimeout(function(){ // eq(0) = 사라질 애
				obj.container.find(".slide").eq(0).css({"opacity": 0, "transform": "scale(0.7)"});
				obj.container.find(".slide").eq(1).css({"opacity": 1, "transform": "scale(1)"});
				obj.cb(obj.container.find(".slide").eq(0), obj.container.find(".slide").eq(1), obj.container);	
				setTimeout(init, 500);
			}, 0);
		}
		function onPrev() {
			obj.btPrev.hide(); // 클릭하면 버튼 순간 사라지게
			now = (now == 0) ? last : now - 1;
			ani();
		}
		function onNext() {
			obj.btNext.hide(); // 클릭하면 버튼 순간 사라지게
			now = (now == 2) ? 0 : now + 1; 
			ani();
		}
		init();
	}
	return Slide; // 나를 리턴해줄거에요.
})(); // ()(); = 즉시 실행 함수



var Slide = { // container = .main-wrap | cb = onComplete
	scale : function(container, slide, cb) {
		var now = 0;
		var $container = $(container).addClass("slide-wrap");
		var $slide = $(slide).addClass("slide");
		var $btPrev = $('<div class="bt bt-prev"></div>').appendTo($container).click(onPrev);
		var $btNext = $('<div class="bt bt-next"></div>').appendTo($container).click(onNext);
		// remove();는 jQuery를 return해줌 = 지워진 놈을 return
		var last = $slide.length -1;
	
		function init() {
			$btPrev.show();
			$btNext.show();
			$container.children(".slide").remove();
			$($slide[now]).appendTo($container); // 초기화
		}
		function ani() {
			$($slide[now]).appendTo($container).css({"opacity": 0, "transform": "scale(1.2)"}); 
			setTimeout(function(){ // eq(0) = 사라질 애
				$container.find(".slide").eq(0).css({"opacity": 0, "transform": "scale(0.7)"});
				$container.find(".slide").eq(1).css({"opacity": 1, "transform": "scale(1)"});
				cb($container.find(".slide").eq(0), $container.find(".slide").eq(1), $container);	
				setTimeout(init, 500);
			}, 0);
		}
		function onPrev() {
			$(this).hide(); // 클릭하면 버튼 순간 사라지게
			now = (now == 0) ? last : now - 1;
			ani();
		}
		function onNext() {
			$(this).hide(); // 클릭하면 버튼 순간 사라지게
			now = (now == 2) ? 0 : now + 1; 
			ani();
		}
		init();
	}
};
