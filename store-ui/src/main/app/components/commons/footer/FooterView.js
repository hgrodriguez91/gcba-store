var FooterView = BaseView.extend({
    el: 'footer',
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        this.cssClass = "footer";
        if (options.cssClass) this.cssClass = this.cssClass + " " + options.cssClass;
        this.languageSelectorModel = new LanguageSelectorModel();
        this.listenTo(this.languageSelectorModel, "change", this.render, this);
        this.render();
    },
    contentRender: function () {
        var currentLng = i18n.lng();
        this.$el.addClass(this.cssClass);
        this.$el.html(app.templates['commons/footer/footer.hbs']({
            baseURL : this.baseURL,
            lang: currentLng,
            baseImageURL : this.baseImageURL,
            url : {
                es : this.languageSelectorModel.getURLByLanguage("es"),
                en : this.languageSelectorModel.getURLByLanguage("en"),
                pt : this.languageSelectorModel.getURLByLanguage("pt"),
                "how-it-works" : PagesURL.getURL("how-it-works", currentLng),
                "about-us" : PagesURL.getURL("about-us", currentLng),
                "how-to-publish" : PagesURL.getURL("how-to-publish", currentLng),
                "terms-and-conditions" : PagesURL.getURL("terms-and-conditions", currentLng),
                "faq" : PagesURL.getURL("faq", currentLng)
            }
        }));
    },
    setLanguageSelectorURLs : function(urls) {
        this.languageSelectorModel.set(urls);
    }
});