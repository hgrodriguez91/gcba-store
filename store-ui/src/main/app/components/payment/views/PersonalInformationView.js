var PersonalInformationView = Backbone.View.extend({
    el:"#personal-information-container",
    events: {
        "change": "change"
    },
    initialize: function(options) {
    	var me = this;
    	
        this.validator = function () {
        	var _residenceStateValidator = function() {
        		if (me.model.get('states') != null && me.model.get('states').length > 0) {
        			return _validateInputRequired('residenceState');
        		}
        		return true;
        	};
        	
            var result = true;
            result &= _validateInputRequired('email');
            result &= _validateInputRequired('firstName');
            result &= _validateInputRequired('lastName');
            result &= _validateInputRequired('residenceCountry');
            result &= _residenceStateValidator();
            result &= _validateSelectorRequired('gender');
            return result;
        }
        
        this.model.on('change:states', function() {
        	me.render();
        })
    },
    render: function() {
        this.$el.html(app.templates['payment/personal-information.hbs'](this.model.toJSON()));
        if(this.model.get('states') == null || this.model.get('states').length == 0) {
        	this.$("#residenceState").addClass("disabled").prop("disabled", true);
        }
        this.$(".select2-control").select2();
        return this;
    },
    change: function(event) {
        event.preventDefault();
        event.stopPropagation();
        var target = event.target;
        var change = {};
        change[target.id] = target.value.trim();
        this.model.set(change);
    },
    validate: function() {
        return this.validator();
    }
});