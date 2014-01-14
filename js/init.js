window._d_ = {
  Collections: {},
  Models: {}, 
  Views: {},
  getColor: function (d) {
    return d == 99  ? '#000000' :
           d >= 0.9 ? '#703f29' :
           d >= 0.8 ? '#955436' :
           d >= 0.7 ? '#b05e32' :
           d >= 0.6 ? '#d56c2a' :
           d >= 0.5 ? '#ea8435' :
           d >= 0.4 ? '#f89e5d' :
           d >= 0.3 ? '#fbb885' :
           d >= 0.2 ? '#fdd3b1' :
           d >= 0.1 ? '#fee6d3' :
           d  > 0.0 ? '#fff3ea' :
                      '#8b8682';
  },
  getValue: function (dataObj) {
    var yearObj;
    if (dataObj === undefined) {
      return 99;
    }
    else {
      yearObj = _.where(dataObj, {name: _d_.appVars.get('curYear')});
      if (yearObj[0] === undefined) {
        return 99;
      }
      else {
        return yearObj[0].children[0][_d_.appVars.get('curRelig')];
      }
    }
  },
  getPercent: function (dataObj) {
    var yearObj;
    if (dataObj === undefined) {
      return 'No Data';
    }
    else {
      yearObj = _.where(dataObj, {name: _d_.appVars.get('curYear')});
      if (yearObj[0] === undefined) {
        return 'No Data';
      }
      else {
        return d3.format(".2%")(yearObj[0].children[0][_d_.appVars.get('curRelig')]);
      }
    }
  },
  onEachFeature: function (feature, layer) {
    layer.on({
        contextmenu: _d_.mobileLongClick,
        mouseover: _d_.highlightFeature,
        mouseout: _d_.resetHighlight,
        click: _d_.selectState
    });
  },
  mobileLongClick: function (e) {
    var layer = e.target;
    _d_.mapView.mapInfo.update(layer.feature.properties);
  },
  highlightFeature: function (e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: 'grey',
        dashArray: '',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    _d_.mapView.mapInfo.update(layer.feature.properties);
  },
  resetHighlight: function (e) {
    _d_.mapView.geojson.resetStyle(e.target);
  },
  selectState: function (e) {
    var layer = e.target;
    _d_.chartVars.set('dataObj', layer.feature.properties.data)
    _d_.setChartData();
  },
  setChartData: function () {
    var dataObj = _d_.chartVars.get('dataObj'),
        yearMax = _.max(dataObj, function(d){ return d.children[0].year; })
        yearMin = _.min(dataObj, function(d){ return d.children[0].year; })
        dataArray = [], 
        dataSum = 0,
        series = [],
        seriesObj = {},
        seriesData = [],
        seriesElemData = {},
        seriesElem = {},
        religArray = ['chrstprot',
                      'chrstcat',
                      'chrstorth',
                      'chrstang',
                      'chrstothr',
                      'judorth',
                      'judcons',
                      'judref',
                      'islmsun',
                      'islmshi',
                      'islmibd',
                      'islmnat',
                      'islmalw',
                      'islmahm',
                      'islmothr',
                      'budmah',
                      'budthr',
                      'budothr',
                      'zorogen',
                      'hindgen',
                      'sikhgen',
                      'shntgen',
                      'bahgen',
                      'taogen',
                      'jaingen',
                      'confgen',
                      'syncgen',
                      'anmgen',
                      'nonrelig',
                      'othrgen']

    if (dataObj) {
      _.each(dataObj, function (element) {
        dataArray.push(element.children[0])
      });
      _.each(religArray, function (varName) {
        dataSum = _.reduce(_.pluck(dataArray, varName), function(memo, num){ return memo + num; }, 0);
        if (dataSum) {
          seriesData = [];
          _.each(dataArray, function (element) {
            seriesElemData = _.pick(element, 'epoch', varName);
            seriesElem = {x: seriesElemData['epoch'], y: seriesElemData[varName]}
            seriesData.push(seriesElem);
          });
          seriesObj = {name: _d_.getSeriesName(varName), data: seriesData, className: varName};
          series.push(seriesObj);
        }
      });
      _d_.chartVars.set({
        'stateName': dataObj[0].children[0].statename,
        'fipsCode': dataObj[0].children[0].fips,
        'yearMin': yearMin.children[0].year,
        'yearMax': yearMax.children[0].year,
        'series': series
      });
    }
  },
  getReligStr: function (varName) {
    var religObj = {
      chrstprotpct: 'Christianity - Protestant',
      chrstcatpct: 'Christianity - Catholic',
      chrstorthpct: 'Christianity - Eastern Orthodox',
      chrstangpct: 'Christianity - Anglican',
      chrstothrpct: 'Christianity - Other',
      chrstgenpct: 'Christianity',
      judorthpct: 'Judaism - Orthodx',
      judconspct: 'Judaism - Conservative',
      judrefpct: 'Judaism - Reform',
      judothrpct: 'Judasim - Other',
      judgenpct: 'Judaism',
      islmsunpct: 'Islam - Sunni',
      islmshipct: 'Islam - Shi’a',
      islmibdpct: 'Islam - Ibadhi',
      islmnatpct: 'Islam - Nation of Islam',
      islmalwpct: 'islam - Alawite',
      islmahmpct: 'Islam - Ahmadiyya',
      islmothrpct: 'Islam - Other',
      islmgenpct: 'Islam',
      budmahpct: 'Buddhism - Mahayana',
      budthrpct: 'Buddhism - Theravada',
      budothrpct: 'Buddhism - Other',
      budgenpct: 'Buddhism',
      zorogenpct: 'Zoroastrian',
      hindgenpct: 'Hinduism',
      sikhgenpct: 'Sikh',
      shntgenpct: 'Shinto',
      bahgenpct: 'Baha’i',
      taogenpct: 'Taoism',
      jaingenpct: 'Jain',
      confgenpct: 'Confucianism',
      syncgenpct: 'Syncretic Religions',
      anmgenpct: 'Animist',
      nonreligpct: 'Non-Religious',
      othrgenpct: 'Other'
    };
    return religObj[varName];
  },
  getSeriesName: function (varName) {
    var religObj = {
      chrstprot: 'Christianity - Protestant',
      chrstcat: 'Christianity - Catholic',
      chrstorth: 'Christianity - Eastern Orthodox',
      chrstang: 'Christianity - Anglican',
      chrstothr: 'Christianity - Other',
      chrstgen: 'Christianity',
      judorth: 'Judaism - Orthodx',
      judcons: 'Judaism - Conservative',
      judref: 'Judaism - Reform',
      judothr: 'Judasim - Other',
      judgen: 'Judaism',
      islmsun: 'Islam - Sunni',
      islmshi: 'Islam - Shi’a',
      islmibd: 'Islam - Ibadhi',
      islmnat: 'Islam - Nation of Islam',
      islmalw: 'islam - Alawite',
      islmahm: 'Islam - Ahmadiyya',
      islmothr: 'Islam - Other',
      islmgen: 'Islam',
      budmah: 'Buddhism - Mahayana',
      budthr: 'Buddhism - Theravada',
      budothr: 'Buddhism - Other',
      budgen: 'Buddhism',
      zorogen: 'Zoroastrian',
      hindgen: 'Hinduism',
      sikhgen: 'Sikh',
      shntgen: 'Shinto',
      bahgen: 'Baha’i',
      taogen: 'Taoism',
      jaingen: 'Jain',
      confgen: 'Confucianism',
      syncgen: 'Syncretic Religions',
      anmgen: 'Animist',
      nonrelig: 'Non-Religious',
      othrgen: 'Other'
    };
    return religObj[varName];
  }
};