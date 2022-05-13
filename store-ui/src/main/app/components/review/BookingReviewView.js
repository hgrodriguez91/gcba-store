var SuccessGreetingView = Backbone.View.extend({
  el: "#booking-review-response",

  initialize: function (options) {
    
  },

  render: function () {
   
    this.$el.html(app.templates['review/successGreeting.hbs']());
  }

});
var SuccessView = Backbone.View.extend({
  el: "#booking-review-response",
  events: {
    "submit #confirm-form": "confirm"
  },
  default:{
    modelReview: new BookingReviewModel()
  },
  initialize: function (options) {
    var me = this;
    this.operationCode = getOperationCodeFromUrl();
    this.model = new BookingReviewModel({
      
      operationCode: this.operationCode
    });
    this.model.fetch({
      success: function () {
        me.render();
        
      },
      error: function (e) {
          me.render();
      }
    });
  },
  
  render: function () {
    var me = this;
    var data = _.extend(this.model.toJSON());
    
    this.$el.html(app.templates['review/successReview.hbs'](data));
    this.elementFindStrategies = {};
    this.elementFindStrategies.tempReviewToCustomerComment = function() {
      return me.$("textarea[name='tempReviewToCustomerComment']").closest(".form-group");
    };

    this.bindStarClick();
    this.$el.find('.star').mouseover(function() {
      me.$el.find('.star').removeClass('error');
    });

    this.bindStarClick();
    this.$el.find('.star').mouseover(function() {
      me.$el.find('.star').removeClass('error');
    });
    return this;
  },
  bindStarClick: function() {
    this.$el.find('.star').on('click', $.proxy(this.rateStar, this));
  },
  unbindStarClick: function() {
    this.$el.find('.star').unbind('click');
  },

  rateStar: function(event) {
    event.preventDefault();
    event.stopPropagation();

    //Get all the stars
    var stars = this.$el.find('span.star');
    $(stars).removeClass('selected');

    var selectedStar = event.target;
    $(selectedStar).addClass('selected');
    //Get the index of the selected star in order to get the rating value
    var rating = stars.size() - stars.index(selectedStar);
    this.model.set('tempReviewToCustomerRating', rating);
  },
  confirm: function (event) {
    event.preventDefault();
    event.stopPropagation();
    var me = this;
    this.model.set("reviewDescripcion", $('#rate-comment').val());
    this.model.set("reviewLastName", $('#lastName').val());
    this.model.set("reviewFirstName", $('#firstName').val());

    this.loadingModal = new LoadingModal({text : 'activity.review.message'}).render();
    this.model.sendReviewRate({
      before: function(data) {

      },
      success: function (model, response) {
        this.childView = new SuccessGreetingView().render();
        
        killModal();
      },
      error: function (code, message) {
        
      }
    });
  }
});

var ErrorView = Backbone.View.extend({
  el: "#booking-review-response",
  default:{
    codeErr: null
  },
  initialize: function (options) {
    //nothing.
    this.codeErr = options.codeError;
  },
  render: function () {
    this.$el.html(app.templates['review/error.hbs']({codeErr : this.codeErr}));
    return this;
  }
});


var ReviewView = Backbone.View.extend({
  el: "#booking-review-details",
  initialize: function (options) {
    var me = this;
    this.operationCode = getOperationCodeFromUrl();
    this.model = new BookingReviewModel({
      
      operationCode: this.operationCode
    });
    this.model.review({
      success: function (data) {
        this.childView = new SuccessView().render();
      },
      error: function (code, message) {  
        this.childView = new ErrorView({codeError: code}).render();
      }
    });
  },
  render: function () {

    var data = _.extend(this.model.toJSON());
    var me = this;
    this.$el.html(app.templates['review/details.hbs'](data));
    return this;
  }

});
var BookingReviewView = PageView.extend({
    initialize: function (options) {
      PageView.prototype.initialize.apply(this, arguments);
      var me = this;
      this.render();
      this.childView = new ReviewView().render();
    },
    contentRender: function () {
      this.$el.html(app.templates['review/container.hbs']());
    }
  });

i18nInit(function () {
    new BookingReviewView({
      footerOptions: {
        cssClass: "booking-details-footer"
      }
    });
  });