var ActivitiesListView = PageView.extend({
    initialize: function (options) {
        PageView.prototype.initialize.apply(this, arguments);
        var me = this;
        this.isFavoritesList = options.favorites;
        this.showFilters = options.showFilters;
        this.isCollectionList = options.isCollection;
        this.filters = null;

        this.model = this.isFavoritesList ? new FavoritesListModel(options) : new ActivityListModel(options);
        this.model.fetch({
            success: function () {
                me.render();
                me._bindings();
            },
            error: function (e) {
                me.render();
            }
        });
    },
    contentRender: function () {
        var me = this;

        var data = _.extend(this.model && this.model.attributes || {}, {
            isFavoritesList: this.isFavoritesList,
            isCollectionList: this.isCollectionList,
            showFilters: this.showFilters,
            pageSizes : {
                ten : this._buildFilteredURL({pageSize : 10, pageIndex : 0}),
                twentyFive : this._buildFilteredURL({pageSize : 25, pageIndex : 0})
            },
            baseURL : this.baseURL, 
            baseImageURL : this.baseImageURL,
            activityURL : PagesURL.getURL("activity", i18n.lng())
        });

        this.$el.html(app.templates['listing/list.hbs'](data));
        this.ellipsisAll();
        this.adjustTAWidgets();
        if (data.activities.length) $(".list-size").show();
        if (!this.isFavoritesList) {
            this.footer.setLanguageSelectorURLs(this.model.getURLs());
            this.header.setLanguageSelectorURLs(this.model.getURLs());
            this.filters = new ActivitiesFiltersView({
                el : "#activities-filters",
                data : data
            });
            this.listenTo(this.filters, "activities:filters:submit", function(selectedFilters) {
                me.model.set({fromPrice : selectedFilters.fromPrice});
                me.model.set({toPrice : selectedFilters.toPrice});
                me.pagination.reset();
            });
            this.filters.render();
        }
        this.pagination = new PaginationView({
            el: '#pagination',
            pageSize: this.model && this.model.get("size"),
            totalElements: this.model && this.model.get("total_elements"),
            pageIndex: this.model && this.model.get("number"),
            urlBuilder: _.bind(this._buildFilteredURL, this)
        });
        this.listenTo(this.pagination, 'change:pageIndex', this._navCallback);
        $('html, body').animate({ scrollTop: 0 }, 'low');
    },
    _bindings: function () {
        var me = this;
        $(".btn-favorite", this.$el).on("click", function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            var btn = $(e.target).is("i") ? $(e.target).parent() : $(e.target);
            var isFavorite = $("i", btn).is(".fa-heart-o");
            $.post(me.baseURL + "data/activities/" + btn.attr("data-item-id") + "/favorite/" + (isFavorite ? "true" : "false"))
            .success(function() {
                $("i", btn).toggleClass("fa-heart fa-heart-o");
            })
            .error(function() {
                //TODO handle error
            });
            return false;
        });
        $(".nav-params li a", me.$el).on("click", function(e) {
            if (!e.ctrlKey && e.which != 2 && e.which != 3) {
                e.preventDefault();
                e.stopPropagation();
                var link = $(e.target).is("a") ? $(e.target).attr("href") : $(e.target).parents("a").attr("href");
                routers.activitiesList.navigate(link, {trigger: true});
            }
        });
    },
    _navCallback: function () {
        var me = this;
        this.model.set({pageIndex : this.pagination.pageIndex});
        var url = this._buildFilteredURL();
        routers.activitiesList.navigate(url, {trigger: true});
    },
    _buildFilteredURL: function(options) {
        return buildActivitiesListURL({
            location : options && options.location ? options.location : this.model.get("location"),
            childLocation : this.model.get("childLocation"),
            category : options && options.category ? options.category : this.model.get("category"),
            searchText : options && options.searchText ? options.searchText : this.model.get("searchText"),
            collectionCode : options && options.collectionCode ? options.collectionCode : this.model.get("collectionCode"),
            fromPrice : options && options.fromPrice ? options.fromPrice : this.model.get("fromPrice"),
            toPrice : options && options.toPrice ? options.toPrice : this.model.get("toPrice"),
            pageSize : options && options.pageSize ? options.pageSize : this.model.get("pageSize"),
            pageIndex : options && /^[0-9]+$/.test(options.pageIndex) ? options.pageIndex : this.model.get("pageIndex"),
            organizationCode: options && options.organizationCode ? options.organizationCode : this.model.get("organizationCode")
        });
    },
    ellipsisAll: function() {
        _.defer(function(){$(".dot-ellipsis").dotdotdot({
            watch : 'window'
        })});
    },
    adjustTAWidgets: function() {
        $(".tripadvisor-widget").load(function() {
            $(this).parents(".activities-item-tripadvisor").show();
            var height = $(this).contents().find("html").height();
            var width = $(this).contents().find("body").children().first().width() + 10;
            if (width < 108) width = 108;
            $(this).css({height : height, width : width});
        });
    }
});
