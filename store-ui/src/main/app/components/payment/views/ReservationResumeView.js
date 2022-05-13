var ReservationResumeView = Backbone.View.extend({
    el: "#reservation-resume-container",
    initialize: function(options) {
        //nothing to do.
    },
    render: function() {
        this.$el.html(app.templates['payment/reservation-resume.hbs'](this.model.toJSON()));
        return this;
    }
});