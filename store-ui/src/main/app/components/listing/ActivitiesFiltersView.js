var ActivitiesFiltersView = BaseView.extend({
    initialize: function(options) {
        BaseView.prototype.initialize.apply(this, arguments);
        this.data = options.data;
        this.data.appliedFilters = [];
        this.data.locationFilters = [];
        this.data.categoryFilters = [];
        this.data.priceRanges = [];
        this.data.isFree = false;
    },
    preRender: function() {
        if (this.data.location_filters) {
            this.data.locationFilters = _.map(this.data.location_filters, function(location) {
                return {
                    text : location.name,
                    link : buildActivitiesListURL({
                        location : location.public_code,
                        childLocation : this.data.childLocation,
                        category : this.data.category,
                        collectionCode : this.data.collectionCode,
                        fromPrice : this.data.fromPrice,
                        toPrice : this.data.toPrice,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                }
            }, this);
        }
        if (this.data.category_filters) {
            this.data.categoryFilters = _.map(this.data.category_filters, function(category) {
                return {
                    text : category.name + ' (' + category.count + ')',
                    link : buildActivitiesListURL({
                        location : this.data.location,
                        childLocation : this.data.childLocation,
                        category : category.public_code,
                        collectionCode : this.data.collectionCode,
                        fromPrice : this.data.fromPrice,
                        toPrice : this.data.toPrice,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                }
            }, this);
        }
        if (this.data.location && this.data.location_applied_filter) {
            var appliedFilter = this.data.location_applied_filter;
            var parentFilter = null;
            while (appliedFilter) {
                parentFilter = appliedFilter.parent || null;
                this.data.appliedFilters.push({
                    text : appliedFilter.name,
                    link : buildActivitiesListURL({
                        category : this.data.category,
                        location : parentFilter ? parentFilter.public_code : null,
                        collectionCode : this.data.collectionCode,
                        fromPrice : this.data.fromPrice,
                        toPrice : this.data.toPrice,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                });
                appliedFilter = parentFilter;
            }
        }
        if (this.data.category && this.data.category_applied_filter) {
            var appliedFilter = this.data.category_applied_filter;
            var parentFilter = null;
            while (appliedFilter) {
                parentFilter = appliedFilter.parent || null;
                this.data.appliedFilters.push({
                    text : appliedFilter.name,
                    link : buildActivitiesListURL({
                        category : parentFilter ? parentFilter.public_code : null,
                        location : this.data.location,
                        collectionCode : this.data.collectionCode,
                        fromPrice : this.data.fromPrice,
                        toPrice : this.data.toPrice,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                });
                appliedFilter = parentFilter;
            }
        }
        if (this.data.price_ranges) {
            this.data.priceRanges = _.map(this.data.price_ranges, function(priceRange) {
                return {
                    text : priceRange.from + "-" + priceRange.to,
                    link : buildActivitiesListURL({
                        location : this.data.location,
                        childLocation : this.data.childLocation,
                        category : this.data.category,
                        collectionCode : this.data.collectionCode,
                        fromPrice : priceRange.from,
                        toPrice : priceRange.to,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                }
            }, this);
        }
        if (this.data.searchText) {
            this.data.searchRemoveURL = buildActivitiesListURL({
                location : this.data.location,
                childLocation : this.data.childLocation,
                category : this.data.category,
                collectionCode : this.data.collectionCode,
                fromPrice : this.data.fromPrice,
                toPrice : this.data.toPrice,
                pageSize : this.data.pageSize,
                pageIndex : 0
            });
        }
        if (this.data.isFree = this.data.fromPrice == 0 && this.data.toPrice == 0) {
            this.data.appliedFilters.push({
                text : Handlebars.helpers.t("free"),
                link : buildActivitiesListURL({
                    location : this.data.location,
                    childLocation : this.data.childLocation,
                    category : this.data.category,
                    collectionCode : this.data.collectionCode,
                    searchText : this.data.searchText,
                    pageSize : this.data.pageSize,
                    pageIndex : 0
                })
            });
        } else {
            this.data.priceRanges.push({
                text : Handlebars.helpers.t("free"),
                link : buildActivitiesListURL({
                    location : this.data.location,
                    childLocation : this.data.childLocation,
                    category : this.data.category,
                    collectionCode : this.data.collectionCode,
                    fromPrice : 0,
                    toPrice : 0,
                    searchText : this.data.searchText,
                    pageSize : this.data.pageSize,
                    pageIndex : 0
                })
            });

            if (this.data.fromPrice) {
                this.data.appliedFilters.push({
                    text : Handlebars.helpers.t("price.from") + " " + this.data.fromPrice,
                    link : buildActivitiesListURL({
                        location : this.data.location,
                        childLocation : this.data.childLocation,
                        category : this.data.category,
                        collectionCode : this.data.collectionCode,
                        toPrice : this.data.toPrice,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                });
            }

            if (this.data.toPrice) {
                this.data.appliedFilters.push({
                    text : Handlebars.helpers.t("price.to") + " " + this.data.toPrice,
                    link : buildActivitiesListURL({
                        location : this.data.location,
                        childLocation : this.data.childLocation,
                        category : this.data.category,
                        collectionCode : this.data.collectionCode,
                        fromPrice : this.data.fromPrice,
                        searchText : this.data.searchText,
                        pageSize : this.data.pageSize,
                        pageIndex : 0
                    })
                });
            }
        }

    },
    contentRender: function() {
        this.$el.html(app.templates['listing/activities-filters.hbs'](this.data));
        $("#activities-filters-btn").remove();
        var button = '<button id="activities-filters-btn" class="btn btn-primary"><i class="fa fa-sliders"></i></button>';
        this.$el.before(button);
    },
    postRender: function() {
        var me = this;
        var form = $("#price-form");
        $("input", form).on("change", function(e) {
            if (/^[0-9]*$/g.test(e.target.value)) {
                $(e.target).removeClass("error");
                if (!$(e.target).is(".error") && !$(e.target).siblings().is(".error")) {
                    form.removeClass("invalid");
                }
            } else {
                $(e.target).addClass("error");
                form.addClass("invalid");
            }
        });
        form.on("submit", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var form = $(e.target);
            if (!form.is(".invalid")) {
                var selectedFilters = form.serializeJSON();
                me.showAppliedFilters();
                me.trigger("activities:filters:submit", selectedFilters);
            }
        });
        $("a.btn", me.$el).on("click", function(e) {
            if (!e.ctrlKey && e.which != 2 && e.which != 3) {
                e.preventDefault();
                e.stopPropagation();
                var link = $(e.target).is("a") ? $(e.target).attr("href") : $(e.target).parents("a").attr("href");
                routers.activitiesList.navigate(link, {trigger: true});
            }
        });
        $("#activities-filters-btn").on("click", function() {
            me.$el.toggleClass("open");
        });
        $(window).on("resize", function() {
            if ($(this).width() > 768 ) me.$el.removeClass("open");
        });
        me.showAppliedFilters();
    },
    showAppliedFilters: function() {
        $("#applied-search", this.$el).css({
            display : this.data.searchText && this.data.searchText.length ? "block" : "none"
        });
        $("#applied-filters", this.$el).css({
            display : this.data.appliedFilters.length ? "block" : "none"
        });
    }
});