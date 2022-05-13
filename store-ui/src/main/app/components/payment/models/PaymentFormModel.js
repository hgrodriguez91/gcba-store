var PaymentFormModel = Backbone.Model.extend({
    defaults: {
        operationCode: null,
        free: null,
        personalInfo: null,
        creditCard: null,
        paymentResponse: null
    },
    initialize: function(options) {
        //nothing...
    },
    url: function() {
        return "data/checkout/" + this.get('operationCode') + '/booking';
    },
    save: function(attrs, options) {
          // `options` is an optional argument but is always needed here
          options || (options = {});
        
          var me = this;
          
          var data = {
            customer: {
                email: me.get('personalInfo').get('email'),
                first_name: me.get('personalInfo').get('firstName'),
                last_name: me.get('personalInfo').get('lastName'),
                residence_code: me.get('personalInfo').getResidenceCode(),
                gender: me.get('personalInfo').get('gender'),
                identification_type: (!me.isFree()) ? me.get('creditCard').get('docType') : '',
                identification_number: (!me.isFree()) ? me.get('creditCard').get('docNumber') : ''
            },
            payment_method: {
                '@class' : 'com.zelzet.commons.data.dto.CreditCardDTO', 
                brand: (!me.isFree()) ? me.get('creditCard').get('cardType') : '',
                issuer_id: (!me.isFree()) ? me.get('creditCard').get('creditCardIssuer') : '',
                number: (!me.isFree()) ? me.get('creditCard').get('cardNumberMasked') : '',
                holder_name: (!me.isFree()) ? me.get('creditCard').get('cardHolderName') : '',
                expiry_month: (!me.isFree()) ? me.get('creditCard').get('cardExpirationMonth') : '',
                expiry_year: (!me.isFree()) ? me.get('creditCard').get('cardExpirationYear') : '',
                security_code: '000',
                token: (!me.isFree()) ? me.get('creditCard').get("token") : ''
            }
          };
          
          // If `options.data` is set, Backbone does not attempt to infer the content
          // type and leaves it null. Set it explicitly as `application/json`.
          options.contentType = "application/json";
          options.data = JSON.stringify(data);
        
          return Backbone.Model.prototype.save.call(this, attrs, options);
    },  
    parse: function(response, options) {
        var paymentResponse = new PaymentResponseModel().mapValues(response);
        return {
            paymentResponse: paymentResponse
        }
    },
    mapValues: function(response) {
        this.set('personalInfo', new PersonalInformationModel().mapValues(response));
        this.set('free', response.free);
        if(!this.isFree()) {
            this.set('creditCard', new CreditCardModel({ 
                mercadoPagoPublicKey: response.mercadopago_public_key,
                identificationTypes: response.identification_types,
                creditCardTypes: response.creditcard_types,
                issuersIndexedByPaymentMethodId: response.issuers
            }));
        }
        return this;
    },
    confirmBooking: function(form, callback) {
        var me = this;
        if(!this.isFree()) {
            this.get('creditCard').generateToken(form, callback, function() {
                me.doProcessPayment(callback);
            });
        } else {
            this.doProcessPayment(callback);
        }
    },
    doProcessPayment: function(callback) {
        this.save([], {
            success: function(model, response) {
                if(model.get('paymentResponse').get('status') == 'APPROVED') {
                	if(callback && 'approved' in callback) callback.approved(model, response);
                } else if(model.get('paymentResponse').get('status') == 'REJECTED') {
                	if(callback && 'rejected' in callback) callback.rejected(model, response);
                } else if(model.get('paymentResponse').get('status') == 'PAYMENT_IN_PROCESS') {
                	if(callback && 'paymentInProcess' in callback) callback.paymentInProcess(model, response);
                } else if(model.get('paymentResponse').get('status') == 'PENDING_CONFIRMATION') {
                	if(callback && 'pendingConfirmation' in callback) callback.pendingConfirmation(model, response);
                }
            },
            error: function(model, response) {
                if(response.status == 409) {
                    var error = response.responseJSON.errors[0];
                    callback.businessError(error.code, error.default_message);
                } else {
                    callback.error(model, response);
                }
            }
        });
    },
    isFree: function() {
        return (this.get('free') == true);
    }
});