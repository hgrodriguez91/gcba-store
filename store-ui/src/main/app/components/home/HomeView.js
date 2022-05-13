var HomeView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        var me = this;
        var modelOptions = {
            collectionImgWidth : 1440,
            collectionImgHeight : 420,
            imgWidth : 380,
            imgHeight : 520,
            imgWidthPopular : 300,
            imgHeightPopular: 300
        };
        if (this.isPhone()) {
            modelOptions.collectionImgWidth = 720;
            modelOptions.collectionImgHeight = 320;
            modelOptions.imgWidth = 320;
            modelOptions.imgHeight = 460;
        }
        this.model = new HomeModel(modelOptions);
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
        var data = _.extend(this.model.attributes, {
            baseURL : this.baseURL,
            activitiesURL : PagesURL.getURL("activities", i18n.lng()),
            activityURL : PagesURL.getURL("activity", i18n.lng()),
            baseImageURL : this.baseImageURL
        });
        this.footer.setLanguageSelectorURLs(this.model.getURLs());
        this.header.setLanguageSelectorURLs(this.model.getURLs());
        this.$el.html(app.templates['home/home.hbs'](data));

        this.responsiveSlider = new ResponsiveSlider({el: '#home-slider-container'}).render();
        this.categoriesSlider = new DraggableSlider({el : "#home-categories-slider"}).render();
        this.discoverySlider = new ResponsiveSlider({el: '#discover-activities-slider'}).render();
        this.searchForm = new SearchFormView({el: '#search-form', mobile : this.mobileDetect.mobile()}).render();
    }
});

i18nInit(function() {
    new HomeView({
        footerOptions : {
            cssClass : "homepage-footer"
        }
    });
});