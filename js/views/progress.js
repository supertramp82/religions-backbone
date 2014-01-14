_d_.Views.Progress = Backbone.View.extend({
  intialize: function () {
    this.increment();
  },
  render: function () {
    this.$el.html($('#progress-template').html());
    $('.progress-bar').progressbar();
  },
  increment: function () {
    var value = 50;
    var doUpdate = function() {
      if (value < 100) {
        value += 10;
        $('.progress-bar').attr('aria-valuetransitiongoal', value);
        $('.progress-bar').progressbar();
        setTimeout(doUpdate, 1000); 
      }
    };
    setTimeout(doUpdate, 1000);
  }
});