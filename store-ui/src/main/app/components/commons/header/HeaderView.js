var HeaderView = BaseView.extend({
    el: '.header',
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        var me = this;
        this.mobileDetect = new MobileDetect(window.navigator.userAgent);
        this.isHomepage = $("html").is(".homepage");
        this.user = options && options.user || {};
        this.searchForm = null;
        this.searchValue = options && options.searchValue || null;
        this.user.on("change", function (e) {
            me.render();
        });
        this.session = new SessionModel({ user : this.user });
        this.languageSelectorModel = new LanguageSelectorModel();
        this.listenTo(this.languageSelectorModel, "change", this.render, this);
        me.render();
    },
    contentRender: function () {
        var me = this;
        var currentLng = i18n.lng();
        var homeURL = PagesURL.getURL("home", i18n.lng());
        var favoritesURL = PagesURL.getURL("favorites", i18n.lng());
        var profileURL = PagesURL.getURL("profile", i18n.lng());
        var faqURL = PagesURL.getURL("faq", i18n.lng());
        
        var langFlagUrl = currentLng == 'es' ? this.baseImageURL+"/flag/es.svg" : (currentLng == 'en' ? this.baseImageURL+"/flag/en.svg": this.baseImageURL+"/flag/pt.svg");

        //TODO: better active option recognition
        var data = _.extend(this.model && this.model.attributes || {}, {
            baseURL : this.baseURL,
            user : this.user.attributes,
            lang: currentLng,
            isHomepage : this.isHomepage,
            logoURL : this.isHomepage ? "assets/img/logo.png" : "assets/img/logo.png",
            flagEs : this.baseImageURL+"/flag/es.svg",
            flagEn : this.baseImageURL+"/flag/en.svg",
            flagPt : this.baseImageURL+"/flag/pt.svg",
            langFlag: langFlagUrl,
            favorites : location.href.indexOf(favoritesURL) > -1,
            profile : location.href.indexOf(profileURL) > -1,
            faq : location.href.indexOf(faqURL) > -1,
            urls : {
                es : this.languageSelectorModel.getURLByLanguage("es"),
                en : this.languageSelectorModel.getURLByLanguage("en"),
                pt : this.languageSelectorModel.getURLByLanguage("pt"),
                favorites : favoritesURL,
                profile : profileURL,
                faq : faqURL,
                home : homeURL
            }
        });
        this.$el.html(app.templates['commons/header/header.hbs'](data));
        //if (!this.isHomepage) {
        this.searchForm = new SearchFormLiteView({el: '.header-search-form', mobile : this.mobileDetect.mobile(), value : this.searchValue}).render();
        //}

        //adding all behaviours!
        me._behaviour();
    },
    _behaviour : function () {
    	var me = this;
    	
    	$("#ajax-signin").unbind("click").on("click", function(e) {
    		e.preventDefault();
    		me.openAjaxSignIn({});
    	});
    	
    	$("#ajax-signup").unbind("click").on("click", function(e) {
    		e.preventDefault();
    		me.openAjaxSignUp();
    	});
    	
    	$("#ajax-facebook-signin").on("click", function (e) {
    		e.preventDefault();
    		me.session.facebookLogin();
    	});
    },
    openAjaxSignIn : function (callback) {
    	var me = this;
    	me.ajaxSignInView = new AjaxSignInView({ session : me.session, callback : callback });
    },
    openAjaxSignUp : function () {
    	var me = this;
    	me.ajaxSignUpView = new AjaxSignUpView({ session : me.session });
    },
    setLanguageSelectorURLs : function(urls) {
        this.languageSelectorModel.set(urls);
    }
});