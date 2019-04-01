var map = null;

var latLng = {lat: -0.892, lng: 106.924};
var today  = new Date();
var week   = new Date();

var xaxs   = [];
var xdata  = [];

var idProvinsi = "";
var namaLokasi = "";

var hotspot = null;
var spots = {};
var plot = null;
var test_day = '2019-01-09';

$(document).ready(function() {
  $('#date').html($.format.date(today, " (dd-MMMM-yyyy)"));
  $.ajax({
    type: 'GET',
    url: API.provinsi.childs.list.url,
    success:
    function (response) {
      response.data.sort(SortNama);
      $.each( response.data, function( key, value ) {
        if(key==0) $('#selectProvinsi').append(new Option(value.nama,value.id,true,true));
        else $('#selectProvinsi').append(new Option(value.nama,value.id));
      });

      $('#selectProvinsi').val(response.data[0].id).attr('selected',true);
      namaLokasi = response.data[0].nama;
      idProvinsi = response.data[0].id;

      $("#selectProvinsi").combobox({
        select: function (event, ui) {
          idProvinsi = ui.item.value;
          namaLokasi = ui.item.text;
          query();
        }
      });
      query();
    },
    dataType: 'json',
    async:true
  });
});

$("#tahun").change(function() {
  query();
});

function query() {
  $("#tahun option:selected").each(function() {
    year=$(this).text();
  });

  $('#judulProvinsi').html('Statistik Provinsi '+namaLokasi);

  $.ajax({
    type: 'GET',
    url: API.provinsi.childs.resume.url,
    data: { tahun: year, kode_provinsi: idProvinsi },
    success:
    function (response) {
      // $('#harian_patroli').html(": "+response.statistik_harian.kegiatan_patroli);
      $('#harian_bakar').html(": "+response.statistik_harian.kebakaran);
      $('#jml_daops').html(": "+response.statistik_tahunan.daops);
      $('#jml_bakar').html(": "+response.statistik_tahunan.kebakaran);
      spotMingguan();
      spotToday();
      patroliToday();
    },
    dataType: 'json',
    async:true
  });

  $.get("https://maps.googleapis.com/maps/api/geocode/json?language=ID&address="+namaLokasi+"&key="+APIKey, function(data){
      latLng = data.results[0].geometry.location;
  });

}

function spotMingguan() {
  $.ajax({
    type: 'GET',
    url: API.sipongi.url,
    data:{
      end_date: $.format.date(today, "yyyy-MM-dd"),
      start_date: $.format.date(week.setDate(today.getDate()-6), "yyyy-MM-dd"),
      provinsi: namaLokasi
    },
    success:
    function (response) {
      spots.mingguan = null;
      if(response.hostspot_sipongi.length!=0)
         spots.mingguan = response.hostspot_sipongi;
      drawChart();
    },
    dataType: 'json',
    async:true
  });
}

function spotToday() {
  $.ajax({
    type: 'GET',
    url: API.sipongi.url,
    data:{
      end_date: $.format.date(today, "yyyy-MM-dd"),
      start_date: $.format.date(today, "yyyy-MM-dd"),
      provinsi: namaLokasi
    },
    success:
    function (response) {
      spots.today = [];
      if(response.hostspot_sipongi.length!=0)
         spots.today = response.hostspot_sipongi;

      $('#harian_hotspot').html(": "+spots.today.length);
    },
    dataType: 'json',
    async:true
  });
}

function patroliToday() {
  $.ajax({
    type: 'GET',
    url: API.patroli.childs.list.url,
    // data: { tanggal_patroli: test_day },
    data: { tanggal_patroli: $.format.date(today, "yyyy-MM-dd") },
    success:
    function (response) {
      $('#harian_patroli').html(": 0");
      $('#harian_udara').html(": 0");

      spots.patroliToday = {};
      spots.patroliToday.darat = [];
      spots.patroliToday.udara = [];
      $.each(response.data, function(key, value) {
          if(value.patroli_darat.length>0 && value.patroli_darat[0].desa_kelurahan.kecamatan.kotakab.daops.provinsi.id==idProvinsi)
          { spots.patroliToday.darat.push(value.patroli_darat);
            $('#harian_patroli').html(": "+spots.patroliToday.darat.length);
          }
          if(value.patroli_udara.length>0 && value.patroli_udara[0].desa_kelurahan.kecamatan.kotakab.daops.provinsi.id==idProvinsi)
          { spots.patroliToday.udara.push(value.patroli_udara);
            $('#harian_udara').html(": "+spots.patroliToday.udara.length);
          }
        });
        initMap();
    },
    dataType: 'json',
    async:true
  });
}



function drawChart() {
  week.setDate(today.getDate()+1);
  for(var i=0; i<=6 ; i++){
    var temp = week.setDate(week.getDate()-1);
    xaxs[6-i] = $.format.date(temp, "dd-MMM");
    xdata[6-i] = 0;
    $.each(spots.mingguan, function(key0, value0) {
      if(value0.tanggal==$.format.date(temp, "yyyy-MM-dd"))
      { $.each(value0.sebaran_hotspot, function(key, value) {
          if(value.provinsi.toLowerCase()==namaLokasi.toLowerCase()) xdata[6-i]++;
        });
      }
    });
  }

  plot = $.plot($("#chart1"),
    [ [[0,xdata[0]],[1,xdata[1]],[2,xdata[2]],[3,xdata[3]],[4,xdata[4]],[5,xdata[5]],[6,xdata[6]]] ],
    { yaxis: {
        max: Math.max.apply(Math,xdata)+2,
        minTickSize: 1,
        tickDecimals: 0
      },
      xaxis: {
        minTickSize: 1,
        tickDecimals: 0,
        ticks: [[0,xaxs[0]],[1,xaxs[1]],[2,xaxs[2]],[3,xaxs[3]],[4,xaxs[4]],[5,xaxs[5]],[6,xaxs[6]]]
      },
      series: {
        color: "#FF0000",
        lines: {
          show: true,
          lineWidth: 4
        },
        points: {
          show: true
        }
      },
    });
}

function initMap() {
  map = new google.maps.Map(document.getElementById('mainMaps'), {
    center: latLng,
    mapTypeId:"hybrid",
    zoom: 8
  });

  var marker = new Array();

  if (spots != null){
    $.each(spots.today, function( key0, value0 ) {
      $.each(value0.sebaran_hotspot, function( key, value ) {
        marker[value.id] = new google.maps.Marker({
          position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });
        marker[value.id].setMap(map);
      });
    });

    $.each(spots.patroliToday.darat, function( key0, value0 ) {
      $.each(value0, function( key, value ) {
        marker[value.id] = new google.maps.Marker({
          position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });
        marker[value.id].setMap(map);
      });
    });

    $.each(spots.patroliToday.udara, function( key0, value0 ) {
      $.each(value0, function( key, value ) {
        marker[value.id] = new google.maps.Marker({
          position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        marker[value.id].setMap(map);
      });
    });

  }
}

$.widget( "custom.combobox", {
  _create: function() {
    this.wrapper = $( "<span>" )
      .addClass( "custom-combobox" )
      .insertAfter( this.element );

    this.element.hide();
    this._createAutocomplete();
    this._createShowAllButton();
  },

  _createAutocomplete: function() {
    var selected = this.element.children( ":selected" ),
      value = selected.val() ? selected.text() : $("#combobox option:selected").text();

    this.input = $( "<input>" )
      .appendTo( this.wrapper )
      .val( value )
      .attr( "title", "" )
      .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
      .autocomplete({
        delay: 0,
        minLength: 0,
        source: $.proxy( this, "_source" )
      })
      .tooltip({
        classes: {
          "ui-tooltip": "ui-state-highlight"
        }
      });

    this._on( this.input, {
      autocompleteselect: function( event, ui ) {
        ui.item.option.selected = true;
        this._trigger( "select", event, {
          item: ui.item.option
        });
      },

      autocompletechange: "_removeIfInvalid"
    });
  },

  _createShowAllButton: function() {
    var input = this.input,
      wasOpen = false;

    $( "<a>" )
      .attr( "tabIndex", -1 )
      .attr( "title", "Show All Items" )
      .tooltip()
      .appendTo( this.wrapper )
      .button({
        icons: {
          primary: "ui-icon-triangle-1-s"
        },
        text: false
      })
      .removeClass( "ui-corner-all" )
      .addClass( "custom-combobox-toggle ui-corner-right" )
      .on( "mousedown", function() {
        wasOpen = input.autocomplete( "widget" ).is( ":visible" );
      })
      .on( "click", function() {
        input.trigger( "focus" );

        // Close if already visible
        if ( wasOpen ) {
          return;
        }

        // Pass empty string as value to search for, displaying all results
        input.autocomplete( "search", "" );
      });
  },

  _source: function( request, response ) {
    var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
    response( this.element.children( "option" ).map(function() {
      var text = $( this ).text();
      if ( this.value && ( !request.term || matcher.test(text) ) )
        return {
          label: text,
          value: text,
          option: this
        };
    }).slice(0,8) );
  },

  _removeIfInvalid: function( event, ui ) {

    // Selected an item, nothing to do
    if ( ui.item ) {
      return;
    }

    // Search for a match (case-insensitive)
    var value = this.input.val(),
      valueLowerCase = value.toLowerCase(),
      valid = false;
    this.element.children( "option" ).each(function() {
      if ( $( this ).text().toLowerCase() === valueLowerCase ) {
        this.selected = valid = true;
        return false;
      }
    });

    // Found a match, nothing to do
    if ( valid ) {
      return;
    }

    // Remove invalid value
    this.input
      .val( "" )
      .attr( "title", value + " tidak ditemukan di provinsi manapun" )
      .tooltip( "open" );
    this.element.val( "" );
    this._delay(function() {
      this.input.tooltip( "close" ).attr( "title", "" );
    }, 2500 );
    this.input.autocomplete( "instance" ).term = "";
  },

  _destroy: function() {
    this.wrapper.remove();
    this.element.show();
  }
});

function SortNama(a, b){
  var aNama = a.nama.toLowerCase();
  var bNama = b.nama.toLowerCase();
  return ((aNama < bNama) ? -1 : ((aNama > bNama) ? 1 : 0));
}
