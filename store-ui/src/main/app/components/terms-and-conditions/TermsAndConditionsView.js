var TermsAndConditionsView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        this.render();
    },
    contentRender: function () {
        var lang = i18n.lng();
        var data = {baseURL : this.baseURL, baseImageURL : this.baseImageURL};

        this.$el.html(app.templates['terms-and-conditions/terms-and-conditions.hbs'](_.extend(data, {content : app.templates['terms-and-conditions/terms-and-conditions-content-' + lang + '.hbs'](data)})));
        this.footer.setLanguageSelectorURLs(PagesURL["terms-and-conditions"]);
        this.header.setLanguageSelectorURLs(PagesURL["terms-and-conditions"]);
    }
});

i18nInit(function() {
    new TermsAndConditionsView();
});