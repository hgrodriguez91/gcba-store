var Notification = BaseView.extend({
    defaults : {
        title : null,
        icon : null,
        content : null
    },
    initialize: function (options) {
        BaseView.prototype.initialize.apply(this, arguments);
        this.content = options.content;
    },
    contentRender : function() {
        var el = $(app.templates['commons/notification/notification.hbs']({
            title : this.title,
            icon : this.icon,
            content : this.content
        }));
        renderModal(el);
    }
});