var GoogleAnalyticsHelper = function() {
    var trackEvent = function(options) {
        var fieldsObject = _.extend(options || {}, {hitType : 'event'});
        ga('send'. fieldsObject);
    };
    return {
        trackEvent : trackEvent
    };
}();