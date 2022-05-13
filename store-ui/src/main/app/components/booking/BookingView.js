var OrderResumeView = Backbone.View.extend({
	el: "#order-resume-container",
	initialize: function(options) {
		//nothing.
	},
	render: function() {
		this.$el.html(app.templates['booking/order-resume.hbs'](this.model.toJSON()));
		return this;
	}
});

/**
 * This is the view to show the booking when it is confirmed/approved.
 */
var BookingDetailsView = Backbone.View.extend({
	el:"#booking-container",
	initialize: function(options) {
		//nothing.
	},
	render: function() {
		this.$el.html(app.templates['booking/booking-details.hbs'](this.model.toJSON()));
		
		this.orderResumeView = new OrderResumeView({
			model: this.model
		}).render();

		return this;
	}
});

/**
 * This is the view show a booking that is pending.
 */
var PendingBookingView = Backbone.View.extend({
	el:"#booking-container",
	initialize: function(options) {
		//nothing.
	},
	render: function() {
		this.$el.html(app.templates['booking/pending-booking.hbs'](this.model.toJSON()));
		return this;
	}
});

/**
 * This is the view to show a booking that has been rejected.
 */
var RejectedBookingView = Backbone.View.extend({
	el:"#booking-container",
	initialize: function(options) {
		//nothing.
	},
	render: function() {
		this.$el.html(app.templates['booking/rejected-booking.hbs'](this.model.toJSON()));
		return this;
	}
});

/**
 * this is the view that is showed when the bookings is not found.
 */
var BookingNotFoundView = Backbone.View.extend({
	el:"#booking-container",
	initialize: function(options) {
		//nothing.
	},
	render: function() {
		this.$el.html(app.templates['booking/not-found.hbs']());
	}
});

var BookingView = PageView.extend({
    initialize: function(options) {
    	PageView.prototype.initialize.apply(this, arguments);
    	var me = this;
    	
    	this.operationCode = getOperationCodeFromUrl();
    	
    	this.model = new BookingModel({
    		operationCode : this.operationCode,
    	});
    	
    	this.model.fetch({
    		success: function(model, response) {
    			if(me.model.get('status') == 'PAYMENT_IN_PROCESS') {
    				me.containerView = new PendingBookingView({
    					model: model
    				}).render();
    			} else if(me.model.get('status') == 'APPROVED') {
    				me.containerView = new BookingDetailsView({
    					model: model
    				}).render();
    			} else if(me.model.get('status') == 'REJECTED') {
    				me.containerView = new RejectedBookingView({
    					model: model
    				}).render();
    			} else if(me.model.get('status') == 'PENDING_CONFIRMATION') {
    				me.containerView = new PendingBookingView({
    					model: model
    				}).render();
    			}
    			//close modal.
    			me.closeModal();
    		},
    		error: function(model, response) {
    			me.containerView = new BookingNotFoundView({
    				model: model
    			}).render();
    			//close modal.
    			me.closeModal();
    		}
    	});
    	
    	this.render();
    	this.loadingModal = new LoadingModal({text : 'booking.loading'}).render();
    },
	contentRender: function () {
		this.$el.html(app.templates['booking/container.hbs']());
	},
	closeModal: function() {
        killModal();
        this.loadingModal=null;
	}
});
i18nInit(function() {
    new BookingView({
        footerOptions : {
            cssClass : "booking-details-footer"
        }
    });
});