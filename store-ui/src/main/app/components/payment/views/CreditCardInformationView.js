var CreditCardInformationView = Backbone.View.extend({
    el:"#creditcard-information-container",
    events: {
        "change": "change"
    },
    initialize: function(options) {
    	var me = this;
    	
        this.validator = function () {
            var result = true;
            result &= _validateSelectorRequired('docType');
            result &= _validateInputRequired('docNumber');
            result &= _validateInputRequired('cardNumber');
            result &= _validateInputRequired('cardHolderName');
            result &= _validateInputRequired('securityCode');
            result &= _validateInputRequired('cardExpirationMonth');
            result &= _validateInputRequired('cardExpirationYear');
            result &= _validateInputRequired('creditCardType');
            result &= _validateInputRequired('creditCardIssuer');
            return result;
        }
        
        this.model.on('change:issuers', function() {
        	me.render();
        });
    },
    render: function() {
        this.$el.html(app.templates['payment/creditcard-information.hbs'](this.model.toJSON()));
        
        if(this.model.get('issuers') == null || this.model.get('issuers').length == 0) {
        	this.$("#creditCardIssuer").addClass("disabled").prop('disabled', true);
        }
        
        this.$('[data-toggle="tooltip"]').tooltip();
        this.$(".select2-control").select2();
        
        return this;
    },
    change: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.target;
        var change = {};
        change[target.id] = target.value;
        this.model.set(change);
    },
    validate: function() {
        return this.validator();
    }
});