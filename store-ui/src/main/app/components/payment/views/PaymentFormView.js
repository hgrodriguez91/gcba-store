var PaymentFormView = Backbone.View.extend({
    el: "#payment-form-container",
    events: {
        "click #submit-payment-form": "confirmBooking",
        "click #show-termsAndCondition": "showTermsAndConditions"
    },
    initialize: function(options) {
        //nothing to do!
    },
    render: function() {
        this.$el.html(app.templates['payment/payment-form.hbs'](this.model.toJSON()));
        
        this.personalInformationView = new PersonalInformationView({
            model: this.model.get('personalInfo')
        }).render();
        
        if(!this.model.isFree()) {
            this.creditCardInformationView = new CreditCardInformationView({
                model: this.model.get('creditCard')
            }).render();
        }
        
        this.acceptTermsAndConditions = this.$("input[name='accept']");
        this.submitButton = this.$("#submit-payment-form");
        this.paymentForm = this.$("#payment-form");
        
        this.$(".select2-control").select2();
        
        return this;
    },
    confirmBooking: function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        var me = this;

        $("#error-message-detail").remove();
        
        var validateAccept = function() {
            var isAccepted = me.acceptTermsAndConditions.is(":checked");
            if(!isAccepted) {
                me.acceptTermsAndConditions.parent().parent().parent().addClass("has-error");
            } else {
                me.acceptTermsAndConditions.parent().parent().parent().removeClass("has-error");
            }
            return isAccepted;
        }
        
        var valid = function () {
            var result = true;
            result &= me.personalInformationView.validate();
            if(me.creditCardInformationView) {
                result &= me.creditCardInformationView.validate();
            }
            result &= validateAccept();
            return result;
        }
        
        if(!valid()) {
            return;
        }
        
        this.submitButton.addClass("disabled").prop("disabled", true);

        this.loadingModal = new LoadingModal({text : 'payment.processing'}).render();

        this.model.confirmBooking(document.querySelector('#payment-form'), {
            approved: function(model, response) {
                //redirect to the next page of the checkout workflow.
                window.location.href = PagesURL.getURL('payment', i18n.lng()) + me.model.get('operationCode') + '/details';
            },
            paymentInProcess: function(model, response) {
                //redirect to the next page of the checkout workflow.
                window.location.href = PagesURL.getURL('payment', i18n.lng()) + me.model.get('operationCode') + '/details';
            },
            pendingConfirmation: function(model, response) {
                //redirect to the next page of the checkout workflow.
                window.location.href = PagesURL.getURL('payment', i18n.lng()) + me.model.get('operationCode') + '/details';
            },
            rejected: function(model, response) {
                killModal();
                me.submitButton.removeClass("disabled").prop("disabled", false);
                me.paymentForm.prepend(app.templates['payment/form-error-message.hbs']({ error : model.get('paymentResponse').get('error').code }));
                moveToFormError();
            },
            mercadoPagoError: function(status, response) {
                killModal();
                me.submitButton.removeClass("disabled").prop("disabled", false);
                $.each(response.cause, function(index, item) {
                    me.paymentForm.prepend(app.templates['payment/form-error-message.hbs']({ error : item.code }));
                });
                moveToFormError();
            },
            businessError: function(code, defaultMessage) {
                killModal();
                me.submitButton.removeClass("disabled").prop("disabled", false);
                me.paymentForm.prepend(app.templates['payment/form-error-message.hbs']({ error : code }));
                moveToFormError();
            },
            error: function(model, response) {
                killModal();
                me.submitButton.removeClass("disabled").prop("disabled", false);
                me.paymentForm.prepend(app.templates['payment/form-error-message.hbs']({ error : 'payment.unexpected.error' }));
                moveToFormError();
            }
        });
    },
    showTermsAndConditions: function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.termsAndConditionView = new TermsAndConditionView().render();
    }
});