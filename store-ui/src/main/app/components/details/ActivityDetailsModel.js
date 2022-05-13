var TimeModel = Backbone.Model.extend({
    defaults: {
        hour: null,
        minutes: null,
        periodDay: null,
        capacity: null
    }
});

var TimeCollection = Backbone.Collection.extend({
    model: TimeModel
});

var ScheduleModel = Backbone.Model.extend({
    defaults: {
        fromDate: null,
        toDate: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
        times: new TimeCollection()
    }
});

var ScheduleCollection = Backbone.Collection.extend({
    model: ScheduleModel
});

var ActivityOptionSchedulesModel = Backbone.Model.extend({
    defaults: {
        activityOptionCode: null,
        schedules: new ScheduleCollection()
    }
});

var ActivityOptionSchedulesCollection = Backbone.Collection.extend({
    model: ActivityOptionSchedulesModel
});

var MapModel = Backbone.Model.extend({
    defaults: {
        id: '', currentLatLng: {}, mapOptions: {}, map: {},
        position: {}, zoom: 13, maxZoom: 16, minZoom: 12
    }
});

var ActivityRateModel = Backbone.Model.extend({
    defaults: {
        activity_rate_code:null,
        quantity: null
    }
});

var ActivityRateCollection = Backbone.Collection.extend({
    model: ActivityRateModel,

    initialize: function () {
        me = this;
    },
    convertToSend: function() {
		var data = []
		this.each(function(ref) {
			data.push({
	    		activity_rate_code: ref.get('activity_rate_code'),
                quantity: ref.get('quantity'),
                type: ref.get('type')
			});
		});
		return data;
    }
});

var ActivityOptionRateModel = Backbone.Model.extend({
    defaults: {
        ageFrom: null,
        ageTo: null,
        code: null,
        description:null,
        name: null,
        type: null
    }
});

var ActivityOptionRateCollection = Backbone.Collection.extend({
    model: ActivityOptionRateModel
});

var ActivityOptionModel = Backbone.Model.extend({
    defaults: {
        activityOptionCode: null,
        code: null,
        title: null,
        details: null,
        marketingPrice: null,
        activityOptionsRates: new  ActivityOptionRateCollection()
    }
});

var ActivityOptionCollection = Backbone.Collection.extend({
    model: ActivityOptionModel
});

var ActivityItemModel = Backbone.Model.extend({
    defaults: {
        code: null,
        description: null
    }
});

var ActivityItemCollection = Backbone.Collection.extend({
    model: ActivityItemModel
})

var ActivityModel = Backbone.Model.extend({
    defaults: {
        code: null,
        title: null,
        description: null,
        details: null,
        difficulty: null,
        cancelationPolicy: null,
        confirmationType: null,
        paymentPercentageOnline: null,
        discount: null,
        discountFrom: null,
        discountTo: null,
        oldPrice: null,
        marketingPrice: null,
        duration: null,
        location: null,
        address: null,
        category: null,
        organization: null,
        photos: [],
        options: new ActivityOptionCollection(),
        optionsRate : new ActivityOptionRateCollection(),
        highlights: new ActivityItemCollection(),
        inclusions: new ActivityItemCollection(),
        exclusions: new ActivityItemCollection(),
        recommendations: new ActivityItemCollection(),
        restrictions: new ActivityItemCollection(),
        breadcrumbs: []
    }
});

var CheckAvailabilityResponseModel = Backbone.Model.extend({
    defaults: {
        isAvailable: false,
        operationCode: null
    }
});

var CheckAvailabilityModel = Backbone.Model.extend({
    defaults: {
        activity_code: null,
        activity_option_code: null,
        date: null,
        time: null,
        promo_code: null,
        response: null,
        rates: new ActivityRateCollection(),
        allRates: new ActivityOptionCollection()
    },
    urlRoot: 'data/checkout/check-availability',
    url: function() {
        return this.urlRoot;
    },
    parse: function(response, options) {
       
        var checkAvailabilityResponse = new CheckAvailabilityResponseModel({
            isAvailable : response.available,
            operationCode: response.operation_code
        });
        return { response: checkAvailabilityResponse }; 
    }
});

/**
 * This is the model to check availability of the activity.
 */
var CheckoutBoxModel = Backbone.Model.extend({
    defaults: {
        activityCode: null,
        options: new ActivityOptionCollection(),
        allAvailableSchedules: new ActivityOptionSchedulesCollection(),
        minDate: moment(),
        maxDate: moment(),
        marketingPrice: null,
        schedules: null,
        times: null,
        activityOptionCode: null,
        date: null,
        time: null,
        adultsQuantity: 2,
        minorsQuantity: null,
        available: false,
        promo_code: null,
        limitedQuota: 0,
        rates: new ActivityRateCollection(),
        allRates: new ActivityOptionCollection(),
        oneRates: null,
        rateName: null
    },
    initialize: function(options) {
        var me = this;

        this.get('allAvailableSchedules').on('add', function(activityOptionSchedules) {
            me.setMaxDate(activityOptionSchedules);
        });

        this.on('change:activityOptionCode', function(model, value) {
            me.set('schedules', value ? me.findActiveSchedules() : null);
            me.set('times', null);
            me.set('date', null);
            me.set('time', null);
            me.set('rateName', null);
            me.set('oneRates', value ? me.findActiveOptionRates() : null);
            me.trigger('update:schedules');
            me.trigger('update:oneRates');
            
        });

        this.on('change:date', function() {
            me.set('times', null);
            me.trigger('start:get-times');
            me.findActiveTimes({
                success: function(times) {
                    me.set('times', times);
                    me.set('time', null);
                    me.trigger('update:times');
                },
                error: function() {
                    me.set('time', null);
                }
            });
        });

        this.validators = {
            rateName: function(value) {
                if (value == null) {
                    return notNullValidator(value); 
                }
                var exist = false;
                me.get('rates').each(function(itemRate){
                    if (itemRate.get('type') === 'ADULTS'  || itemRate.get('type') === 'OTHER') {
                        exist = true;
                       return  buildValidationResponse(true); 
                    }
                });
               return buildValidationResponse(exist, 'error.input.null', 'error.input.null');
            }
        };
        this.validators.activityOptionCode = stringValidator;
        this.validators.date = notNullValidator;
        this.validators.time = notNullValidator;
    },
    url: function() {
        return 'data/checkout';
    },
    getMaxAdults : function() {
        var max = null;
        if (parseInt(this.get("limitedQuota"), 10) > 0) {
            if (parseInt(this.get("minorsQuantity"), 10)) {
                max = parseInt(this.get("limitedQuota"), 10) - parseInt(this.get("minorsQuantity"), 10);
            } else {
                max = parseInt(this.get("limitedQuota"), 10);
            }
        }
        return max;
    },
    getMaxMinors : function() {
        var max = null;
        if (parseInt(this.get("limitedQuota"), 10) > 0) {
            if (parseInt(this.get("adultsQuantity"), 10)) {
                max = parseInt(this.get("limitedQuota"), 10) - parseInt(this.get("adultsQuantity"), 10);
            } else {
                max = parseInt(this.get("limitedQuota"), 10) - 1;
            }
        }
        return max;
    },
    isValidDate: function(date) {
        var momentDate = moment(date);
        var weekdayName = moment(date).locale('en').format("dddd").toLowerCase();
        var response = this.get('schedules') ? this.get('schedules').some(function(schedule) {
            return ((momentDate.isBetween(schedule.get('fromDate'), schedule.get('toDate')) 
                    || momentDate.isSame(schedule.get('fromDate')) 
                    || momentDate.isSame(schedule.get('toDate'))) && schedule.get(weekdayName));
        }) : false;
        return response;
    },
    selectDefaultActivityOption: function() {
        if(this.get('available') == true && this.get('options').length >= 1) {
            this.set('activityOptionCode', this.get('options').at(0).get('code'))
            this.trigger('set:defaultActivityOption');
        }
    },
    setSelectedTime: function(hour, minutes, periodDay) {
        this.set('time', new TimeModel({
            hour: hour,
            minutes: minutes,
            periodDay: periodDay
        }));
    },
    setPromocode: function(promocode) {
        this.set('promocode',promocode);
    },
    setAddRateModel: function(rate) {
        this.get('rates').add({
            activity_rate_code: rate.activity_rate_code,
            quantity: rate.quantity,
            type: rate.type
        }); 
    },
    

    setMaxDate: function(activityOptionSchedules) {
        var me = this;
        activityOptionSchedules.get('schedules').each(function(schedule) {
            if(me.get('maxDate').isBefore(schedule.get('toDate'))) {
                me.set('maxDate', moment(schedule.get('toDate')));
            }
        });
    },
    findActiveSchedules: function() {
        return this.get('allAvailableSchedules').findWhere({ 
            activityOptionCode: this.get('activityOptionCode') 
        }).get('schedules');
    },
    findActiveOptionRates: function() {
        return this.get('allRates').findWhere({
            activityOptionCode: this.get('activityOptionCode')
        }).get('activityOptionsRates');
    },

    findActiveOptionRateModel: function(rate) {
        return this.get('rates').findWhere({
            activity_rate_code: rate
        });
    },
    findActiveOptionOneRateModel: function(rate) {
        return this.get('oneRates').findWhere({
            code: rate
        });
    },
    removeOptionRateModel: function(rate){
        return this.get('rates').remove(rate);
    },
    findActiveTimes: function(callback) {
        var me = this;

        var data = {
                activity_code: this.get('activityCode'),
                activity_option_code: this.get('activityOptionCode'),
                date: moment(this.get('date')).format('YYYY-MM-DD')
        };

        $.ajax({
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            type: "POST",
            url: 'data/checkout/check-capacity',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function(data) {
                var result = new TimeCollection();
                var resultAM = new TimeCollection();
                var resultPM = new TimeCollection();
               
                _.each(data.capacityPerTimes.reverse(), function(timeAndCapacity) {
                    
                    if (timeAndCapacity.time.hour === 12 && timeAndCapacity.time.period_day === 'PM') {
                        resultPM.add({
                            hour: timeAndCapacity.time.hour,
                            minutes: timeAndCapacity.time.minute,
                            periodDay: timeAndCapacity.time.period_day,
                            capacity: timeAndCapacity.capacity
                        });
                       
                    }
                    return;
                });

                _.each(data.capacityPerTimes.reverse(), function(timeAndCapacity) {

                    if (timeAndCapacity.time.period_day == 'AM') {
                        resultAM.add({
                            hour: timeAndCapacity.time.hour,
                            minutes: timeAndCapacity.time.minute,
                            periodDay: timeAndCapacity.time.period_day,
                            capacity: timeAndCapacity.capacity
                        });
                    }
                    if (timeAndCapacity.time.period_day == 'PM') {
                        
                        if (timeAndCapacity.time.hour != 12) {
                            resultPM.add({
                                hour: timeAndCapacity.time.hour,
                                minutes: timeAndCapacity.time.minute,
                                periodDay: timeAndCapacity.time.period_day,
                                capacity: timeAndCapacity.capacity
                            });
                        }
                        
                    }
                   
                });
               
                result.add(resultAM.toJSON());
                result.add(resultPM.toJSON());
                
                callback.success(result);
            },
            error: function(data) {
                callback.error();
            }
        });
    },
    checkAvailability: function(callback) {
       
        var model = new CheckAvailabilityModel({
            activity_code: this.get('activityCode'),
            activity_option_code: this.get('activityOptionCode'),
            date: this.get('date').format('YYYY-MM-DD'),
            promo_code : this.get('promocode'),
            time: {
                hour: this.get('time').get('hour'),
                minute: this.get('time').get('minutes'),
                period_day: this.get('time').get('periodDay'),
            },
            rates: this.get('rates').convertToSend()
        });
        model.save([], {
            success: function(model, response) {
                if(callback && 'success' in callback) callback.success(model, response);
            },
            error: function(model, response) {
                if(callback && 'error' in callback) callback.error(model, response);
            }
        });
    },
    validate: function(attrs, options) {
        return doValidation(this);
    },
    isFree : function() {
        return this.get("marketingPrice") != null && (parseInt(this.get("marketingPrice").amount, 10)== 0);
    }
});

/**
 * This is the main model for the pageview. It has an instance of the all used model for the page.
 */
var ActivityDetailsModel = Backbone.Model.extend({
    defaults: {
        widget: null,
        activity: new ActivityModel(),
        checkoutBox: new CheckoutBoxModel(),
    },
    initialize : function(options) {
        this.code = options.code;

        this.activityOptionFactory = function(item) {
            return { code: item.code, title: item.title, details: item.details, marketingPrice: item.marketing_price, activityOptionsRates: item.option_rates }
        };
        this.activityPhotoFactory = function(item) {
            var linkLocal;
            var linkImg = null;
            if (item.code == null) {
                linkLocal = item.link.replace('watch?v=','embed/');
                linkImg = 'https://img.youtube.com/vi/'+item.link.substring((item.link.search('v=')+2))+'/maxresdefault.jpg';
            } else {
                linkLocal = item.link
            }
            return { code: item.code, link: linkLocal, default: item.default, linkVideo: linkImg}
        };
    },
    urlRoot : 'data/activities/', 
    url : function() {
        return this.urlRoot + this.code+'?imgWidthProvider=200&imgHeightProvider=200';
    },
    parse: function(response, options) {
        var me = this;

        me.set('widget', response.widget);
        me.set('available', response.available);
        me.set('providerActivities', response.provider_activities);
        me.set('relativePaths', response.relative_paths);
        me.set('similarActivities', response.similar_activities);
        me.set('ratingActivities',response.rating_activities.rating_activities_content);
        me.set('ratingAverange',response.rating_averange);
        me.set('totalElemento',response.rating_activities.total_elements);
        me.set('pageIndex', response.rating_activities.number);
        me.set('allowQuestion',response.allow_question);
        me.set('staticMap', response.activity.static_map);
        
        me.get('activity').set('code', response.activity.code);
        me.get('activity').set('title', response.activity.title);		
        me.get('activity').set('description', response.activity.description);
        me.get('activity').set('details', response.activity.details.replace(new RegExp('(\n)+', 'g'), '<br>'));
        me.get('activity').set('difficulty', response.activity.difficulty);
        me.get('activity').set('cancelationPolicy', response.activity.cancelation_policy);
        me.get('activity').set('confirmationType', response.activity.confirmation_type);
        me.get('activity').set('paymentPercentageOnline', response.activity.payment_percentage_online);
        me.get('activity').set('discount', response.activity.discount);
        me.get('activity').set('discountFromMonth', response.activity.discount_from_month);
        me.get('activity').set('discountToMonth', response.activity.discount_to_month);
        me.get('activity').set('marketingPrice', {
            currency: response.activity.marketing_price.currency,
            amount: response.activity.marketing_price.amount
        });
        me.get('activity').set('duration', response.activity.duration);
        me.get('activity').set('location', response.activity.location);
        me.get('activity').set('address', response.activity.address);
        me.get('activity').set('category', response.activity.category);
        me.get('activity').set('breadcrumbs', me.buildCategoryBreadcrumbs(response.activity.category));
        me.get('activity').set('organization', {
            code: response.activity.organization.code,
            name: response.activity.organization.name,
            description: response.activity.organization.description,
            image: response.activity.organization.image_link
        });
        me.get('checkoutBox').set('geoLatitude', response.activity.address.geo_latitude);
        me.get('checkoutBox').set('geoLongitude', response.activity.address.geo_longitude);
        me.get('checkoutBox').set('promocode', response.promo_code);
        me.get('checkoutBox').set('available', response.available);
        me.get('checkoutBox').set('externalLink', response.external_link);
        me.get('checkoutBox').set('activityCode', response.activity.code);
        me.get('checkoutBox').set('active', response.activity.active);
        me.get('checkoutBox').set('limitedQuota', response.activity.maximum_allowed_capacity);
        me.get('checkoutBox').set('marketingPrice', {
            currency: response.activity.marketing_price.currency,
            amount: response.activity.marketing_price.amount
        });

        _.each(response.activity.photos, function(item, index) {
            me.get('activity').get('photos').push(me.activityPhotoFactory(item));
        });
        _.each(response.activity.options, function(item, index) {
            me.get('activity').get('options').add(me.activityOptionFactory(item));
            me.get('checkoutBox').get('options').add(me.activityOptionFactory(item));
        });

        me.parseActivityOptionItem(response.activity.highlights, 'highlights');
        me.parseActivityOptionItem(response.activity.inclusions, 'inclusions');
        me.parseActivityOptionItem(response.activity.exclusions, 'exclusions');
        me.parseActivityOptionItem(response.activity.recommendations, 'recommendations');
        me.parseActivityOptionItem(response.activity.restrictions, 'restrictions');

        _.each(response.activity.options, function(rate) {
            
            me.get('checkoutBox').get('allRates').add({
                activityOptionCode: rate.code,
                code: rate.code,
                title: rate.title,
                details: rate.details,
                marketingPrice: rate.marketingPrice,
                activityOptionsRates: new  ActivityOptionRateCollection(
                    _.map(rate.option_rates, function(oneRate) {
                        return { 
                            ageFrom: oneRate.age_from,
                            ageTo: oneRate.age_to,
                            code: oneRate.code,
                            description: oneRate.description,
                            name: oneRate.name,
                            type: oneRate.type
                        };
                    })
                )
            });
        });

        _.each(response.activity_option_schedules, function(activityOptionSchedule) {
            me.get('checkoutBox').get('allAvailableSchedules').add({
                activityOptionCode: activityOptionSchedule.activity_option_code,
                schedules: new ScheduleCollection(
                        _.map(activityOptionSchedule.schedules, function(schedule) {
                            return {
                                fromDate: schedule.from_date,
                                toDate: schedule.to_date,
                                monday: schedule.monday,
                                tuesday: schedule.tuesday,
                                wednesday: schedule.wednesday,
                                thursday: schedule.thursday,
                                friday: schedule.friday,
                                saturday: schedule.saturday,
                                sunday: schedule.sunday,
                                times:  new TimeCollection(_.map(schedule.times, function(scheduleTime) {
                                    return { 
                                        hour: scheduleTime.hour, 
                                        minutes: scheduleTime.minute, 
                                        periodDay: scheduleTime.period_day 
                                    }
                                }))
                            };
                        })
                )
            });
        });

        return {
            activity: me.get('activity'),
            checkoutBox: me.get('checkoutBox')
        }
    },
    getURLs : function() {
        var urls = this.get("relativePaths")
        return {
            "es" : urls.SPANISH,
            "en" : urls.ENGLISH,
            "pt" : urls.PORTUGUESE
        }
    },
    buildCategoryBreadcrumbs: function(categoryDTO) {
        var breadcrumbs = [];
        var parentCategory = null;
        if (categoryDTO) {
            breadcrumbs.push({url : buildActivitiesListURL({category : categoryDTO.public_code}), name : categoryDTO.name});
            parentCategory = categoryDTO.parent;
            while (parentCategory != null) {
                breadcrumbs.push({url : buildActivitiesListURL({category : parentCategory.public_code}), name : parentCategory.name});
                parentCategory = parentCategory.parent;
            }
            breadcrumbs.reverse();
        }
        return breadcrumbs;
    },
    parseActivityOptionItem: function(values, attribute) {
        var me = this;
        _.each(values, function(item, index) {
            me.get('activity').get(attribute).add({
                code: item.code,
                description: item.description
            });
        });
    },
    anymoreQuestions: function() {
        return this.get('ratingActivities').length < this.get('totalElemento');
    },
    loadSoMore: function() {
        var me = this;
        if (this.anymoreQuestions()) {
            $.get("data/activities/rating?activity_code=" + me.get('activity').get('code'), {
                page_size: 2,
                page_index: me.get('pageIndex') + 1
              }).done(function(data) {
                if (data.errors && data.errors.length) {
                  me.trigger("ratingActivities:more:error", data.errors);
                } else {
                    _.each(data.rating_activities_content, function(item, index) {
                        me.get('ratingActivities').push(item);
                    });
                    me.set('pageIndex', data.number);
                    me.trigger("ratingActivities:more:success");
                }
              });
        }
    },
    sendQuestion : function(callback) {
        
        var me = this;
        var data = {
            activity_code: me.get('codeActivity'),
            customer_email: me.get('email'),
            text: me.get('texto')
        };
        $.ajax(
            {
                type: "POST",
                url: 'data/activities/question',
                data: JSON.stringify(data),
                dataType: 'json',
                cache: false,
                contentType: "application/json",
                before: function(xhr) {
                if (callback && 'beforeSend' in callback) callback.before(xhr);
                },
                success: function(model, response) {
                if(callback && 'success' in callback) callback.success();
                me.trigger("question:send:success");
                },
                error: function(jqXHR,textStatus,errorThrown) {
                if(callback && 'error' in callback) callback.error(jqXHR.responseJSON.errors[0].code, jqXHR.responseJSON.errors[0].message);
                }
            }
        );

    },
});
