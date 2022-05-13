var PagesURL = {
        "home" : {
            es : "/",
            en : "/en",
            pt : "/pt"
        },
        "about-us" : {
            es : "/acerca-de-nosotros",
            en : "/en/about-us",
            pt : "/pt/sobre-nos"
        },
        "profile" : {
            es : "/perfil",
            en : "/en/profile",
            pt : "/pt/perfil"
        },
        "faq" : {
            es : "/preguntas-frecuentes",
            en : "/en/faq",
            pt : "/pt/perguntas-frequentes"
        },
        "how-it-works" : {
            es : "/como-funciona",
            en : "/en/how-it-works",
            pt : "/pt/como-funciona"
        },
        "terms-and-conditions" : {
            es : "/terminos-y-condiciones",
            en : "/en/terms-and-conditions",
            pt : "/pt/termos-e-condicoes"
        },
        "favorites" : {
            es : "/favoritos",
            en : "/en/favorites",
            pt : "/pt/favoritos"
        },
        "how-to-publish" : {
            es : "/como-publicar",
            en : "/en/how-to-publish",
            pt : "/pt/como-publicar"
        },
        "activities" : {
            es : "/actividades",
            en : "/en/activities",
            pt : "/pt/atividades"
        },
        "activity" : {
            es : "/actividad",
            en : "/en/activity",
            pt : "/pt/atividade"
        },
        "payment" : {
            es : "/checkout/booking/",
            en : "/en/checkout/booking/",
            pt : "/pt/checkout/booking/"
        },
        "booking" : {
            es : "/checkout/booking/",
            en : "/en/checkout/booking/",
            pt : "/pt/checkout/booking/"
        },
        "review" : {
            es : "/booking/",
            en : "/en/booking/",
            pt : "/pt/booking/"
        },
        getURL : function(page, lang) {
            return this[page][lang].replace("/", "");
        }
};
