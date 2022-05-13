var NotificationError = Notification.extend({
    initialize: function (options) {
        Notification.prototype.initialize.apply(this, arguments);
        this.title = "error";
        this.icon = "glyphicon-ban-circle";
    }
});