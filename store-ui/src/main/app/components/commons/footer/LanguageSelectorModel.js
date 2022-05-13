var LanguageSelectorModel = Backbone.Model.extend({
    defaults: {
        es: "",
        en: "en",
        pt: "pt"
    },
    setLanguageURL : function(lang, url) {
        this.set(lang, url);
    },
    getURLByLanguage : function(lang) {
        if (typeof this.get(lang) === "string") {
            return this.get(lang).replace("/", "");
        } else {
            return "";
        }
    }
});