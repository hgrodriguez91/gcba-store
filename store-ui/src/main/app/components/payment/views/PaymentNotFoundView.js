var PaymentNotFoundView = Backbone.View.extend({
    el:"#payment-container",
    initialize: function(options) {
        //nothing.
    },
    render: function() {
        this.$el.html(app.templates['payment/not-found.hbs']());
        return this;
    }
});