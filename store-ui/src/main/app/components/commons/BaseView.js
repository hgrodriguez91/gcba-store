var BaseView = Backbone.View.extend({
    initialize: function () {
        this.baseURL = "//" + location.host + $("base").attr("href");
        this.baseImageURL = $("#baseImageURL").attr("value");
    },
    render: function () {
        this.preRender();
        this.contentRender();
        this.postRender();
        return this;
    },
    preRender: function () {},
    contentRender: function () {},
    postRender: function () {}
});