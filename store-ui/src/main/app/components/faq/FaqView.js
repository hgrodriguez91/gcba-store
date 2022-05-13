var FaqView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        this.render();
    },
    contentRender: function () {
        var lang = i18n.lng();
        var data = {baseURL : this.baseURL, baseImageURL : this.baseImageURL};

        this.$el.html(app.templates['faq/faq.hbs'](_.extend(data, {content : app.templates['faq/faq-content-' + lang + '.hbs'](data)})));
        this.footer.setLanguageSelectorURLs(PagesURL["faq"]);
        this.header.setLanguageSelectorURLs(PagesURL["faq"]);
    }
});

i18nInit(function() {
    new FaqView();
});