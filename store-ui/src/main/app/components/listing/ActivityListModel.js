var ActivityListModel = Backbone.Model.extend({
    initialize : function(options) {
        var pageIndex = options && options.pageIndex || 0;
        var pageSize = options && options.pageSize || 10;
        var collectionCode = options && options.collectionCode;
        var location = options && options.location;
        var childLocation = options && options.childLocation;
        var category = options && options.category;
        var fromPrice = options && options.fromPrice;
        var toPrice = options && options.toPrice;
        var searchText = options && options.s;
        var organizationCode = options && options.organizationCode;
        this.set({pageIndex : pageIndex});
        this.set({pageSize : pageSize});
        this.set({location : location});
        this.set({childLocation : childLocation});
        this.set({category : category});
        this.set({collectionCode : collectionCode});
        this.set({fromPrice : fromPrice});
        this.set({toPrice : toPrice});
        this.set({searchText : searchText});
        this.set({organizationCode: organizationCode});
    },
    urlRoot : 'data/activities', 
    url : function() {
        var location = this.get("childLocation") ? this.get("childLocation") : this.get("location");
        var category = this.get("category");
        var searchText = this.get("searchText");
        var collectionCode = this.get("collectionCode");
        var fromPrice = this.get("fromPrice");
        var toPrice = this.get("toPrice");
        var organizationCode = this.get("organizationCode");
        var url = this.urlRoot;
        url += "?pageSize=" + this.get("pageSize");
        url += "&pageIndex=" + this.get("pageIndex");
        url += "&imgWidth=280&imgHeight=280&headerImgWidth=1440&headerImgHeight=200";
        if (searchText) url += "&text=" + searchText;
        if (location) url += "&location=" + location;
        if (category) url += "&category=" + category;
        if (collectionCode) url += "&collectionCode=" + collectionCode;
        if (fromPrice) url += "&fromPrice=" + fromPrice;
        if (toPrice) url += "&toPrice=" + toPrice;
        if (organizationCode) url += "&organizationCode=" + organizationCode;
        return url;
    },
    getURLs : function() {
        var urls = this.get("relative_paths")
        return {
            "es" : urls.SPANISH,
            "en" : urls.ENGLISH,
            "pt" : urls.PORTUGUESE
        }
    }
});