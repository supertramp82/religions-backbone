_d_.Views.Chart = Backbone.View.extend({
  events: {
    'click .offset-group': 'setOffset'
  },
  render: function () {
    this.graph = new Rickshaw.Graph({
      element: document.querySelector("#multi-chart"),
      width: this.getChartWidth(),
      height: 500,
      renderer: 'area',
      offset: _d_.chartVars.get('offset'),
      series: _d_.chartVars.get('series')
    });

    this.x_axis = new Rickshaw.Graph.Axis.Time( { graph: this.graph } );

    this.y_axis = new Rickshaw.Graph.Axis.Y( {
      graph: this.graph,
      orientation: 'left',
      tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
      element: document.getElementById('chart-y-axis')
    });

    this.legend = new Rickshaw.Graph.Legend( {
      element: document.querySelector('#chart-legend'),
      graph: this.graph
    });

    if (_d_.chartVars.get('offset') !== 'expand') {
      this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: this.graph,
        legend: this.legend
      });
    }

    this.hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: this.graph,
      xFormatter: function(x) {
        var date = new Date(x * 1000),
            year = date.getFullYear();
        return year;
      },
      yFormatter: function(y) {
        if (_d_.chartVars.get('offset') === 'expand') {
          return d3.format(".2%")(y);
        } else {
          return d3.format(",")(Math.floor(y));
        }
      }
    });

    this.graph.render();
    this.changeClass();
    this.listenTo(_d_.appVars, 'change:winWidth', this.resizeChart)
    setTimeout(this.attached, 0);
  },
  attached: function () {
    renderApp();
  },
  changeClass: function () {
    $(".offset-group").removeClass('selected');
    $('#' + _d_.chartVars.get('offset')).addClass('selected');
  },
  getChartWidth: function () {
    var curWinWidth = $(window).width(); 
    return curWinWidth >= 1200 ? 848 :
           curWinWidth >=  992 ? 648 :
           curWinWidth >=  768 ? 438 :
           curWinWidth >=  725 ? 393 :
           curWinWidth >=  650 ? 308 :
           curWinWidth >=  600 ? 263 : 197;
  },
  resizeChart: function () {
    this.graph.configure({width: this.getChartWidth()});
    this.graph.render();
  },
  setOffset: function (e) {
    _d_.chartVars.set('offset', $(e.currentTarget).attr('id'));
    _d_.setChartData();
  }
});