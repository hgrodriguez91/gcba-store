var FavoritesListModel = Backbone.Model.extend({
    initialize : function(options) {
        var pageIndex = options && options.pageIndex || 0;
        var pageSize = options && options.pageSize || 10;
        this.set({pageIndex : pageIndex});
        this.set({pageSize : pageSize});
    },
    urlRoot : 'data/activities/favorites', 
    url : function() {
        var url = this.urlRoot;
        url += "?pageSize=" + this.get("pageSize");
        url += "&pageIndex=" + this.get("pageIndex");
        return url;
    }
});