var ProfileView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        var me = this;
        this.model = new ProfileModel();
        this.model.fetch({
            success: function () {
                me.render();
            },
            error: function (e) {
                me.render();
            }
        });
    },
    contentRender: function () {
        var me = this;
        var data = _.extend(this.model.toJSON(), {baseURL : this.baseURL, baseImageURL : this.baseImageURL});

        this.$el.html(app.templates['profile/profile.hbs'](data));
        this.footer.setLanguageSelectorURLs(PagesURL["profile"]);
        this.header.setLanguageSelectorURLs(PagesURL["profile"]);
        this.profileFormView = new ProfileFormView({
            model: this.model
        });
        this.profileFormView.render();
    }
});

i18nInit(function() {
    new ProfileView();
});