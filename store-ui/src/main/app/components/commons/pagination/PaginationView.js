'use strict';
var PaginationView = Backbone.View.extend({
    pageSize: 0,
    pageIndex: 0,
    totalElements: 0,
    maxPagesAtOnce: 10,
    pagesDistanceFromIndex: 5,

    initialize: function (options) {
        this.pageSize = options && options.pageSize || 10;
        this.pageIndex = options && options.pageIndex || 0;
        this.totalElements = options && options.totalElements || 0;
        if (options && typeof options.urlBuilder == 'function') this.urlBuilder = options.urlBuilder;
        this.render();
    },

    render: function () {
        var me = this;

        this.totalPages = this.totalElements / this.pageSize;
        if (me.totalPages > 1 && this.totalElements % this.pageSize > 0) me.totalPages = parseInt(me.totalPages) + 1;

        var data = {
              pages : [],
              next : "#",
              previous : "#",
              ellipsis : {
                  left : false,
                  right : false
              }
        };

        for (var i = 0; i < me.totalPages; i++) {
            data.pages.push({
                text : i + 1,
                active : this.pageIndex === i,
                url : this.urlBuilder({pageIndex : i})
            });
        }

        if (this.pageIndex > 0) data.previous = data.pages[this.pageIndex - 1];
        if (this.pageIndex < me.totalPages) data.next = data.pages[this.pageIndex + 1];

        if (this.totalPages > this.maxPagesAtOnce) {
            var left = this.pageIndex - this.pagesDistanceFromIndex;
            var right = this.pageIndex + this.pagesDistanceFromIndex;

            data.ellipsis.left = left > 0;
            data.ellipsis.right = right < this.totalPages - 1;

            if (data.ellipsis.left && !data.ellipsis.right) {
                left = this.totalPages - this.maxPagesAtOnce;
                right = this.totalPages;
            }
            if (!data.ellipsis.left && data.ellipsis.right) {
                left = 0;
                right = 0 + this.maxPagesAtOnce;
            }

            data.pages = data.pages.slice(left, right);
        }

        this.$el.append(app.templates['commons/pagination/pagination.hbs'](data));

        $("li:not('.next-prev') a", me.$el).on("click", function (e) {
            if (!e.ctrlKey && e.which != 2 && e.which != 3) {
                e.preventDefault();
                e.stopPropagation();
                if (me.totalPages > 1) {
                    var link = $(e.target);
                    me.pageIndex = parseInt(link.text(), 10) - 1;
                    $("li.active", me.$el).removeClass("active");
                    $(link).parent().addClass("active");
                    me._enableNextPrev();
                    me.trigger("change:pageIndex");
                }
            }
        });

        $("li.prev", me.$el).on("click", function (e) {
            if (!e.ctrlKey && e.which != 2 && e.which != 3) {
                e.preventDefault();
                e.stopPropagation();
                if (me.pageIndex > 0) {
                    me.pageIndex -= 1;
                    var activeItem = $("li.active", me.$el);
                    activeItem.removeClass("active");
                    activeItem.prev().addClass("active");
                    me._enableNextPrev();
                    me.trigger("change:pageIndex");
                }
            }
        });

        $("li.next", me.$el).on("click", function (e) {
            if (!e.ctrlKey && e.which != 2 && e.which != 3) {
                e.preventDefault();
                e.stopPropagation();
                if (me.pageIndex < me.totalPages - 1) {
                    me.pageIndex += 1;
                    var activeItem = $("li.active", me.$el);
                    activeItem.removeClass("active");
                    activeItem.next().addClass("active");
                    me._enableNextPrev();
                    me.trigger("change:pageIndex");
                }
            }
        });

        me._enableNextPrev();
    },
    _enableNextPrev: function() {
        if (this.totalPages > 1 && this.pageIndex === 0) {
            $("li.prev", this.$el).addClass("disabled");
            $("li.next", this.$el).removeClass("disabled");
        }
        if (this.pageIndex > 0 && this.pageIndex < (this.totalPages - 1)) {
            $("li.prev", this.$el).removeClass("disabled");
            $("li.next", this.$el).removeClass("disabled");
        }
        if (this.pageIndex === this.totalPages -1) {
            $("li.prev", this.$el).removeClass("disabled");
            $("li.next", this.$el).addClass("disabled");
        }
    },
    reset: function() {
        this.pageIndex = 0;
        this._enableNextPrev();
        this.trigger("change:pageIndex");
    },
    urlBuilder : function() {
        return "#";
    }
});