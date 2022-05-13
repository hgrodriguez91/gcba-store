/**
 * This is the payment view page.
 */
var PaymentContainerView = PageView.extend({
    initialize: function () {
        PageView.prototype.initialize.apply(this, arguments);
        var me = this;
        
        //get the operation code from url. Always this page view should have an operation code.
        this.operationCode = getOperationCodeFromUrl();
        
        this.model = new PaymentModel({
            operationCode: this.operationCode
        });
        this.model.fetch({
            success: function (model, response) {
                this.paymentView = new PaymentView({
                    model: me.model
                }).render();
                me.footer.setLanguageSelectorURLs(model.getURLs());
                me.header.setLanguageSelectorURLs(model.getURLs());
                //close loading modal.
                me.closeModal();
            },
            error: function (model, response) {
                this.paymentView = new PaymentNotFoundView({
                    model: me.model
                }).render();
                
                //close loading modal.
                me.closeModal();
            }
        });
        
        me.render();
        this.loadingModal = new LoadingModal({text : 'payment.loading'}).render();
    },
    contentRender : function () {
        this.$el.html(app.templates['payment/container.hbs']());
    },
    closeModal: function() {
        killModal();
        this.loadingModal=null;
    }
});

i18nInit(function() {
    new PaymentContainerView({
        footerOptions : {
            cssClass : "booking-payment-footer"
        }
    });
});