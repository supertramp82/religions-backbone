_d_.Views.Map = Backbone.View.extend({
  events: {
    'click .year-group': 'filterYear'
  },
  filterYear: function (e) {
    $(".year-group").removeClass('selected');
    $(e.target).addClass('selected');
    _d_.appVars.set('curYear', $(e.target).attr('id'));
  },
  template: _.template($('#map-template').html()),
  render: function () {

    this.$el.html(this.template());

    this.map = L.map(this.$('#mapContainer')[0], {
        center: [33, 0],
        zoom: 2
    });

    L.tileLayer('http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png', {
      attribution: '&copy; 2013 OpenStreetMap &copy; 2013 CloudMade',
      key: '201db536dac5474c9eed000778739c8e',
      styleId: 113049
    }).addTo(this.map);

    this.mapInfo = L.control();

    this.mapInfo.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'infoBox');
        this.update();
        return this._div;
    };

    this.mapInfo.update = function (props) {
        this._div.innerHTML = '<h5>World Religion Project (WRP)</h5>' +
            '<h5>' + _d_.getReligStr(_d_.appVars.get('curRelig')) + ' - ' + _d_.appVars.get('curYear').substring(4) + '</h5>' +
            (props ? '<b>' + props.CntryName + '</b> (' + props.FipsCntry + ') - ' + _d_.getPercent(props.data)
            : 'Hover over a country');
    };

    this.mapInfo.addTo(this.map);

    this.legend = L.control({position: 'bottomright'});

    this.legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend')

      div.innerHTML = $('#map-legend-template').html();
      return div;
    };
    this.legend.addTo(this.map);

    this.addLayer();
    setTimeout(this.attached, 0);
  },
  attached: function () {
    renderApp();
  },
  addLayer: function () {
    this.geojson = L.geoJson(_d_.wrp.toJSON(), {style: this.style, onEachFeature: _d_.onEachFeature}).addTo(this.map);
  },
  switchLayer: function () {
    that = this;
    this.geojson.eachLayer(function (layer) {
      var id = layer._leaflet_id;
      that.map._layers[id].setStyle({fillColor: _d_.getColor(_d_.getValue(layer.feature.properties.data))});
    });
    this.mapInfo.update();
  },
  style: function (feature) {
    return {
        fillColor: _d_.getColor(_d_.getValue(feature.properties.data)),
        weight: 1,
        opacity: 1,
        color: 'lightgrey',
        dashArray: '3',
        fillOpacity: 1
    };
  }
});