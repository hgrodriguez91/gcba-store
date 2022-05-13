var ProfileModel = Backbone.Model.extend({
    defaults : {
        profile : new PersonalInformationModel()
    },
    urlRoot : 'data/profile', 
    url : function() {
        return this.urlRoot;
    },
    save : function(attrs, options) {
        // `options` is an optional argument but is always needed here
        options || (options = {});
        var me = this;
        var profile = me.get('profile');
        var data = {
          email: profile.get('email'),
          firstName: profile.get('firstName'),
          lastName: profile.get('lastName'),
          residenceCode: profile.getResidenceCode(),
          gender: profile.get('gender')
        };

        // If `options.data` is set, Backbone does not attempt to infer the content
        // type and leaves it null. Set it explicitly as `application/json`.
        options.contentType = "application/json";
        options.data = JSON.stringify(data);
        options.method = "PUT";

        return Backbone.Model.prototype.save.call(this, attrs, options);
    },
    parse: function(response, options) {
    	var data = response != null && response.profile != null ? response.profile : {};
        
    	var profile = this.get('profile');
        profile.set('countries', response.countries);
        profile.set('states', response.states);
        
        //var residenceType = profile.getResidenceType(data.residenceCode);
        var residenceType = data.location.type;
        
        profile.set('email', data.email);
        profile.set('firstName', data.firstName);
        profile.set('lastName', data.lastName);
        profile.set('residenceCountry', residenceType == 'STATE' ? data.location.parent.code : data.location.code);
        profile.set('residenceState', residenceType == 'STATE' ? data.location.code : null);
        profile.set('gender', data.gender);
    },
    updateProfile : function(options) {
        this.save([], {
            success : function(model, response) {
                options.success();
            },
            error : function(model, response) {
                if(response.status == 200) {
                    options.success();
                } else {
                    options.error();
                }
            }
        });
    }
});