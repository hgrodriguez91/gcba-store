var ResponsiveSlider = function(options) {
    var me = this;
    this.el = $(options.el);
    this.slides = this.el.find("li");
    this.mouseOverElement = false;
    this.transition = options.transition || {
        automatic : true,
        delay : 5000
    };
    this.arrows = {
            prev : this.el.find(".prev"),
            next : this.el.find(".next")
    };
    var interval = null;

    var render = function() {
        me.el.addClass("responsive-slider");
        me.slides.first().addClass("active-slide");
        me.el.find(".image-as-background img").each(function() {
            $(this).parent().css("background", "rgba(0,0,0,0) url("+ $(this).attr("src") +") no-repeat center center / cover");
        });
        me.arrows.prev.on("mousedown", prev);
        me.arrows.next.on("mousedown", next);
        me.el.hover(sliderHoverIn, sliderHoverOut);
        if (me.transition.automatic) start();
        return me;
    };

    var destroy = function() {
        me.el.removeClass("responsive-slider");
        me.slides.removeClass("active-slide");
        me.arrows.prev.off("mousedown");
        me.arrows.next.off("mousedown");
    };

    var start = function() {
        stop();
        if (me.transition.automatic && !me.mouseOverElement) {
            interval = setInterval(next, me.transition.delay);
        }
    };

    var stop = function() {
        if (interval) clearInterval(interval);
    };

    var next = function() {
        stop();
        var nowShowing = me.slides.filter(".active-slide");
        var nextOne = nowShowing.next();
        if (nextOne.length == 0) {
            nextOne = me.slides.first();
        }
        nowShowing.removeClass("active-slide");
        nextOne.addClass("active-slide");
        start();
    };

    var prev = function() {
        stop();
        var nowShowing = me.slides.filter(".active-slide");
        var prevOne = nowShowing.prev();
        if (prevOne.length == 0) {
            prevOne = me.slides.last();
        }
        nowShowing.removeClass("active-slide");
        prevOne.addClass("active-slide");
        start();
    };

    var sliderHoverIn = function() {
        me.mouseOverElement = true;
        stop();
    };

    var sliderHoverOut = function() {
        me.mouseOverElement = false;
        start();
    };

    return {
        render : render,
        destroy : destroy,
        stop : stop,
        start : start,
        next : next,
        prev : prev
    };
};