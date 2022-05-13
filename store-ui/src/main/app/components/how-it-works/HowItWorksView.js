var HowItWorksView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        this.render();
    },
    contentRender: function () {
        var lang = i18n.lng();
        var data = {baseURL : this.baseURL, baseImageURL : this.baseImageURL};

        this.$el.html(app.templates['how-it-works/how-it-works.hbs'](_.extend(data, {content : app.templates['how-it-works/how-it-works-content-' + lang + '.hbs'](data)})));
        this.footer.setLanguageSelectorURLs(PagesURL["how-it-works"]);
        this.header.setLanguageSelectorURLs(PagesURL["how-it-works"]);
    }
});

i18nInit(function() {
    new HowItWorksView();
});