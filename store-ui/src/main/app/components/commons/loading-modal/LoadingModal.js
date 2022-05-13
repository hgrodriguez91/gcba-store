var LoadingModal = BaseView.extend({
    imageURL: 'assets/img/logo-180x180.png',
    text: 'loading',
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        if (options) {
            this.text = options.text ? options.text : this.text;
        }
    },
    contentRender: function () {
        var el = $(app.templates['commons/loading-modal/loading-modal.hbs']({text : this.text, imageURL : this.imageURL}));
        renderModal(el);
    }
});