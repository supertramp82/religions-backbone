_d_.Views.ChartContainer = Backbone.View.extend({
  id: 'chart-anchor',
  tagName: 'div',
  className: 'col-md-12',
  render: function() {
    $(this.el).html($('#chart-template').html());
    $('#chart-container').append(this.$el);
    this.listenTo(_d_.testColl, 'reset', this.remove)
    this.renderChart();
    return this;
  },
  renderChart: function(model) {
    var chart = new _d_.Views.Chart({el: '#chart-anchor'});
    chart.render();

    var chartHeader = new _d_.Views.ChartHeader({el: '#chart-header'});
    chartHeader.render();
  }
});