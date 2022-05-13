var UserModel = Backbone.Model.extend({
    initialize : function(options) {
    }, 
    defaults : {
    	authenticated : false,
    	userCode : null,
    	accessToken : null,
    	firstName : '',
    	lastName : '',
    	name : '',
    	photo : ''    	
    },
    url : function() {
        return "users/current";
    },
    updateStatus: function (data) {
        this.set(_.pick(data, _.keys(this.defaults)));
    },
    /*
     * Check for user from API.
     */
    checkAuth : function (callback, args) {
	  var me = this;
	  this.fetch({ 
	      success: function (mod, res) {
	          if(!res.error && res.user){
	        	  me.updateStatus(res.user);
	        	  if('success' in callback) callback.success(mod, res);    
	          } else {
	        	  if('error' in callback) callback.error(mod, res);    
	          }
	      }, 
	      error: function (mod, res) {
	          if('error' in callback) callback.error(mod, res);    
	      }
	  })
	  .complete( function () {
	      if('complete' in callback) callback.complete();
	  });
	}
});