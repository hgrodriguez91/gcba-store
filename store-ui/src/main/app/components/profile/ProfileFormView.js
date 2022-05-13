var ProfileFormView = BaseView.extend({
    el: "#profile-form",
    events: {
        "click #submit-profile-form": "updateProfile",
    },
    initialize: function(options) {
        //nothing to do!
    },
    contentRender: function() {
        this.$el.html(app.templates['profile/profile-form.hbs']);

        this.personalInformationView = new PersonalInformationView({
            model: this.model.get('profile')
        }).render();

        this.submitButton = this.$("#submit-profile-form");

        this.$(".select2-control").select2();
    },
    updateProfile: function(event) {
        event.preventDefault();
        event.stopPropagation();

        var me = this;

        var valid = function () {
            var result = true;
            result &= me.personalInformationView.validate();
            return result;
        }

        if(!valid()) {
            return;
        }

        this.submitButton.addClass("disabled").prop("disabled", true);
        $("input", this.$el).addClass("disabled").prop("disabled", true);

        this.loadingModal = new LoadingModal({text : 'profile.processing'}).render();

        this.model.updateProfile({
            success : function() {
                $("input", me.$el).removeClass("disabled").prop("disabled", false);
                me.submitButton.removeClass("disabled").prop("disabled", false);
                new NotificationSuccess({content : 'profile.success'}).render();
                _.delay(closeModal, 7000);
            },
            error : function() {
                $("input", me.$el).removeClass("disabled").prop("disabled", false);
                me.submitButton.removeClass("disabled").prop("disabled", false);
                new NotificationError({content : 'profile.error'}).render();
                _.delay(closeModal, 7000);
            }
        });
    }
});