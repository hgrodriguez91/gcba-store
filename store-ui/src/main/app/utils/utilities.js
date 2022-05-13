function getActivityCodeFromUrl(url) {
    var activityPath = url;
    if(activityPath.indexOf("?") >= 0) {
    	activityPath = activityPath.substring(0, activityPath.indexOf("?"));
    }
    if (activityPath.indexOf("#") >= 0) {
    	activityPath = activityPath.substring(0, activityPath.indexOf("#"));
    }
    return activityPath.split("/").reverse()[0].split('-').reverse()[0]; 
}

function getActivityPublicCodeFromUrl(url) {
    var activityPath = url;
    if(activityPath.indexOf("?") >= 0) {
    	activityPath = activityPath.substring(0, activityPath.indexOf("?"));
    }
    if (activityPath.indexOf("#") >= 0) {
    	activityPath = activityPath.substring(0, activityPath.indexOf("#"));
    }
    return activityPath.split("/").reverse()[0]; 
}

function getCollectionCodeFromUrl(url) {
    var collectionPath = url;
    if(collectionPath.indexOf("?") >= 0) {
    	collectionPath = collectionPath.substring(0, collectionPath.indexOf("?"));
    }
    if (collectionPath.indexOf("#") >= 0) {
    	collectionPath = collectionPath.substring(0, collectionPath.indexOf("#"));
    }
	return collectionPath.split('/').reverse()[0]
}

function getOperationCodeFromUrl() {
    var currentPath = location.href;
    if(currentPath.indexOf("?") >= 0) {
    	currentPath = currentPath.substring(0, currentPath.indexOf("?"));
    }
    if (currentPath.indexOf("#") >= 0) {
    	currentPath = currentPath.substring(0, currentPath.indexOf("#"));
    }
    var parts = _.without(currentPath.split('/'), "");
	return parts.reverse()[1];
}

function getBookingCodeFromUrl() {
    var currentPath = location.href;
    if(currentPath.indexOf("?") >= 0) {
    	currentPath = currentPath.substring(0, currentPath.indexOf("?"));
    }
    if (currentPath.indexOf("#") >= 0) {
    	currentPath = currentPath.substring(0, currentPath.indexOf("#"));
    }
    var parts = _.without(currentPath.split('/'), "");
	return parts.reverse()[1];
}

function scrollToBookingForm() {
	$('html, body').animate({scrollTop: $('#booking-form-container').offset().top - 50}, 500);
}

function navigateTo(id) {
	$('html, body').animate({scrollTop: ($(id).offset().top - 60)}, 500);
}

function paramsFromURL(url) {
    var params = {};
    var regex = /(?:\?)([^&=\s]+=[^&=\s]*)|(?:&)([^&=\s]+=[^&=\s]*)/g;
    if (typeof url == 'string') {
        params =_.chain(url.match(regex))
            .map(function(param) {return param.replace(/\?|&/gm, "").split("=")})
            .object()
            .value();
    }
    return params;
}

function buildActivitiesListURL(options) {
    var url = PagesURL.getURL("activities", i18n.lng());
    if (options.location && options.childLocation) options.location += "_" + options.childLocation;
    if (options.location && !options.category) url += "/" + options.location;
    if (options.location && options.category) url += "/" + options.location + "/" + options.category;
    if (!options.location && options.category) url += "/" + options.category;
    if (!options.location && !options.category && options.collectionCode) url += "/" + options.collectionCode;
    if (options.pageSize || options.pageIndex || options.fromPrice || options.toPrice) url += "?";
    if(options.pageSize) url += "pageSize=" + options.pageSize;
    if(options.pageIndex) url += "&pageIndex=" + options.pageIndex;
    if(options.searchText) url += "&s=" + options.searchText;
    if(options.organizationCode) url += "&organizationCode=" + options.organizationCode;
    if (/^[0-9]+$/.test(options.fromPrice)) url += "&fromPrice=" + options.fromPrice;
    if (/^[0-9]+$/.test(options.toPrice)) url += "&toPrice=" + options.toPrice;
    return url;
}