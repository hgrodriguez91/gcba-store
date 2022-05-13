var DraggableSlider = function(options) {
    var me = this;
    this.el = $(options.el);
    this.itemList = this.el.find("ul");
    this.slides = me.itemList.find("li").length;
    this.slideWidth = options.slideWidth || 150;
    this.arrows = {
            back : $('<span class="draggable-slider-arrow back"></span>'),
            forward : $('<span class="draggable-slider-arrow forward"></span>')
    };
    var startWidth = this.el.width();
    var mobileDetect = new MobileDetect(window.navigator.userAgent);

    var resizeHandler = function(e) {
        startWidth = me.el.width();
        me.itemList.stop().animate({
            left: 0
        }, 400, 'easeOutCubic');
        if (me.el.width() < me.slides * me.slideWidth) {
            me.arrows.back.show();
            me.arrows.forward.show();
            me.itemList.width(me.slides*me.slideWidth);
        } else {
            me.arrows.back.hide();
            me.arrows.forward.hide();
            me.itemList.width("");
        }
    };

    var render = function() {
        me.el.addClass("draggable-slider");
        $(window).on("resize", resizeHandler);
        var min = 0;
        var max = me.el.width() < me.slides * me.slideWidth ? me.el.width() - me.slides * me.slideWidth : 0;
        var xStart = 0;
        var yStart = 0;
        var yTolerance = 8;
        var dragginLikeABoss = false;

        me.itemList.width(me.slides*me.slideWidth);
        if (mobileDetect.phone() || (mobileDetect.mobile() && $(window).width() < 768)) {
            me.itemList.on("mousedown", function(e) {
                xStart = e.clientX;
                yStart = e.clientY;
            });

            me.itemList.on("mouseup", function(e) {
                xStart = 0;
                yStart = 0;
                dragginLikeABoss = false;
            });

            me.itemList.on("mousemove", function(e) {
                var left = 0;
                if (Math.abs(yStart - e.clientY) > yTolerance) {
                    return;
                }
                if (!dragginLikeABoss) {
                    dragginLikeABoss = true;
                    var delta = (e.clientX - xStart);
                    left = $(this).position().left + delta * (300 / Math.abs(delta * 2));

                    if (left > min) {
                        left = min;
                    } else if (left < max) {
                        left = max;
                    }

                    $(this).stop().animate({
                        left: left
                    }, 200,'easeOutCubic', function() {
                        dragginLikeABoss = false;
                    });
                }
            });
        } else {
            /*Using Jquery UI for desktop*/
            me.itemList.draggable({
                axis : "x",
                cursor : "move",
                drag: function (event, ui) {
                    var max = me.el.width() < me.slides * me.slideWidth ? me.el.width() - me.slides * me.slideWidth : 0;
                    if (ui.position.left > min) {
                        $(this).stop();
                        ui.position.left = min;
                    } else if (ui.position.left < max) {
                        $(this).stop();
                        ui.position.left = max;
                    } else {
                        $(this).stop().animate({
                            left: ui.position.left
                        }, 200,'easeOutCubic');
                    }
                }
            });
        }

        me.itemList[0].addEventListener('touchstart', touchHandler, true);
        me.itemList[0].addEventListener('touchmove', touchHandler, true);
        me.itemList[0].addEventListener('touchend', touchHandler, true);
        me.itemList[0].addEventListener('touchcancel', touchHandler, true);

        me.el.prepend(me.arrows.back);
        me.el.append(me.arrows.forward);
        me.arrows.back.on("mousedown touchstart", back);
        me.arrows.forward.on("mousedown touchstart", forward);
        resizeHandler();
        return me;
    };

    var touchHandler = function(event) {
        var touch = event.changedTouches[0],
            simulatedEvent = document.createEvent('MouseEvent');

        simulatedEvent.initMouseEvent(
             { touchstart: 'mousedown', touchmove: 'mousemove', touchend: 'mouseup' } [event.type],
             true, true, window, 1, 
             touch.screenX, touch.screenY, touch.clientX, touch.clientY,
             false, false, false, false, 0, null);

        touch.target.dispatchEvent(simulatedEvent);
    };

    var destroy = function() {
        $(window).off("resize", showArrows);
        me.el.removeClass("draggable-slider");
        me.el.off("resize");
        me.itemList.draggable({
            disabled : true
        });
        me.arrows.back.off("mousedown touchstart");
        me.arrows.forward.off("mousedown touchstart");
        me.el.detach(me.arrows.back);
        me.el.detach(me.arrows.forward);
    };

    var back = function() {
        var left = me.itemList.position().left;
        var newLeft = left + 150 > 0 ? 0 : left + 150;
        me.itemList.stop().animate({
            left: newLeft
        }, 400, 'easeOutCubic');
    };

    var forward = function() {
        var left = me.itemList.position().left;
        var max = me.el.width() - me.slides * 150;
        var newLeft = left - 150 < max ? max : left -150;
        me.itemList.stop().animate({
            left: newLeft
        }, 400, 'easeOutCubic');
    };

    return {
        render : render,
        destroy : destroy,
        back : back,
        forward : forward
    };
};