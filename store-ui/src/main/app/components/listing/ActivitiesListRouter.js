var ActivitiesListRouter = Backbone.Router.extend({
    initialize: function(options) {
//        this.route(/^.*?activities\/([a-z0-9-]+)_([a-z0-9-]+)\/([a-z0-9-]+)(\?.*)?$/, "parentLocationAndChildLocationAndCategory");
//        this.route(/^.*?activities\/([a-z0-9-]+)_([a-z0-9-]+)(\?.*)?$/, "parentLocationAndChildLocation");
        this.route(/^.*?(?:activities|actividades|atividades)\/([a-z0-9-_]+)\/([a-z0-9-]+)(\?.*)?$/, "locationAndCategory");
        this.route(/^.*?(?:activities|actividades|atividades)\/((?:[a-z0-9-]+)-co[0-9]+)(\?.*)?$/, "collection");
        this.route(/^.*?(?:activities|actividades|atividades)\/((?:[a-z0-9-]+)-c[0-9]+)(\?.*)?$/, "category");
        this.route(/^.*?(?:activities|actividades|atividades)\/((?:[a-z0-9-_]+)-l[0-9]+)(\?.*)?$/, "location"); //parentLocation
        this.route(/^.*?(?:activities|actividades|atividades)\/?(\?.*)?$/, "activities");
        this.route(/^.*?(?:favorites|favoritos)\/?(\?.*)?$/, "favorites");
    },

    activities: function(query) {
        var params = this._stripQueryString(query);
        params.showFilters = !(params.organizationCode);
        params.footerOptions = {
                cssClass : "activities-list-footer"
        };
        new ActivitiesListView(params);
    },

    location: function(location, query) {
        var params = this._stripQueryString(query);
        params.showFilters = true;
        params.location = location;
        params.footerOptions = {
                cssClass : "activities-list-footer"
        };
        new ActivitiesListView(params);
    },

    locationAndCategory: function(location, category, query) {
        var params = this._stripQueryString(query);
        params.showFilters = true;
        params.location = location;
        params.category = category;
        params.footerOptions = {
                cssClass : "activities-list-footer"
        };
        new ActivitiesListView(params);
    },

    collection: function(collection, query) {
        var params = this._stripQueryString(query);
        params.showFilters = false;
        params.isCollection = true;
        params.collectionCode = collection;
        params.footerOptions = {
                cssClass : "activities-list-footer"
        };
        new ActivitiesListView(params);
    },

    category: function(category, query) {
        var params = this._stripQueryString(query);
        params.showFilters = true;
        params.category = category;
        params.footerOptions = {
                cssClass : "activities-list-footer"
        };
        new ActivitiesListView(params);
    },

    favorites: function(query) {
        var params = this._stripQueryString(query);
        params.showFilters = false;
        params.favorites = true;
        params.footerOptions = {
                cssClass : "activities-list-footer"
        };
        new ActivitiesListView(params);
    },

    _stripQueryString: function(query) {
        return _.pick(paramsFromURL(query), "pageIndex", "pageSize", "fromPrice", "toPrice", "s", "organizationCode");
    }
});
i18nInit(function() {
    if(!window.routers) window.routers = {};
    window.routers.activitiesList = new ActivitiesListRouter();
    Backbone.history.start({pushState: true, root: $("base").attr("href")});
});