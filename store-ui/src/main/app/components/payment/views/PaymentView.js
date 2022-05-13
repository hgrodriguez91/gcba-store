var PaymentView = Backbone.View.extend({
	el:"#payment-container",
    initialize: function () {
    	//nothing.
    },
	render: function () {
		var me = this;
		
    	var data = _.extend(this.model.attributes, {baseURL : this.baseURL});
    	
	    this.$el.html(app.templates['payment/payment.hbs'](data));
	    
	    this.paymentFormView = new PaymentFormView({
	    	model: this.model.get('paymentForm')
	    }).render();
	    
	    this.reservationResumeView = new ReservationResumeView({
	    	model: this.model.get('reservationResume')
	    }).render();
	    
	    return this;
	}
});
