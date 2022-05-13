'use strict';
(function() {
    Swag.registerHelpers(Handlebars);

    /*TODO custom helpers module*/
    Handlebars.registerHelper('number', function(theNumber, options) {
        var numberOptions = {};
        for (var numberOption in options.hash) {
            numberOptions[numberOption] = options.hash[numberOption];
        }
        var thisNumber = new Number(theNumber);
        if (numberOptions["maximumFractionDigits"] === "0") thisNumber.toFixed(0); /*to avoid rounding*/
        var formattedNumber = "";
        formattedNumber = thisNumber.toLocaleString(numberOptions.localeString || i18n.lng(), numberOptions);
        return formattedNumber;
    });

    Handlebars.registerHelper('activityPrice', function(price, options) {
        var activityPrice;
        if (price.amount > 0) {
            var amount = Handlebars.helpers.number(price.amount, options);
            var currency = Handlebars.helpers.t(price.currency);
            var innerContent = '<span>' + currency + '</span><span>' + amount + '</span>';
            activityPrice = new Handlebars.SafeString("<div class='activity-price item-price'>" + innerContent + "</div>")
        } else if (price.amount == 0) {
            var text = Handlebars.helpers.t("free");
            var innerContent = '<span>' + text + '</span>';
            activityPrice = new Handlebars.SafeString("<div class='activity-price item-price free'>" + innerContent + "</div>")
        }
        return activityPrice;
    });

    Handlebars.registerHelper('discountPrice', function(discount, options) {
        if (discount == null) {
            discount = "";
        } else {
            var amount = Handlebars.helpers.number(discount.amount, options);
            var currency = Handlebars.helpers.t(discount.currency);
            var innerContent = '<span>' + currency + '</span><span>' + amount + '</span>';
            discount = new Handlebars.SafeString("<div class='item-discount-price'>" + innerContent + "</div>");
        }
        return discount;
    });

    //i18n - Basic handlebars helper
    Handlebars.registerHelper('t', function(i18n_key, options) {
        var hash = options ? options.hash : {};
        var result = i18n.t(i18n_key, hash);
        return new Handlebars.SafeString(result);
    });

    //Helpers
    Handlebars.registerHelper('collectionOf', function(partialName, collection, options) {
        var ret = "";
        var partial = Handlebars.partials[partialName];
        for(var i=0, j=collection.length; i<j; i++) {
            ret = ret + partial({
                item : collection[i],
                baseImageURL : options.data.root.baseImageURL,
                baseURL : options.data.root.baseURL,
                activityURL : options.data.root.activityURL
            });
        }
        return ret;
    });
    Handlebars.registerHelper("time", function(value, options) {
    	return Handlebars.helpers.simpleTime({
    		hour: value.attributes.hour,
    		minutes: value.attributes.minutes,
    		periodDay: value.attributes.periodDay
    	}, options);
    });
    Handlebars.registerHelper("simpleTime", function(value, options) {
    	var hour = (value.hour <= 9) ? ("0" + value.hour) : value.hour;
    	var minutes = (value.minutes <= 9) ? ("0" + value.minutes) : value.minutes;
    	return hour + ":" + minutes + " " + value.periodDay;
    });
    Handlebars.registerHelper("extractDay", function(value, options) {
    	return value.substring(value.lastIndexOf("-") + 1);
    });
    Handlebars.registerHelper("extractMonth", function(value, options) {
    	return value.substring(value.indexOf("-") + 1, value.lastIndexOf("-"));
    });
    Handlebars.registerHelper("money", function(value, options) {
    	if(value == null) {
    		return "";
    	}
    	return Handlebars.helpers.t(value.currency) + " " + value.amount;
    });
    Handlebars.registerHelper("moneyToNegative", function(value, options) {
    	if(value == null) {
    		return "";
    	}
    	return Handlebars.helpers.t(value.currency) + " -" + value.amount;
    });
    Handlebars.registerHelper("parseBookingDate", function(value, options) {
    	if(value == null) {
    		return "";
    	}
    	return moment(value, 'YYYY-MM-DD').locale('es').format('DD/MM/YYYY');
    });
    Handlebars.registerHelper("select", function(value, options) {
    	return options.fn(this).split('\n')
    	    .map(function(v) {
    	    	var t = 'value="' + value + '"'
    	    	return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
    	    }).join('\n')
    });
    Handlebars.registerHelper("listingURL", function(urlOptions) {
        var options = urlOptions ? urlOptions.hash : {};
        return buildActivitiesListURL(options);
    });
    Handlebars.registerHelper("contains", function(string, searchThis, options) {
        var isPng = typeof string == 'string' ? string.indexOf(searchThis) : false;

        return new Handlebars.SafeString(isPng ? options.fn(this) : "");
    });

    Handlebars.registerHelper('decodeQueryString', function(parseableString, options) {
        var parsedString = parseableString ? decodeURIComponent(parseableString.replace(/\+/g,' ')) : "";
        return new Handlebars.SafeString(parsedString);
    });
    Handlebars.registerHelper('activityShowBookingPercentage', function(bookingPercentage, options) {
        if (bookingPercentage && bookingPercentage > 0 && bookingPercentage < 100) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('activityShowDiscount', function(discount, options) {
        if (discount && discount > 0 && discount < 100) {
            return options.fn(this);
        } else {
        	return options.inverse(this);
        }
    });
    Handlebars.registerHelper('activityShowDiscountAmount', function(discount, options) {
        if (discount && discount.amount > 0) {
            return options.fn(this);
        } else {
        	return options.inverse(this);
        }
    });

    Handlebars.registerHelper('html_decoder', function(text) {
    	var parsedString = text ? unescape(text).replace(/&nbsp;/g, ' ') : "";
    	return new Handlebars.SafeString(parsedString);
    });
    
    Handlebars.registerHelper('concat', function() {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    //Home
    Handlebars.registerPartial('homeActivityRecommendedView', app.templates['home/activity-recommended.hbs']);
    Handlebars.registerPartial('homeActivityView', app.templates['home/activity-view.hbs']);
    Handlebars.registerPartial('homeSlideCollectionInfo', app.templates['home/activity-slide-collection-info.hbs']);
    Handlebars.registerPartial('activitySlideInfoRedCellophane', app.templates['home/activity-slide-info-red-cellophane.hbs']);
    //Listing
    Handlebars.registerPartial('activityListItem', app.templates['listing/activity-list-item.hbs']);
    Handlebars.registerPartial('activitiesFilters', app.templates['listing/activities-filters.hbs']);
    //Details
    Handlebars.registerPartial('liteActivityView', app.templates['details/lite-activity-view.hbs']);
    Handlebars.registerPartial('otherActivityView', app.templates['details/other-activity-view.hbs']);
    //Rating
    Handlebars.registerPartial('ratingActivitiesView', app.templates['details/activity-rating.hbs']);
})();
