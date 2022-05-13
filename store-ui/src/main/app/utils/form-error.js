/**
 * Show all errors that are received.
 */
var showErrors = function(errors, strategies) 
{
    _.each(errors, function (error) {
    	if(strategies[error.name]) {
    		var group = strategies[error.name]();
    		group.addClass("has-error");
    		group.append('<span class="error_message" style="color: #A94442;">'+i18n.t(error.message)+'</span>');
    	}
    });
};

/**
 * Function to hide all active errors in the current screen. 
 */
var hideErrors = function(view) 
{
	hideFormError();
	$('.form-group').removeClass('has-error');
	$('.has-error').removeClass('has-error');
	$('.form-group').find(".error_message").remove();
	$('.error_message').remove();
};

/**
 * 
 */
var hideFormError = function() 
{
	$("#error-message-detail").remove();
	$("#warning-message-detail").remove();
};

/**
 * Move to the first element that was marked with the error class.
 */
function moveToFormError() 
{
	if($('.has-error').first().offset()) {
		$('html, body').animate({scrollTop: ($('.has-error').first().offset().top - 100)}, 'low');
	} else {
		$('html, body').animate({scrollTop: ($('#error-message-detail').first().offset().top - 120)}, 'low');
	}
};