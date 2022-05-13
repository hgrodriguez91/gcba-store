var HowToPublishView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        this.render();
    },
    contentRender: function () {
        var lang = i18n.lng();
        var data = {baseURL : this.baseURL, baseImageURL : this.baseImageURL};

        this.$el.html(app.templates['how-to-publish/how-to-publish.hbs'](_.extend(data, {content : app.templates['how-to-publish/how-to-publish-content-' + lang + '.hbs'](data)})));
        this.footer.setLanguageSelectorURLs(PagesURL["how-to-publish"]);
        this.header.setLanguageSelectorURLs(PagesURL["how-to-publish"]);
    }
});

i18nInit(function() {
    new HowToPublishView();
});