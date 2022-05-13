var AboutUsView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        this.render();
    },
    contentRender: function () {
        var lang = i18n.lng();
        var data = {baseURL : this.baseURL, baseImageURL : this.baseImageURL};

        this.$el.html(app.templates['about-us/about-us.hbs'](_.extend(data, {content : app.templates['about-us/about-us-content-' + lang + '.hbs'](data)})));
        this.footer.setLanguageSelectorURLs(PagesURL["about-us"]);
        this.header.setLanguageSelectorURLs(PagesURL["about-us"]);
    }
});

i18nInit(function() {
    new AboutUsView();
});