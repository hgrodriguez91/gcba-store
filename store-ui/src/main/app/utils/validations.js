var buildValidationResponse = function(isValid, key, message) 
{
	return {
		isValid: isValid, 
		key: key, 
		message: message
	};
};

var buildError = function(name, key, message) 
{
	return {
		name: name,
		key: key,
		message: message
	}
};

//=== Validators

var isValidEmail = function(email) 
{
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	return pattern.test(email);
};

//string should not be null and empty.
var stringValidator = function (value, options) 
{
	var minLength = options && options.length || 0;
	var errorKey = options && options.key || 'input.not.empty';
	var errorMsg = options && options.message || 'input.not.empty';
	return buildValidationResponse((value != null && value.length > minLength), errorKey, errorMsg);
};

//should not be empty or null and should be an email valid.
var emailValidator = function(email) 
{
	var resp = stringValidator(email);
	if(!resp.isValid) {
		return resp;
	}
    return buildValidationResponse(isValidEmail(email), 'email.invalid', 'email.invalid');
};

//number should be different to zero.
var numberValidator = function(value) 
{
	var pattern = new RegExp('^\\d+$');
	var isValid = pattern.test(value);
	return buildValidationResponse(isValid, 'input.not.empty', 'input.not.empty');
};

//it should validate it's a valid price.
var priceValidator = function(value) 
{
	var pattern = new RegExp('^\\d+$');
	var isValid = pattern.test(value);
	return buildValidationResponse(isValid, 'input.not.empty', 'input.not.empty');
};

var greaterThanZeroValidator = function(value) 
{
	return buildValidationResponse((value != null && value > 0), 'input.not.zero', 'input.not.zero');
};

var notNullValidator = function(value) 
{
	return buildValidationResponse((value != null), 'error.input.null', 'error.input.null');
};

var arrayNotEmptyValidator = function(value) 
{
	return buildValidationResponse((value && value.length > 0), 'error.collection.null', 'error.collection.null');
};

//Validator for Backbone's Model.
var modelValidator = function(model) {
	if(model.isValid()) {
		return buildValidationResponse(true, 'model.success', 'Model has not errors.');
	}
	return buildValidationResponse(false, 'model.invalid', 'model.invalid');
}

//Validator for Backbone's Collection
var collectionValidator = function(collection) {
	return doValidationModels(collection);
};

//Validator for Backbone's Collection that should not be empty.
//var notEmptyCollectionValidator = function(collection) {
//	var resp = arrayNotEmptyValidator(collection);
//	if(resp.isValid === false) {
//		return buildValidationResponse(false, 'model.collection.empty', 'Model Collecion is empty.');
//	}
//	return doValidationModels(collection);
//};

// === Helper for backbone models

//Execute validation process of backbone model.
var doValidation = function(model) 
{
	var resp = validateModelAttributes(model);
	if(resp != false) {
		return resp;
	}
	return;	
};

//execute all validators for the collection.
var doValidationModels = function(collection) 
{
	var errors = [];
	collection.each(function(model) {
		if(model.isValid() == false) {
			errors.push(buildError(model.cid, model.cid, 'Model has errors.'));
		}
	});
	return errors.length > 0 ? buildValidationResponse(false, 'model.collection.invalid', 'Model Collecion has errors.') : false;		
};

//execute all validators of the model.
var validateModelAttributes = function(model) 
{
	var errors = [];
	for (var key in model.validators) {
		if(model.validators.hasOwnProperty(key)) {
			var check = model.validators[key](model.get(key));
			if (check.isValid === false) {
				errors.push(buildError(key, check.key, check.message));
			}
		}
	}
    return errors.length > 0 ? errors : false;		
};

var _validateInputRequired = function(id) {
    var element = $('#' + id);

    if(element.is(':disabled')) {
    	return true;
    }
    
    var res = element.val().length > 0;
    if(!res) {
        element.parent().addClass("has-error");
    } else {
        element.parent().removeClass("has-error");
    }
    return res;
};

var _validateSelectorRequired = function(id) {
    var element = $('#' + id);
    
    if(element.is(':disabled')) {
    	return true;
    }
    
    var res = element.val() != null;
    if(!res) {
        element.parent().addClass("has-error");
    } else {
        element.parent().removeClass("has-error");
    }
    return res;
};