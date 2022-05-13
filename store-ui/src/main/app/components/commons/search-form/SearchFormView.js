var SearchFormView = BaseView.extend({
    template: 'commons/search-form/search-form.hbs',
    focusOnLoad: true,
    events: {
        'submit' : 'validate',
        'keypress' : 'keypress'
    },
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        this.value = "";
        this.placeholder = "search-form.legend";
        if (options.value) this.value = Handlebars.helpers.decodeQueryString(options.value);
        if (options.placeholder === false) this.placeholder = "";
        if (options.placeholder) this.placeholder = options.placeholder;
        this.mobile = !!options.mobile;
    },
    contentRender: function () {
        var formURL = PagesURL.getURL("activities", i18n.lng());
        this.$el.html(app.templates[this.template]({value : this.value, formURL : formURL, placeholder : this.placeholder}));

        if(!this.mobile && this.focusOnLoad) {
            $("input", this.$el).focus();
        }
    },
    validate: function(e) {
        var valid = true;
        var errors = [];
        var searchInput = $("[name=s]", e.target);
        if (searchInput.val() && searchInput.val().length < 3) {
            searchInput.addClass("error");
            errors.push(Handlebars.helpers.t("search-form.errors.search-input.minlength"));
            valid = false;
        }
        if (searchInput.val() && searchInput.val().length > 80) {
            searchInput.addClass("error");
            errors.push(Handlebars.helpers.t("search-form.errors.search-input.maxlength"));
            valid = false;
        }
        if (!valid) {
            this.showErrors(errors);
        }

        return valid;
    },
    keypress: function(e) {
        $(e.target).removeClass("error");
        this.clearPopover();
    },
    clearPopover: function() {
        $(".search-form").popover("destroy");
    },
    showErrors: function(errors) {
        var form = $(".search-form");
        var me = this;
        var timeout = null;
        var _errors = [];
        typeof errors == 'string' ? _errors.push(Handlebars.helpers.t(errors)) : _errors = errors;
        form.popover({
            content: _errors.join("\\n"),
            trigger: "manual",
            placement: "auto top"
        }).on('show.bs.popover', function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = _.delay(me.clearPopover, 5000);
        }).on('hide.bs.popover', function () {
            if (timeout) {
                clearTimeout(timeout);
            }
        });
        form.popover('show');
    }
});