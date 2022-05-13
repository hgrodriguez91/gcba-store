var PageView = BaseView.extend({
    el: '#app',
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        this.user = new UserModel();
        this.options = options || {};
        this.mobileDetect = new MobileDetect(window.navigator.userAgent);
    },
    preRender: function () {
        this.header = new HeaderView({
            user : this.user,
            searchValue : this.options && this.options.s ? this.options.s : null
        });
        this.footer = new FooterView(this.options.footerOptions || {});
    },
    postRender: function () {
        var me = this;
        var changeWindowSize = function() {
            if (window.innerWidth < 768) {
                $('body').addClass('xs-size');
            } else {
                $('body').removeClass('xs-size');
            }
        };
        $(document).ready(function() {
            /*TODO remove this event and translate the xs-size class to a media query */
            $(window).resize(function() {
                changeWindowSize();
            });
            changeWindowSize();

            if (!me.isPhone()) {
                $('.select2-control').select2();
            }

            $('.file-inputs').bootstrapFileInput();
            $('.summernote-control').summernote();

            $(document).undelegate('*[data-toggle="lightbox"]', 'click', me._lightboxDelegate);
            $(document).delegate('*[data-toggle="lightbox"]', 'click', me._lightboxDelegate);

            $('.collapsable').each(function(){
                var $wdg = $(this),
                    $btn = $('.collapsable-button', $wdg);

                $btn.click(function(){
                    $wdg.toggleClass('collapsed');
                });
            });
        });
    },
    openAjaxSignIn : function (callback) {
        this.header.openAjaxSignIn(callback);
    },
    _getParameterByName : function (name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },
    isPhone : function() {
        return this.mobileDetect.phone() || (this.mobileDetect.mobile() && $(window).width() < 768);
    },
    _lightboxDelegate : function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    }
});