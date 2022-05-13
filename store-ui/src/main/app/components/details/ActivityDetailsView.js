var CancelationPoliciesView = Backbone.View.extend({
	initialize: function(options) {
		//nothing.
	},
	render: function() {
	    var el = $(app.templates['details/cancelation-policies.hbs']());
		renderModal(el);
		return this;
	}
});

var ConfirmationTypesView = Backbone.View.extend({
	initialize: function(options) {
		//nothing.
	},
	render: function() {
	    var el = $(app.templates['details/confirmation-types.hbs']());
		renderModal(el);
		return this;
	}
});

var BookingTravelerQuantityView = Backbone.View.extend({
    events: {
        "change": "change"
    },
    initialize: function(options) {
        this.templateName = options.templateName;
        this.selectorName = options.selectorName;
        this.isPhone = options.isPhone;
        this.maxValues = options.maxValues;
    },
    render: function() {
        var values = [];
        if (this.maxValues) {
            for (var i = 0; i < this.maxValues; i++) {
                values.push(i + 1);
            }
        }
        this.$el.html(app.templates['details/checkout/' + this.templateName](_.extend({values : values, isPhone : this.isPhone}, this.model.toJSON())));

        this.quantitySelector = this.$("select[name='"+this.selectorName+"']");

        if (!this.model.get('available')) {
            $(this.quantitySelector).addClass("disabled").prop({disabled : true});
        }

        if (this.isPhone) {
            this.quantitySelector.removeClass("select2-control");
        } else {
            this.quantitySelector.select2();
        }

        return this;
    },
    change: function(event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
    showErrors: function() {
        if (_.contains(_.pluck(this.model.validationError, 'name'), this.selectorName)) {
            this.quantitySelector.parent().addClass("has-error");
        }
    },
    hideErrors: function() {
        this.quantitySelector.parent().removeClass("has-error");
    }
});

var PromocodeView = Backbone.View.extend({
	el:"#promocode-container",
	events: {
        "change": "change"
    },
	initialize: function (options) {
		var me = this;
	},
	render: function () {
		var me = this;
		this.$el.html(app.templates['details/checkout/promocode.hbs']());

		return this;
	},
	change: function (event) {
        event.preventDefault();
        event.stopPropagation();

        var target = event.target;
		this.model.setPromocode(target.value);
		this.model.set('promocode', target.value);
    }
});

var BookingDatepickerView = Backbone.View.extend({
    el:"#booking-datepicker-container",
    initialize: function(options) {
        var me = this;
        this.isPhone = options.isPhone;
        this.model.on('update:schedules', function() {
            me.render();
		});
		this.on('render', this.initDatepicker, this);
    },
    render: function() {
        var me = this;

        this.$el.html(app.templates['details/checkout/booking-datepicker.hbs']());

        this.$el.addClass("disabled").prop("disabled", true);
        if (this.isPhone && this.model.get('available')) {
            $("input", this.$el).prop("readonly", true);
        }

		this.datepicker = $("#datepicker")
		this.datepicker.datepicker({
			language : i18n.lng(),
			autoclose: true,
            format : "dd/mm/yyyy",
            maxViewMode: "days",
            startDate : me.model.get('minDate').locale(i18n.lng()).format('DD/MM/YYYY'),
			endDate : me.model.get('maxDate').locale(i18n.lng()).format('DD/MM/YYYY'),
            beforeShowDay : function(date) {
                var response = {
                    enabled : false,
                    classes : "",
                    tooltip : null
                };
                response.enabled = me.model.isValidDate(date);
                return response;
			},
			orientation: "bottom auto"
		});
		
        this.datepicker.on("changeDate", function(event) {
            me.model.set('date', moment(event.date));
        });
        this.datepicker.addClass("disabled").prop("disabled", !this.model.get('available'));

		return this;
	},
	showErrors: function() {
		if (_.contains(_.pluck(this.model.validationError, 'name'), 'date')) {
			this.datepicker.parent().addClass("has-error");
		}
	},
	hideErrors: function() {
		this.datepicker.parent().removeClass("has-error");
	},
	initDatepicker: function () {
		this.$('#datepicker').datepicker();
	}
});

var BookingTimeSelectorView = Backbone.View.extend({
	el:"#booking-time-selector-container",
	events: {
		"change": "change",
	},
	initialize: function(options) {
		var me = this;
		this.isPhone = options.isPhone;
		this.model.on('update:times', function() {
			me.render();
			me.$("#booking-time-selector").removeClass("has-loading");
		});
		this.model.on('start:get-times', function() {
			me.render();
			me.$("#booking-time-selector").addClass("has-loading");
			me.$(".select2-chosen").addClass("has-loading");
		});
	},
	render: function() {
		var me = this;
		this.$el.html(app.templates['details/checkout/booking-time-selector.hbs'](_.extend(this.model.toJSON(), {isPhone : this.isPhone})));
		this.initSelector();
		return this;
	},
	initSelector: function() {
		this.timeSelector = this.$("#booking-time-selector");
		
		if (this.isPhone) {
		    this.timeSelector.removeClass("select2-control");
        } else {
            this.timeSelector.select2();
        }

		if(!this.isEnabled()) {
			this.timeSelector.addClass("disabled").prop("disabled", true);
		}
	},
	change: function(event) {
		if(this.isEnabled()) {
			var target = event.target;
			var timeParts = target.value.split("_");
			this.model.setSelectedTime(timeParts[0],timeParts[1], timeParts[2]);
		}
	},
	isEnabled: function() {
		return (this.model.get('times') != null);
	},
	showErrors: function() {
		if (_.contains(_.pluck(this.model.validationError, 'name'), 'time')) {
			this.timeSelector.parent().addClass("has-error");
		}
	},
	hideErrors: function() {
		this.timeSelector.parent().removeClass("has-error");
	}
});

var ActivityOptionSelectorView = Backbone.View.extend({
	el:"#activity-option-selector-container",
	events: {
		"change": "change",
	},
	initialize: function(options) {
		var me = this;
		this.isPhone = options.isPhone;
		this.model.on('change:options', function() {
			me.render();
		});
		this.model.on('set:defaultActivityOption', function() {
			me.render();
		})
	},
	render: function() {
		this.$el.html(app.templates['details/checkout/activity-option-selector.hbs'](_.extend(this.model.toJSON(), {isPhone : this.isPhone})));
		
		if (!this.model.get('available')) {
            $("select", this.$el).addClass("disabled").prop({disabled : true});
        }
		
		this.activityOptionSelector = this.$("[name=activity-option-selector]");
		
		if (this.isPhone) {
			
			this.activityOptionSelector.removeClass("select2-control");
			
        } else {
            this.activityOptionSelector.select2();
		}
		
		return this;
	},
	change: function(event) {
		var target = event.target;
		this.model.set('activityOptionCode', target.value);
		this.bookingRateView = new ActivityOptionsRateView({
			model: this.model
		}).render();
	},
	selectDefaultActivityOption: function() {
		this.model.selectDefaultActivityOption();
		this.bookingRateView = new ActivityOptionsRateView({
			model: this.model
		}).render();
	},
	showErrors: function() {
		if (_.contains(_.pluck(this.model.validationError, 'name'), 'activityOptionCode')) {
			this.activityOptionSelector.parent().addClass("has-error");
		}
	},
	hideErrors: function() {
		this.activityOptionSelector.parent().removeClass("has-error");
	}
});

var OptionRateView = Backbone.View.extend({
	el:"#booking-selector-rates",
	events: {
		"change": "change"
	},
	initialize: function(options) {
		var me = this;
		this.model = options.model
	},
	render: function() {
		me =this;
		this.$el.html(app.templates['details/checkout/booking-selector-rates.hbs']());
	}
});

var ActivityOptionsRateView =  Backbone.View.extend({
	el:"#booking-rates",
	events: {
		"change": "change",
		"click #apply": "applyRate"
	},
	initialize: function(options) {
		var me = this;
	},
	render: function() {
		me =this;
		
		var data = {
			activities: this.model.get('options').toJSON(),
			oneRates: (this.model.get('oneRates') == null ? this.model.get('oneRates') :this.model.get('oneRates').toJSON())
		};

		this.$el.html(app.templates['details/checkout/booking-rates.hbs'](data));
		$('[data-toggle="tooltip"]').tooltip();
		$('#messageErrorRate').addClass('hideContainer');
		$('#dropdownRate').addClass('hideContainer');
		var applyRate = $("#apply-btn");
		var inputRate = $("[name=rateName]");
		var rateName= $('#rateName');
		$("button").on("click", function(e){
			var bt = $($(this).attr("data-toggle"));
			var id = $(e.target).attr("id");
			var cid = $(e.target).attr("data-toggle");
			if (cid != undefined) {
				me.model.set('rateName', null);
				inputRate.val('');
				var quantityDin = "quantity"+cid;
				var type = "type"+cid;
				var typeLocal = $("#"+type).val();
				var code = "code"+cid;
				var codeLocal = $("#"+code).val();
				
				if (id == ('more'+cid)) {
					var value =  parseInt($("#"+quantityDin).val(), 10); 
					var lessCid = "less"+cid;
					$("#"+lessCid).addClass("disabled").prop("disabled", false);
					$("#"+quantityDin).val(value + 1);
					
					this.rateLoc = {
						activity_rate_code: codeLocal,
						quantity: $("#"+quantityDin).val(),
						type: typeLocal
					}
				}
				if (id == ('less'+cid)) {
					var value =  parseInt($("#"+quantityDin).val(), 10); 
					$("#"+quantityDin).val(value - 1);
					if ((value -1) < 1) {
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
						if ($("#"+quantityDin).val() != 0) {
							me.model.setAddRateModel(this.rateLoc)
						}
						
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

		  applyRate.off("click").on("click", function(e) {
			var cadena = '';
			me.model.get('rates').each(function(rate) {
				var rateOne = me.model.findActiveOptionOneRateModel(rate.get('activity_rate_code'));
				cadena += rate.get('quantity')+' '+rateOne.get('name')+' ';
			});
			me.model.set('rateName', cadena);
			inputRate.val(cadena);
			$('#dropdownRate').addClass('hideContainer');
		  });
		  inputRate.on("click", function(e){
			  if ($( "#dropdownRate" ).hasClass( "hideContainer" )) {
				$('#dropdownRate').removeClass('hideContainer');
			  } else {
				$('#dropdownRate').addClass('hideContainer');
			  }
			  
		  });
		return this;
	},
	change: function(event) {
    	var target = event.target;

	},
	applyRate: function() {
		
	},
	selectDefaultActivityOption: function() {
		
	},
	showErrors: function() {
		if (_.contains(_.pluck(this.model.validationError, 'name'), 'rateName')) {
			$("[name=rateName]").addClass("has-error");
			$('#messageErrorRate').removeClass('hideContainer');	
		}
	},
	hideErrors: function() {
		$("[name=rateName]").removeClass("has-error");
		$('#messageErrorRate').addClass('hideContainer');
	}

});
var MapView = Backbone.View.extend({
	el: "#map2",	
	initialize: function(options) {
		var me = this;
	},

	render: function(){

        return this;
    }
});

var CheckoutBoxView = Backbone.View.extend({
	el: "#activity-checkout-box-container",
	events: {
		"change": "change",
		"click #check-availability": "checkAvailability"
	},
	initialize: function(options) {
		var me = this;
		this.isPhone = options.isPhone;
	},
	render: function() {
		var me = this;

		this.$el.html(app.templates['details/checkout/checkout-box.hbs'](this.model.toJSON()));

		if (this.isPhone) {
		    $(".activity-checkout-box", this.$el).addClass("checkout-mobile");
		}

		if (!this.model.get('available') && this.model.get('externalLink') == null) {
		    $("#check-availability", this.$el).addClass("disabled").prop({disabled : true});
		}

		if(!this.model.get('active')){
      $("#check-availability", this.$el).addClass("disabled").prop({disabled : true});
      $('#activityActive').removeClass('hideContainer');
		}else{
      $('#activityActive').addClass('hideContainer');
		}

		this.activityOptionSelectorView = new ActivityOptionSelectorView({
			model: me.model,
			isPhone : this.isPhone,
		}).render();
		
		this.bookingDatepickerView = new BookingDatepickerView({
			model: me.model,
			isPhone : this.isPhone,
		}).render();
		
		this.bookingTimeSelectorView = new BookingTimeSelectorView({
			model: me.model,
			isPhone : this.isPhone,
		}).render();
		
		this.adultsQuantityView = new BookingTravelerQuantityView({
			model: me.model,
			isPhone : this.isPhone,
			templateName: 'booking-adults-quantity.hbs',
			selectorName: 'adultsQuantity',
			el: '#booking-adults-quantity-container',
			maxValues: me.model.getMaxAdults()
		}).render();

		this.minorsQuantityView = new BookingTravelerQuantityView({
			model: me.model,
			isPhone : this.isPhone,
			templateName: 'booking-minors-quantity.hbs',
			selectorName: 'minorsQuantity',
			el: '#booking-minors-quantity-container',
			maxValues: me.model.getMaxMinors()
		}).render();

		this.adultsQuantityView.listenTo(this.model, "change:minorsQuantity", function() {
		    this.maxValues = this.model.getMaxAdults();
            if (this.maxValues != null && this.maxValues < this.model.get("adultsQuantity")) {
                this.model.set("adultsQuantity", null);
            }
            this.render();
		}, this.adultsQuantityView);

		this.minorsQuantityView.listenTo(this.model, "change:adultsQuantity", function() {
		    this.maxValues = this.model.getMaxMinors();
		    if (this.maxValues != null && this.maxValues < this.model.get("minorsQuantity")) {
		        this.model.set("minorsQuantity", null);
		    }
            this.render();
		}, this.minorsQuantityView);

		this.bookingRateView = new ActivityOptionsRateView({
			model: me.model,
		}).render();

		this.promocodeView = new PromocodeView({
			model: me.model
		}).render();
		this.mapView = new MapView({
			model: me.model
		}).render();
		$('#promocodeCheck').on('change',function(){
			if ($('#promocodeCheck').is(':checked')) {
				$('#pomocodeContainer').removeClass('hideContainer');			
				$('#messageErrorPromocode').addClass('hideContainer');				
				$("#promocode").removeClass("has-error");
			} else {
				$('#pomocodeContainer').addClass('hideContainer');
				$('#promocode').val('');
			}
		});
		$('#promocodeCheckMobile').on('change',function(){
			if ($('#promocodeCheckMobile').is(':checked')) {
				$('#pomocodeContainer').removeClass('hideContainer');			
				$('#messageErrorPromocode').addClass('hideContainer');				
				$("#promocode").removeClass("has-error");
			} else {
				$('#pomocodeContainer').addClass('hideContainer');
				$('#promocode').val('');
			}
		});
		this.activityOptionSelectorView.selectDefaultActivityOption();

		return this;
	},
	checkAvailability: function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.model.get('available') && this.model.get('externalLink') != null) {
			window.open(
				this.model.get('externalLink'),
				'_blank' // <- This is what makes it open in a new window.
			);
			return;
		}
		
		var me = this;
		
		this.activityOptionSelectorView.hideErrors();
		this.bookingDatepickerView.hideErrors();
		this.bookingTimeSelectorView.hideErrors();
		this.bookingRateView.hideErrors();
		if(this.model.isValid()) {
			new LoadingModal({text : 'availability.checking'}).render();
			
			var btn = $(event.target);
			
			//disabling the save button.
			btn.addClass("disabled").prop("disabled", true);
			
			if ($('#promocode').val() != '') {
				this.model.setPromocode($('#promocode').val());
			} else {
				this.model.setPromocode(null);
			}
			
			this.model.checkAvailability({
				success: function(model, response) {
					var checkAvailabilityResponseModel = model.get('response');
					if(checkAvailabilityResponseModel.get('isAvailable')) {
						//redirect to the next page of the checkout workflow.
						window.location.href = 
					        PagesURL.getURL('booking', i18n.lng()) + checkAvailabilityResponseModel.get('operationCode')
					        + '/payment'
					        + '?ref=' + getActivityPublicCodeFromUrl(location.href)
    						+ '&free=' + (me.model.isFree() ? "true" : "false");
					} else {
						new AvailabilityModal().render();
						btn.removeClass("disabled").prop("disabled", false);
					}
				},
				error: function(model, response) {
					if(response.status == 409) {
						me.handleErrorResponse(model, response);
						btn.removeClass("disabled").prop("disabled", false);						
					} else {
						btn.removeClass("disabled").prop("disabled", false);
						new AvailabilityModal({title : 'availability.error.title', text : 'availability.error.unexpected'}).render();
					}					
				}
			});
		} else {
			this.activityOptionSelectorView.showErrors();
			this.bookingDatepickerView.showErrors();
			this.bookingTimeSelectorView.showErrors();
			this.bookingRateView.showErrors();

		}
	},
	handleErrorResponse: function (model, response) {
        if (response.status != 200) {
            var errorCode = response.statusText;

            if (!errorCode && model.responseJSON && model.responseJSON.errors[0]) {
                errorCode = model.responseJSON.errors[0].code;
			}

			$('#messageErrorPromocode').removeClass('hideContainer');
			$("#promocode").addClass("has-error");
				
			$('#modal').modal('hide');
			$('#modal, .modal-backdrop').remove();
			$('body').removeClass('modal-open').attr("style", "");			
        } else {
            this.handleSuccessResponse();
        }
    }
});

var ActivityDetailsView = BaseView.extend({
	el: "#activity-details-container",
	events: {
		"click #show-cancelation-policies": "showCancelationPolicies",
		"click #show-confirmation-types": "showConfirmationTypes"
	},
    initialize: function(options) {
        BaseView.prototype.initialize.apply(this, arguments);
		this.isPhone = options.isPhone;
		
    },
    contentRender: function() {
		var me = this;
    	//wrapping data to send to the rendering.
    	goBackURL = document.referrer.indexOf("/activities") ? document.referrer : "";
    	var data = _.extend(this.model && this.model.attributes || {}, {
    	    baseURL : this.baseURL,
    	    baseImageURL : this.baseImageURL,
    	    goBackURL : goBackURL,
    	    activityURL : PagesURL.getURL("activity", i18n.lng()),
    	    activitiesURL : 'actividades'
    	});
    	
    	//rendering
        this.$el.html(app.templates['details/activity-details.hbs'](data));
        $('#questionSuccess').addClass('hideContainerSuccessQuestion');
        $("#tripadvisor-widget").load(function() {
            $(".activity-details-tripadvisor").show();
            var height = $(this).contents().find("html").height();
            var width = $(this).contents().find("body").children().first().width();
            $(this).css({height : height, width : width});
        });
        
        if (!me.model.get("available")) {
            $("#middle-submit", this.$el).addClass("disabled").prop({disabled : true});
            $(".activity-option button", this.$el).addClass("disabled").prop({disabled : true});
        }
        
        this.checkoutBoxView = new CheckoutBoxView({
        	model: me.model.get('checkoutBox'),
        	isPhone : this.isPhone
        }).render();
        
        this.activityGallery = new HorizontalSlider($('.activity-gallery .slider'), $('.slider-scroll', $('.activity-gallery .slider')));
		var thumbAnt = 1;
        $(".nav-thumbs li a").unbind("click").on("click", function(e) {
        	e.preventDefault();
			e.stopPropagation();
			$("iframe").each(function() { 
				var src= $(this).attr('src');
				$(this).attr('src',src);  
			});
			if (thumbAnt !== 0) {
				$('#thumb_'+thumbAnt).removeClass('sp-selected');
				$('#thumb_'+e.target.id.split("_")[1]).addClass('sp-selected');
			} else {
				$('#thumb_'+e.target.id.split("_")[1]).addClass('sp-selected');
			}
			thumbAnt = e.target.id.split("_")[1];
        	me.activityGallery.selectItem(e.target.id.split("_")[1]);
        });

        var moveToBookingFormContainer = function(event) {
        	event.preventDefault();
        	event.stopPropagation();
        	var elID = event.target.id;
        	if (elID && elID.startsWith("option_")) {
                me.model.get('checkoutBox').set('activityOptionCode', elID.split("_").reverse()[0]);
                me.model.get('checkoutBox').trigger("change:options");
        	}
    		$("html, body").stop().animate({scrollTop : $("#booking-form-container").offset().top - 80}, 500, function() {});
        };
        
        $("#top-submit").unbind("click").on("click", moveToBookingFormContainer);
        $("#middle-submit").unbind("click").on("click", moveToBookingFormContainer);
		$(".btn-option-check-availability").unbind("click").on("click", moveToBookingFormContainer);

		$("#more-questions").on("click", function(e) {

			me.model.loadSoMore();
			Handlebars.registerPartial('ratingActivitiesView', app.templates['details/activity-rating.hbs']);
		});
		me.model.listenTo(me.model, "ratingActivities:more:success", function() {
			$("#more-questions").prop({disabled: !me.model.anymoreQuestions()});
			me.refresh();
		});
		$("#sendQuestion").on("click", function(e) {
			me.model.set('codeActivity',me.model.get('activity').get('code'));
			me.model.set('email', $('#email').val());
			me.model.set('texto', $('#details').val());
			me.model.sendQuestion();
		});
		me.model.listenTo(me.model, "question:send:success", function() {
			$('#questionSuccess').removeClass('hideContainerSuccessQuestion');
			$('#email').val('');
			$('#details').val('')
			me.model.set('email', $('#email').val());
			me.model.set('texto', $('#details').val());
		});
        return this;
    },
    showCancelationPolicies: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	this.cancelationPoliciesView = new CancelationPoliciesView().render();
    },
    showConfirmationTypes: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	this.confirmationTypesView = new ConfirmationTypesView().render();
	},
	refresh: function() {
		this.contentRender();
	}
});

var ActivityNotFoundView = BaseView.extend({
    el: "#activity-details-container",
    initialize: function(options) {
        BaseView.prototype.initialize.apply(this, arguments);
    },
    render: function() {
        this.$el.html(app.templates['details/not-found.hbs']());
    }
});

/**
 * Main view for the page.
 */
var ActivityDetailsContainerView = PageView.extend({
    initialize: function(options) {
        PageView.prototype.initialize.apply(this, arguments);
        var me = this;
        this.contentView = _.noop;

        this.activityCode = getActivityPublicCodeFromUrl(location.href);
        this.model = new ActivityDetailsModel({
            code : this.activityCode,
        });

        this.model.fetch({
            success: function (model, response) {
                me.contentView = ActivityDetailsView;
                me.render();
            },
            error: function (model, resp) {
                me.contentView = ActivityNotFoundView;
                me.render();
            }
        });
    },
    contentRender: function () {
		this.$el.html(app.templates['details/container.hbs']());
		this.footer.setLanguageSelectorURLs(this.model.getURLs());
		this.header.setLanguageSelectorURLs(this.model.getURLs());
        new this.contentView({model : this.model, isPhone : this.isPhone()}).render();
    }
});
i18nInit(function() {
    new ActivityDetailsContainerView({
        footerOptions : {
            cssClass : "details-footer"
        }
    });
});
