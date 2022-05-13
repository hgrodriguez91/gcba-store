var OptionRateModel = Backbone.Model.extend({
    defaults: {
        ageFrom: null,
        ageTo: null,
        code: null,
        description: null,
        price: {
            amount:null,
            currency: null
        },
        quantity: null,
        type:null
    }
});

var OptionsRateCollection = Backbone.Collection.extend({
    model: new OptionRateModel()
});

var ReservationResumeModel = Backbone.Model.extend({
    defaults: {
        activityTitle: null,
        acitvityOptionTitle: null,
        activityImage: null,
        location: null,
        bookingDate: null,
        bookingTime: null,
        bookingPayment: null,
        totalPayment: null,
        openBalance: null,
        discountAmount:null,
        discount: null,
        optionsRate: new OptionsRateCollection()
    },
    initialize: function(options) {
        //nothing...
    },
    mapValues: function(response) {
        this.set('relativePaths', response.relative_paths);
        this.set('activityTitle', response.activity_title);
        this.set('activityOptionTitle', response.activity_option_title);
        this.set('activityImage', response.activity_image);
        this.set('location', response.location);
        this.set('optionsRate', response.option_rates);
        this.set('bookingDate', response.date);
        this.set('bookingTime', new TimeModel({
            hour: response.time.hour,
            minutes: response.time.minute,
            periodDay: response.time.period_day
        }));
        this.set('bookingPayment', {
            amount: response.booking_payment.amount,
            currency: response.booking_payment.currency
        });
        this.set('totalPayment', {
            amount: response.total_payment.amount,
            currency: response.total_payment.currency
        });
        this.set('openBalance', {
            amount: response.open_balance.amount,
            currency: response.open_balance.currency
        });
        if(response.discount_amount) {
        	this.set('discountAmount', {
        		amount: response.discount_amount.amount,
        		currency: response.discount_amount.currency
        	});
        }
        this.set('discount', response.discount);
        return this;
    }
});