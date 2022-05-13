var AvailabilityModal = BaseView.extend({
    imageURL: 'assets/img/logo-180x180.png',
    title: 'availability.unavailable.title',
    text: 'availability.unavailable.text',
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        if (options) {
            this.text = options.text ? options.text : this.text;
            this.title = options.title ? options.title : this.title;
        }
    },
    contentRender: function () {
        var el = $(app.templates['details/AvailabilityModal/availability-modal.hbs']({title : this.title, text : this.text, imageURL : this.imageURL}));
        renderModal(el);
    }
});