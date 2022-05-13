var PersonalInformationModel = Backbone.Model.extend({
    defaults: {
        genders: null,
        email: null,
        firstName: null,
        lastName: null,
        nationality: null,
        gender: null,
        countries: null,
        residenceCountry: null,
        states: null,
        residenceState: null
    },
    initialize: function(options) {
    	var me = this;
    	
        this.set('genders', [{ code: 'MALE'}, {code: 'FEMALE'}]);
        this.set('gender', 'MALE');
        
        this.on('change:residenceCountry', function() {
        	me.set('residenceState', null);
        	me.loadStates();
        });
    },
    mapValues: function(response) {
    	this.set('countries', response.countries);
    	return this;
    },
    loadStates: function() {
    	var me = this;
    	$.get("data/checkout/states/"+this.get('residenceCountry')+"/", function(data) {
    		me.set('states', data);
    	});
    },
    getResidenceCode: function() {
    	if(this.get('residenceState') != null) {
    		return this.get('residenceState');
    	}
    	return this.get('residenceCountry');
    },
    getResidenceType: function(residenceCode) {
        var type = null;
        if (residenceCode && this.get('countries') && this.get('countries')) {
            var isCountry = _.find(this.get('countries'), function(country) {
                return country.code === residenceCode;
            });

            type = isCountry ? 'Country' : 'State';
        }
        return type;
    }
});