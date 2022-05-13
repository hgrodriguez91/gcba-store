var NotificationSuccess = Notification.extend({
    initialize: function (options) {
        Notification.prototype.initialize.apply(this, arguments);
        this.title = "success";
        this.icon = "glyphicon-ok-circle";
    }
});