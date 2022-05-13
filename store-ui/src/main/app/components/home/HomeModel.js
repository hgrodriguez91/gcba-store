var HomeModel = Backbone.Model.extend({
    defaults: {
        collectionImgWidth: null,
        collectionImgHeight: null,
        imgWidth: null,
        imgHeight: null,
        imgWidthPopular: null,
        imgHeightPopular: null
    },
    urlRoot : 'data/home', 
    url : function() {
        var url = this.urlRoot;
        var params = _.pick(this.attributes, 'collectionImgWidth', 'collectionImgHeight', 'imgWidth', 'imgHeight', 'imgWidthPopular', 'imgHeightPopular');
        if (_.chain(_.values(params)).compact().value().length) {
            url += "?";
            var and = false;
            _.each(params, function(value, key) {
                if (value) {
                    url += (and ? "&" : "") + key + "=" + value;
                    and = true;
                }
            });
        }
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