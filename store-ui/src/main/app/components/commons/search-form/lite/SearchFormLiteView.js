var SearchFormLiteView = SearchFormView.extend({
    template: 'commons/search-form/lite/search-form-lite.hbs',
    focusOnLoad: false,
    initialize: function (options) {
        SearchFormView.prototype.initialize.apply(this, arguments);
    }
});