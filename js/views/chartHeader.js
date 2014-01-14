_d_.Views.ChartHeader = Backbone.View.extend({
  template: Handlebars.compile($('#header-template').html()),
  render: function() {
    this.$el.html(this.template(_d_.chartVars.attributes));
    return this;
  }
});