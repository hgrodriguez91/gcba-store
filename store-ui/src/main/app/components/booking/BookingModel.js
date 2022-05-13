var BookingModel = Backbone.Model.extend({
	defaults: {
		operationCode: null,
		status: null,
		sellerName: null,
		sellerDescription: null,
		sellerEmail: null,
		sellerPhone: null,
		sellerImage: null,
		customerName: null,
		customerEmail: null,
		activityTitle: null,
		activityOptionTitle: null,
		activityImage: null,
		categoryCode: null,
		categoryName: null,
		bookingNumber: null,
		adultsQuantity: null,
		minorsQuantity: null,
		bookingDate: null,
		bookingTime: null,
		adultsUnitPrice: null,
		minorsUnitPrice: null,
		address: null,
		location: null,
		totalPayment: null,
		bookingPayment: null,
		openBalance: null,
		paymentExternalId: null
	},
    initialize : function(options) {
    	//nothing.
    },
    url : function() {
        return 'data/checkout/' + this.get("operationCode") + '/booking';
    },
    parse: function(response, options) {
    	this.set('status', response.status);
    	this.set('sellerName', response.seller_name);
    	this.set('sellerDescription', response.seller_description);
    	this.set('sellerEmail', response.seller_email);
    	this.set('sellerPhone', response.seller_phone);
    	this.set('sellerImage', response.seller_image);
    	
    	this.set('customerName', response.customer_name);
    	this.set('customerEmail', response.customer_email);
    	
    	this.set('activityTitle', response.activity_title);
    	this.set('activityOptionTitle', response.activity_option_title);
    	this.set('activityImage', response.activity_image);
    	this.set('categoryCode', response.category_code);
    	this.set('categoryName', response.category_name);
    	
    	this.set('bookingNumber', response.booking_number);
    	this.set('adultsQuantity', response.adults_quantity);
    	this.set('minorsQuantity', response.minors_quantity);
    	this.set('bookingDate', response.date);
    	this.set('bookingTime', {
    		hour: response.time.hour,
    		minutes: response.time.minute,
    		periodDay: response.time.period_day
    	});
    	this.set('address', response.address);
    	this.set('location', response.location);
    	
    	this.set('totalPayment', {
    		amount: response.total_payment.amount,
    		currency: response.total_payment.currency
    	});
    	this.set('bookingPayment', {
    		amount: response.booking_payment.amount,
    		currency: response.booking_payment.currency
    	});
    	this.set('openBalance', {
    		amount: response.open_balance.amount,
    		currency: response.open_balance.currency
    	});
    	this.set('paymentExternalId', response.payment_external_id);
    	
    	return {};
    }
});