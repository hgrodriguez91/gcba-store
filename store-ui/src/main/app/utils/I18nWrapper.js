var i18nInit = function(callback) {
    i18n.init({ 
        fallbackLng: false,
        useCookie: false,
        lng: $("html").attr("lang") || "es",
        load: 'current',
        resGetPath: "assets/locales/__lng__/__ns__.json",
        interpolation: {prefix: '__', suffix: '__'}
    }, function(err, t) {
        callback();
    });
};