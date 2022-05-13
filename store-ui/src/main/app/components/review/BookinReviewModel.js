var ReviewModel = Backbone.Model.extend({
    defaults: {
        activityImage: null,
        activityTitle: null,
        activityDate: null,
        tempReviewToCustomerRating: null,
        reviewLastName: null,
        reviewFirstName: null,
        reviewDescripcion: null
    }
});
var BookingReviewModel = Backbone.Model.extend({
	defaults: {
        reviewModel : new ReviewModel(),
        reviewqualified: false,
        operationCode: null
	},
    initialize : function(options) {
        
    },
    url : function() {
        var url = 'data/bookings/'+this.get('operationCode')+'/review';
        return url;
    },

    review: function(callback) {
        
        var model = new BookingReviewModel();
    	$.ajax({
            headers: { 
                'Accept': 'application/json',
            },
            type: "GET",
            url: 'data/bookings/'+this.get('operationCode')+'/review',
            success: function(data) {
                if(callback && 'success' in callback) callback.success(data);
            },
            error: function(jqXHR,textStatus,errorThrown) {
                if (undefined !== jqXHR.responseJSON) {
                    if(callback && 'error' in callback) callback.error(jqXHR.responseJSON.errors[0].code, jqXHR.responseJSON.errors[0].message);
                }else {
                    callback.error('booking.error.nonexistent-code', 'error');
                }
            }
        });    	
    },


    sendReviewRate : function(callback) {

        var me = this;
        var reviewModel = me.get('reviewModel');
        var data = {
            rating: this.get('tempReviewToCustomerRating'),
            last_name: this.get('reviewLastName'),
            first_name: this.get('reviewFirstName'),
            operation_code: this.get('operationCode'),
            description: this.get('reviewDescripcion')
        };
        $.ajax(
            {
              type: "POST",
              url: 'data/bookings/review',
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

    parse: function(response, options) {
    	var data = response != null && response.profile != null ? response.profile : {};
        var reviewModel = this.get('reviewModel');
        var date = moment(response.activity_date).format('DD/MM/YYYY');
        reviewModel.set('activityImage', response.activity_image);
        reviewModel.set('activityTitle', response.activity_title);
        reviewModel.set('activityDate', date);
        
    }
});