var OptionRateCancelModel = Backbone.Model.extend({
  defaults: {
    activity_rate_code: null,
    quantity: null,
    type: null
  }
});
var OptionRatesCancelCollection = Backbone.Collection.extend({
  defaults:{
    model: new OptionRateCancelModel()
  }
});


var OptionRateModel = Backbone.Model.extend({
  defaults: {
    code: null,
    description: null,
    name: null,
    price: {
      amount: null,
      currency: null
    },
    quantity: null,
    type: null
  }
});

var OptionRatesCollection = Backbone.Collection.extend({
  defaults:{
    model: new OptionRateModel()
  }
});

var ParcialCancelationModel = Backbone.Model.extend({
  defaults: {
    activityName: null,
    bookingCode: null,
    bookingNumber: null,
    customerName: null,
    date: null,
    optionsRates: new OptionRatesCollection(),
    partialCancelation: null,
    time: {
      hour: null,
      minute:null,
      periodDay: null
    }
  }
});

var CancelBookingModel = Backbone.Model.extend({
	defaults: {
    bookingCode: null,
    parcialCancelationModel: new ParcialCancelationModel(),
    rates: new OptionRatesCancelCollection()
	},
  initialize : function(options) {
    //nothing.
    me = this;
  },
  url : function() {
    var url= 'data/bookings/'+this.get('bookingCode')+'/cancel';
    return url;
  },
  cancel: function(callback) {

    $.ajax({
          headers: { 
              'Accept': 'application/json',
          },
          type: "POST",
          url: 'data/bookings/'+this.get('bookingCode')+'/cancel',
          success: function(data, textStatus, jqXHR) {
            
              if(callback && 'success' in callback) callback.success();
          },
          error: function(jqXHR,textStatus,errorThrown) {
              if(callback && 'error' in callback) callback.error(jqXHR.responseJSON.errors[0].code, jqXHR.responseJSON.errors[0].message);
          }
      });    	
  },
  confirm: function(callback){
    $.ajax(
        {
          headers: {
            'Accept': 'application/json',
          },
          type: "POST",
          url: 'data/bookings/'+this.get('bookingCode')+'/cancel',
          success: function(data, textStatus, jqXHR) {
            if(callback && 'success' in callback) callback.success();
          },
          error: function(jqXHR,textStatus,errorThrown) {
            if(callback && 'error' in callback) callback.error(jqXHR.responseJSON.errors[0].code, jqXHR.responseJSON.errors[0].message);
          }
        }
    );
  },

  findActiveOptionRateModel: function(rate) {
      return this.get('rates').findWhere({
          activity_rate_code: rate
      });
  },
  removeOptionRateModel: function(rate){
    return this.get('rates').remove(rate);
  },

  setAddRateModel: function(rate) {
      this.get('rates').add({
          activity_rate_code: rate.activity_rate_code,
          quantity: rate.quantity,
          type: rate.type
      }); 
  },
    sendReviewRate : function(callback) {
      
        var me = this;

        var data = {
          rates: me.get('rates')
        }
        $.ajax(
            {
              type: "POST",
              url: 'data/bookings/'+this.get('bookingCode')+'/cancel',
              data: JSON.stringify(data),
              dataType: 'json',
              cache: false,
              contentType: "application/json",
              before: function(xhr) {
                
                if (callback && 'beforeSend' in callback) callback.before(xhr);
              },
              success: function(model, response) {
                if(callback && 'success' in callback) callback.success();
              },
              error: function(jqXHR,textStatus,errorThrown) {
                if(callback && 'error' in callback) callback.error(jqXHR.responseJSON.errors[0].code, jqXHR.responseJSON.errors[0].message);
              }
            }
        );
    },
    bookingInfoCancel: function(callback){
      var model = new CancelBookingModel();
      me = this;
      
	    $.ajax(
          {
            headers: {
              'Accept': 'application/json',
            },
            type: "GET",
            url: 'data/bookings/'+this.get('bookingCode')+'/cancel',
            success: function(data, textStatus, jqXHR) {
              _.each(data.option_rates, function(partialRate) {
                
                me.get('rates').add({
                  activity_rate_code: partialRate.code,
                  quantity: partialRate.quantity,
                  type: partialRate.type
                });
              });
              if(callback && 'success' in callback) callback.success(data);
            },
            error: function(jqXHR,textStatus,errorThrown) {
              if(callback && 'error' in callback) callback.error(jqXHR.responseJSON.errors[0].code, jqXHR.responseJSON.errors[0].message);
            }
          }
      )
    },
    parse: function(response, options) {
      
    },
    getURLs : function(bookingCode) {
      return {
          "es" : '/booking/' + bookingCode + '/cancel',
          "en" : '/en/booking/' + bookingCode + '/cancel',
          "pt" : '/pt/booking/' + bookingCode + '/cancel'
      }
    }
});
