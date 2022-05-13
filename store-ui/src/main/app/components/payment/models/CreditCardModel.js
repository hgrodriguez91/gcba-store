var CreditCardModel = Backbone.Model.extend({
    defaults: {
        mercadoPagoPublicKey: null,
        identificationTypes: null,
        creditCardTypes: null,
        issuersIndexedByPaymentMethodId: null,
        issuers: null,
        years: null,
        token: null,
        cardHolderName: null,
        docType: null,
        docNumber: null,
        cardType: null,
        cardNumber: null,
        cardNumberMasked: null,
        cardExpirationMonth: null,
        cardExpirationYear: null,
        securityCode: null,
        creditCardType: null,
        creditCardIssuer: null
    },
    initialize: function(options) {
    	var me = this;
    	
        var currentYear = moment().format('YYYY');
        
        this.set('docType', this.get('identificationTypes')[0].id);
        this.set('cardExpirationMonth', moment().format('M'));
        this.set('cardExpirationYear', currentYear);
        
        var years = []
        for (i = 0; i < 16; i++) {
            years[i] = currentYear;
            currentYear++;
        }
        this.set('years', years);
        
        //observer for the selection of the creditcard type.
        this.on("change:creditCardType", function() {
        	var issuers = me.get('issuersIndexedByPaymentMethodId')[me.get('creditCardType')];
        	if(issuers != null && issuers.length > 0) {
        		me.set('creditCardIssuer', issuers[0].id);
        	} else {
        		me.set('creditCardIssuer', null);
        	}
        	me.set('issuers', issuers);
        });
        
        //select the first creditcard type as default.
        this.set('creditCardType', this.get('creditCardTypes')[0].id);
    },
    generateToken: function(form, callback, createPayment) {
        var me = this;
        
        //set the current mercadopago public key to generate the credit card token.
        Mercadopago.setPublishableKey(this.get('mercadoPagoPublicKey'));
        
        //first. we need to get the credit card type, after that we are going to 
        //create the credit card token that should be sent to the backend to process the payment.
        Mercadopago.getPaymentMethod({ 
        	"bin" : me.getCreditCardBin() 
        }, function(status, response) {
            me.processMercadoPagoPaymentMethodResponse(status, response, form, callback, createPayment);
        });
    },
    getCreditCardBin: function() {
        return this.get('cardNumber').replace(/[ .-]/g, '').slice(0, 6);
    },
    processMercadoPagoPaymentMethodResponse: function(status, response, form, callback, createPayment) {
        var me = this;
        if (status == 200 || status == 201) {
            //setting the card type into the current model.
            me.set('cardType', response[0].id); 
            //it's going to create the credit card token.
            Mercadopago.createToken(form, function(status, response) {
                me.processMercadoPagoCreateTokenResponse(status, response, callback, createPayment);
            });
        } else {
            callback.mercadoPagoError(status, response);
        }           
    },
    processMercadoPagoCreateTokenResponse: function(status, response, callback, createPayment) {
        var me = this;
        if(status == 200 || status == 201) {
            //setting the credit card token into the current model.
            me.set('token', response.id);
            me.set('cardNumberMasked', '********' + response.last_four_digits);
            //calling to the next function to create the payment in the backend.
            createPayment();
        } else {
            callback.mercadoPagoError(status, response);
        }
        
        //call to clear session of the mercadopago's client to avoid the error "011".
        Mercadopago.clearSession();
    }
});