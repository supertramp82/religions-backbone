_d_.Views.ReligBtn = Backbone.View.extend({
  events: {
    'click .relig-btn': 'filterRelig',
    'click .relig-btn-drop': 'filterRelig',
    'click .relig-drop-itm': 'filterRelig'
  },
  render: function () {
    this.$el.html($('#relig-btn-template').html());
  },
  filterRelig: function (e) {
    _d_.appVars.set('curRelig', $(e.target).attr('value'));
  }
});