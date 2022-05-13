var PartialCancelationView = Backbone.View.extend({
  el: "#booking-partial-cancelation",
  events: {
    "submit #confirm-partial-form": "confirmCancel"
  },
  initialize: function (options){
   var  me = this;
   this.model = options.model;
    _.bindAll(this,'confirmCancel');
  },
  render: function() {
    me = this;		
    $('#booking-cancelation-select').addClass('hideContainer');	

    var partial = this.model.get('parcialCancelationModel');
    var optionsRateArray = []
    optionsRateArray = partial.option_rates;

    var data = {
      activityName: partial.activity_name,
      customerName: partial.customer_name,
      bookingNumber: partial.booking_number,
      date: partial.date,
      optionsRate:  partial.option_rates
    };

    this.$el.html(app.templates['cancel/partial-cancelation.hbs'](data));
    
    $("button").on("click", function(e){

			var bt = $($(this).attr("data-toggle"));
			var id = $(e.target).attr("id");
			var cid = $(e.target).attr("data-toggle");
			if (cid != undefined) {

				var quantityDin = "quantity"+cid;
        var type = "type"+cid;
        var maxQuantity = "max"+cid;
        var numberCancel = "numberCancel"+cid;

				var typeLocal = $("#"+type).val();
				var code = "code"+cid;
				var codeLocal = $("#"+code).val();
				if (id === ('more'+cid)) {
          var lessCid = "less"+cid;
          $("#"+lessCid).addClass("disabled").prop("disabled", false);
          var value =  parseInt($("#"+quantityDin).val(), 10); 
          $("#"+quantityDin).val(value + 1);

          var calculoDif =  parseInt($("#"+maxQuantity).val(),10) - (parseInt($("#"+quantityDin).val(),10));

          $("#"+numberCancel).val(calculoDif);
					if (parseInt($("#"+quantityDin).val(),10) == parseInt($("#"+maxQuantity).val(),10)) {
            var moreCid = "more"+cid;
            $("#"+moreCid).addClass("disabled").prop("disabled", true);
          }
					this.rateLoc = {
						activity_rate_code: codeLocal,
						quantity: $("#"+quantityDin).val(),
						type: typeLocal
					}
				}
				if (id === ('less'+cid)) {
          var moreCid = "more"+cid;
          $("#"+moreCid).removeClass("disabled").prop("disabled", false);
          
					var value =  parseInt($("#"+quantityDin).val(), 10); 
          $("#"+quantityDin).val(value - 1);
          var calculoDif =  parseInt($("#"+maxQuantity).val(),10) - (parseInt($("#"+quantityDin).val(),10));
          $("#"+numberCancel).val(calculoDif);
					if ((value - 1) < 1) {
            var lessCid = "less"+cid;
            $("#"+lessCid).addClass("disabled").prop("disabled", true);
					}
				}
				if (me.model.get('rates').length !=  0) {
					var rateExist = me.model.findActiveOptionRateModel(codeLocal);
					if (rateExist != undefined){
						me.model.removeOptionRateModel(rateExist);
						this.rateLoc = {
							activity_rate_code: codeLocal,
							quantity: $("#"+quantityDin).val(),
							type: typeLocal
						};
							me.model.setAddRateModel(this.rateLoc)
						
					} else {
						this.rateLoc = {
							activity_rate_code: codeLocal,
							quantity: $("#"+quantityDin).val(),
							type: typeLocal
						};
						me.model.setAddRateModel(this.rateLoc)
					}
        } else {
					
					this.rateLoc = {
						activity_rate_code: codeLocal,
						quantity: $("#"+quantityDin).val(),
						type: typeLocal
					};
					me.model.setAddRateModel(this.rateLoc);
				}

			}

		});
    return this;
  },
  confirmCancel: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.loadingModal = new LoadingModal(
        {text: 'booking.canceling'}).render();
    this.render();
    
    this.model.sendReviewRate({
      before: function(data) {

      },
      success: function (model, response) {
        me.closeModal();
        this.childView = new SuccessView().render();
      },
      error: function (code, message) {
        me.closeModal();
        this.childView = new ErrorView({codeError: code}).render();
      }
    });
  },
  closeModal: function () {
    killModal();
    this.loadingModal = null;
  }
});

var ConfirmView = Backbone.View.extend({
  el: "#booking-cancelation-details",
  events: {
    "submit #confirm-form": "confirm"
  },
  initialize: function (options) {
    var me = this;
    this.model = options.model;
    _.bindAll(this,'confirm');
  },
  render: function () {
    this.$el.html(app.templates['cancel/confirm.hbs']());
    return this;
  },
  confirm: function (event) {
    event.preventDefault();
    event.stopPropagation();
    var me = this;
    
    this.bookingCode = getBookingCodeFromUrl();
    this.model = new CancelBookingModel({
      bookingCode: this.bookingCode,
      parcialCancelationModel: this.model
    });
    var partial = this.model.get('parcialCancelationModel');
    if (partial.partial_cancelation == true) {
      this.partial = new CancelationSelectionView({model: this.model}).render();
    } else {
      this.loadingModal = new LoadingModal(
        {text: 'booking.canceling'}).render();
    this.render();
      this.model = new CancelBookingModel({
        bookingCode: this.bookingCode,
        parcialCancelationModel: this.model,
        rates: null
      });

      this.model.sendReviewRate({
        success: function () {
          me.closeModal();
          this.childView = new SuccessView().render();
        },
        error: function (code, message) {
          me.closeModal();
          this.childView = new ErrorView().render();
        }
      });
    }
  },
  closeModal: function () {
    killModal();
    this.loadingModal = null;
  }
});

var CancelationSelectionView = Backbone.View.extend({
  el: "#booking-cancelation-select",
  events: {
    "click #total-submit": "confirm_total_submit",
    "click #partial-submit": "confirm_partial_submit"
  },
  initialize: function (options) {
    var me = this;
    this.model = options.model;
    _.bindAll(this,'confirm_total_submit');
    _.bindAll(this,'confirm_partial_submit');
  },
  render: function() {
    me = this;		
    $('#booking-cancelation-details').addClass('hideContainer');	

    this.$el.html(app.templates['cancel/select-cancelation.hbs']());
  },
  
  confirm_total_submit : function() {
    var me = this;

    this.loadingModal = new LoadingModal(
      {text: 'booking.canceling'}).render();
    this.render();
    this.bookingCode = getBookingCodeFromUrl();
    this.model = new CancelBookingModel({
      bookingCode: this.bookingCode,
      parcialCancelationModel: this.model,
      rates: null
    });

    this.model.sendReviewRate({
      success: function () {
        me.closeModal();
        this.childView = new SuccessView().render();
      },
      error: function (code, message) {
        me.closeModal();
        this.childView = new ErrorView().render();
      }
    });
    
  },
  confirm_partial_submit : function() {
    this.partial = new PartialCancelationView({model: this.model}).render();
  },
  closeModal: function () {
    killModal();
    this.loadingModal = null;
  }
});

var SuccessView = Backbone.View.extend({
  el: "#booking-cancelation-success",
  initialize: function (options) {
    //nothing.
  },
  render: function () {
    $('#booking-cancelation-details').addClass('hideContainer');	
    $('#booking-cancelation-select').addClass('hideContainer');
    $('#booking-partial-cancelation').addClass('hideContainer');	
    this.$el.html(app.templates['cancel/success.hbs']());
    return this;
  }
});

var ErrorView = Backbone.View.extend({
  el: "#booking-cancelation-details-error",
  default:{
    codeErr: null
  },
  initialize: function (options) {
    //nothing.
    this.codeErr = options.codeError;
  },
  render: function () {
    $('#booking-cancelation-details').addClass('hideContainer');	
    $('#booking-partial-cancelation').addClass('hideContainer');	
    this.$el.html(app.templates['cancel/error.hbs']({codeErr : this.codeErr}));
    return this;
  }
});

var CancelBookingView = PageView.extend({
  initialize: function (options) {
    PageView.prototype.initialize.apply(this, arguments);
    var me = this;
    this.bookingCode = getBookingCodeFromUrl();
    this.model = new CancelBookingModel({
      bookingCode: this.bookingCode,
    });
    this.render();

    this.model.bookingInfoCancel({
      success: function (data) {
        this.childView = new ConfirmView({model: data}).render();
      },
      error: function (code, message) {  
        this.childView = new ErrorView({codeError: code}).render();
      }
    });

  },
  contentRender: function () {
    $('#booking-cancelation-details').removeClass('hideContainer');	
    this.$el.html(app.templates['cancel/container.hbs']());
    this.header.setLanguageSelectorURLs(this.model.getURLs(this.model.get('bookingCode')));
    this.footer.setLanguageSelectorURLs(this.model.getURLs(this.model.get('bookingCode')));
  }
});

i18nInit(function () {
  new CancelBookingView({
    footerOptions: {
      cssClass: "booking-details-footer"
    }
  });
});
