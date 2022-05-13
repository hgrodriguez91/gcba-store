var SessionModel = Backbone.Model.extend({
	// Initialize with negative/empty defaults
	defaults: {
		loggedIn: false,
		userId: ''
	},
    initialize : function(options) {
        this.user = options.user;
    },
    postAuth : function (data, args, callback) {
        var me = this;
        $.ajax({
        	contentType : args.contentType,
        	type: 'POST',
            url: args.method,
            data: data,
            dataType: 'json',
            beforeSend: function(xhr) {
            	//Set the value in the header to serialize the response as JSON.
    			xhr.setRequestHeader("X-Ajax-call", "true");
                // Set the CSRF Token in the header for security
                //var token = $('meta[name="csrf-token"]').attr('content');
                //if (token) xhr.setRequestHeader('X-CSRF-Token', token);
            },
            success: function (res) {
                if(res.status == 'SUCCESS'){
                    if(callback && 'success' in callback) callback.success(res);
                } else {
                    if(callback && 'error' in callback) callback.error(res);
                }
            },
            error: function (mod, res) {
                if(callback && 'error' in callback) callback.error(res);
            }
        })
        .complete(function(res) {
            if(callback && 'complete' in callback) callback.complete(res);
        });
    },
    login: function (data, callback) {
    	var me = this;
        this.postAuth(data, { contentType: 'application/x-www-form-urlencoded; charset=UTF-8', method: 'login/authenticate' }, { 
        	success : function (res) {
        		me.user.updateStatus(res.user || {});
            	me.set({ userId: res.user.userCode, loggedIn: true });
            	if (callback && 'success' in callback) callback.success(res);
        	}, 
        	error : function (res) {
        		if (callback && 'error' in callback) callback.error(res);
        	}, 
        	complete : function (res) {
        		if (callback && 'complete' in callback) callback.complete(res);
        	} 
        });
    },
    facebookLogin : function () {
		$("#fb_signin").submit();
		this.loadingModal = new LoadingModal({text : 'please-moment'}).render();
    },
    signup: function (data, callback) {
    	var me = this;
        this.postAuth(data, { contentType : 'application/json', method: 'api/store/users/signup' }, {
        	success : function (res) {
        		me.user.updateStatus(res.user || {});
            	me.set({ userId: res.user.code, loggedIn: true });
            	if (callback && 'success' in callback) callback.success(res);
        	}, 
        	error : function (res) {
        		if (callback && 'error' in callback) callback.error(res);
        	}, 
        	complete : function (res) {
        		if (callback && 'complete' in callback) callback.complete(res);
        	} 
        });
    }
});