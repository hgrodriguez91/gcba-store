var PaymentResponseModel = Backbone.Model.extend({
    defaults: {
        status: null,
        error: null,
        bookingDetails: null,
        paymentDetails: null
    },
    initialize: function(options) {
    },
    mapValues: function(response) {
        this.set('status', response.status);
        if(response.error) this.set('error', {
            code: response.error.code,
            defaultMessage: response.error.defaultMessage
        });
        if(response.booking_details) this.set('bookingDetails', {
            number: response.booking_details.number,
            operationCode: response.booking_details.operation_code
        });
        if(response.payment_details) this.set('paymentDetails', {
            amount: response.payment_details.amount
        });
        return this;
    }
});