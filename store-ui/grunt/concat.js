module.exports = {
        options : {
            separator : ';\n',
            banner : "(function(){\n",
            footer : "\n})();"
        },
        all : {
            files : {
                '<%= app.target %>/js/dependencies.js' : buildDependencies(),
                '<%= app.target %>/js/store/home.js': buildHome(),
                '<%= app.target %>/js/store/profile.js': buildProfile(),
                '<%= app.target %>/js/store/faq.js': buildFaq(),
                '<%= app.target %>/js/store/about-us.js': buildAboutUs(),
                '<%= app.target %>/js/store/how-it-works.js': buildHowItWorks(),
                '<%= app.target %>/js/store/how-to-publish.js': buildHowtoPublish(),
                '<%= app.target %>/js/store/terms-and-conditions.js': buildTermsAndConditions(),
                '<%= app.target %>/js/store/activities-list.js': buildActivitiesList(),
                '<%= app.target %>/js/store/activity-details.js': buildActivityDetails(),
                '<%= app.target %>/js/store/booking-payment.js': buildBookingPayment(),
                '<%= app.target %>/js/store/booking-details.js': buildBookingDetails(),
                '<%= app.target %>/js/store/cancel-booking.js': buildCancelBooking(),
                '<%= app.target %>/js/store/booking-review.js': buildBookingReview(),
                '<%= app.target %>/js/store/booking-review-details.js': buildBookingReviewDetails()
            }
        }
};

function buildDependencies() {
    return [
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/jquery-ui/jquery-ui.min.js',
            './bower_components/jquery-ui/ui/minified/i18n/datepicker-es.min.js',
            './bower_components/jqueryui-timepicker-addon/dist/jquery-ui-timepicker-addon.min.js',
            './bower_components/jqueryui-timepicker-addon/dist/i18n/jquery-ui-timepicker-es.js',
            './bower_components/select2/select2.min.js',
            './bower_components/bootstrap/dist/js/bootstrap.min.js',
            './bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
            './bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.es.js',
            './bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.pt.js',
            './bower_components/flexslider/jquery.flexslider-min.js',
            './bower_components/bootstrap-file-input/bootstrap.file-input.js',
            './bower_components/bootstrap-star-rating/js/star-rating.min.js',
            './bower_components/summernote/dist/summernote.min.js',
            './bower_components/ekko-lightbox/dist/ekko-lightbox.min.js',
            './bower_components/handlebars/handlebars.runtime.min.js',
            './bower_components/swag/lib/swag.min.js',
            './bower_components/underscore/underscore-min.js',
            './bower_components/backbone/backbone-min.js',
            './bower_components/moment/min/moment-with-locales.min.js',
            './bower_components/i18next/i18next.min.js',
            './bower_components/jquery.serializeJSON/jquery.serializejson.min.js',
            './bower_components/jssor-slider/js/jssor.slider.mini.js',
            './bower_components/mobile-detect/mobile-detect.min.js',
            './bower_components/dotdotdot/src/jquery.dotdotdot.min.js'];
};

//--- Modules

function buildHome() {
	return buildJSFile(['home/**/*.js']);
};

function buildFaq() {
    return buildJSFile(['faq/**/*.js']);
};

function buildAboutUs() {
    return buildJSFile(['about-us/**/*.js']);
};

function buildHowItWorks() {
    return buildJSFile(['how-it-works/**/*.js']);
};

function buildHowtoPublish() {
    return buildJSFile(['how-to-publish/**/*.js']);
};

function buildTermsAndConditions() {
    return buildJSFile(['terms-and-conditions/**/*.js']);
};

function buildProfile() {
    return buildJSFile(['payment/views/PersonalInformationView.js', 'payment/models/PersonalInformationModel.js', 'profile/**/*.js']);
};

function buildActivitiesList() {
	return buildJSFile(['listing/**/*.js']);
};

function buildActivityDetails() {
	return buildJSFile(['details/**/*.js']);
};

function buildBookingPayment() {
	return buildJSFile(['payment/**/*.js']);
};

function buildBookingDetails() {
	return buildJSFile(['booking/**/*.js']);
};

function buildCancelBooking() {
	return buildJSFile(['cancel/**/*.js']);
}

function buildBookingReview() {
    return buildJSFile(['review/**/*.js']);
}

function buildBookingReviewDetails() {
    return buildJSFile(['review/**/*.js']);
}

// --- base function to assemble js files.
function buildJSFile(files) {
    var commonJSFiles = [
                         '<%= app.bin %>/js/templates.js',
                         '<%= app.source %>/utils/**/*.js',
                         '<%= app.source %>/components/commons/**/*.js'];
    var sourceFiles = files.map(function (fileDir) {
        return '<%= app.source %>/components/' + fileDir;
    });
    return commonJSFiles.concat(sourceFiles);
};