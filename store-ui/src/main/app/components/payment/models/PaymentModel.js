var PaymentModel = Backbone.Model.extend({
    defaults : {
        operationCode: null,
        paymentForm: null,
        reservationResume: null
    },
    initialize : function(options) {
        //nothing.
    },
    url : function() {
        return "data/checkout/" + this.get('operationCode') + '/quote';
    },
    parse: function(response, options) {
        var reservationResume = new ReservationResumeModel().mapValues(response);
        var paymentForm = new PaymentFormModel({ operationCode: this.get('operationCode') }).mapValues(response);
        return {
            paymentForm: paymentForm,
            reservationResume: reservationResume
        }
    },
    getURLs : function() {
        var urls = this.get("reservationResume").get("relativePaths")
        return {
            "es" : urls.SPANISH,
            "en" : urls.ENGLISH,
            "pt" : urls.PORTUGUESE
        }
    }
});