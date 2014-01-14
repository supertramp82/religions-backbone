_d_.mapView = new _d_.Views.Map({ el: "#mapAnchor" });
_d_.religBtnView = new _d_.Views.ReligBtn({ el: "#religBtnAnchor" });
//**************************************************************************
//  MODELS
//**************************************************************************
//*************************************************
//  APPVARS
//*************************************************
_d_.Models.AppVars = Backbone.Model.extend({
  defaults:{
    curYear: 'year2010',
    curRelig: 'chrstgenpct',
    winWidth: 1200
  }
});

//*************************************************
//  Chart Vars
//*************************************************
_d_.Models.ChartVars = Backbone.Model.extend({
  defaults:{
    dataObj: {},
    series: {},
    stateName: '',
    fipsCode: '',
    maxYear: 2010,
    minYear: 1945,
    offset: 'zero'
  }
});

//**************************************************************************
//  COLLECTION
//**************************************************************************
//*************************************************
//  WRP
//*************************************************
_d_.Collections.WRP = Backbone.Collection.extend({
  url: 'data/religions.json',
  initialize: function () {
    this.on('reset', function () {
      $('.loading-bar').width(400)
      _d_.religBtnView.render();
      _d_.mapView.render();
      _d_.chartVars.set('dataObj', _d_.wrp.getData());
      _d_.setChartData();
    });
  },
  getData: function () {
    var data = this.toJSON();
    return data[232].properties.data
  }
});

var renderApp = _.after(2, displayViews);

function displayViews() {
  $('.loading-bar').width(500)
  setTimeout(function (){
    $('#progressAnchor').empty();
    $('#mapAnchor').fadeTo("slow", 1);
    $('#religBtnAnchor').fadeTo("slow", 1);
    $('#chart-container').fadeTo("slow", 1);
    $('#chart-header').fadeTo("slow", 1);
  }, 800);
}

$('.loading-bar').width(300)
_d_.testColl = new Backbone.Collection;
_d_.chartVars = new _d_.Models.ChartVars;
_d_.appVars = new _d_.Models.AppVars;
_d_.wrp = new _d_.Collections.WRP;
_d_.wrp.fetch({reset:true});
_d_.mapView.listenTo(_d_.appVars,'change:curYear', _d_.mapView.switchLayer);
_d_.mapView.listenTo(_d_.appVars,'change:curRelig', _d_.mapView.switchLayer);
_d_.chartVars.on('change:series', function () {
  _d_.testColl.reset();
  new _d_.Views.ChartContainer().render();
});

Handlebars.registerHelper('getNote', function(cntry) {
  var dualRelig = ['BM','CU','HA','JA','SL'];
  if (_.contains(dualRelig, cntry)) {
    return 'Note: Country reports dual religions.  Population figures inflated.';
  } else {
    return '';
  }
});

$(document).ready(function() {
  var delay;

  function resizedw(){
    _d_.appVars.set('winWidth', $(window).width());
  }

  $(window).resize(function(){
    clearTimeout(delay);
    delay = setTimeout(resizedw, 100);
  });
});



