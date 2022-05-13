var TermsAndConditionView = Backbone.View.extend({
    initialize: function(options) {
        //nothing.
    },
    render: function() {
        var lang = i18n.lng();
        var data = {baseURL : this.baseURL, baseImageURL : this.baseImageURL};

        var el = $(app.templates['payment/modal-customer-terms.hbs']({customerTerms : app.templates['terms-and-conditions/terms-and-conditions-content-' + lang + '.hbs'](data)}));
        renderModal(el);
        return this;
    }
});