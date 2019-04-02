var spots=null;
var map=null;
var selected=0;

var today = $.format.date(new Date(), "yyyy-MM-dd");
var week  = new Date();
    week  = $.format.date(week.setDate(week.getDate()-6), "yyyy-MM-dd");
var month = new Date();
    month = $.format.date(month.setDate(month.getDate()-29), "yyyy-MM-dd");
var tmnth = new Date();
    tmnth = $.format.date(tmnth.setDate(31), "yyyy-MM-dd");
var smnth = new Date();
    smnth = $.format.date(smnth.setDate(1), "yyyy-MM-dd");

var sebaran = $("#sebaran").DataTable({
  "responsive": {details: false},
  "order": [[ 0, "desc" ]],
  "aLengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]]
});

$(document).ready(function() {
  loadHotspot(today,today);
  $('#r4').html('Bulan '+$.format.date(new Date(), "MMMM yyyy"));
  $('#btn-ringkasan').prop('disabled',true);
});

function loadHotspot(start,end) {
  spots=null;

  $.ajax({
    type: 'GET',
    url: API.sipongi.url,
    data:{
      start_date: start,
      end_date: end,
      provinsi: "a"
    },
    success:
    function (response) {
      if(response.hostspot_sipongi.length !=null )
         spots = response.hostspot_sipongi;

      initMap();
    },
    dataType: 'json',
    async:true
  });
}

$("#range").change(function() {
  $("#range option:selected").each(function() {
    if(selected==0 || selected==$(this).val())
    { selected=$(this).val();
    }
    else
    { selected=$(this).val();
      sebaran.clear();
      $('#detailModalLabel').html("Ringkasan Sebaran Hotspot "+$(this).text());
      switch (selected)
      { case "1": loadHotspot(today,today);
                  $('#btn-ringkasan').prop('disabled',true);
                  break;
        case "2": loadHotspot(week,today);
                  $('#btn-ringkasan').prop('disabled',false);
                  break;
        case "3": loadHotspot(month,today);
                  $('#btn-ringkasan').prop('disabled',false);
                  break;
        case "4": loadHotspot(smnth,tmnth);
                  $('#btn-ringkasan').prop('disabled',false);
                  break;
      }
    }
  });
}).trigger( "change" );

function initMap() {
  map = new google.maps.Map(document.getElementById('mainMaps'), {
    center: {lat: -1.5, lng: 117.384},
    mapTypeId:"hybrid",
    zoom: 5
  });

  var marker = new Array();
  var infowindow = new Array();
  var activeWindow;

  var jumlah=0,banyak=[0,0],dikit=[999,0],provinsi = [];

  if (spots != null){
    $.each(spots, function( key0, value0 ) {
      var temp = [];

      if(value0.sebaran_hotspot.length>banyak[0])
      { banyak[0]=value0.sebaran_hotspot.length;
        banyak[1]=value0.tanggal;
      }
      if(value0.sebaran_hotspot.length<=dikit[0])
      { dikit[0]=value0.sebaran_hotspot.length;
        dikit[1]=value0.tanggal;
      }

      $.each(value0.sebaran_hotspot, function( key, value ) {
        jumlah++;

        if(temp.indexOf(value.provinsi) === -1)
           temp.push(value.provinsi);

         marker[value.id] = new google.maps.Marker({
          position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) }
        });
        infowindow[value.id] = new google.maps.InfoWindow({
           content:value.html
         });
        marker[value.id].addListener('click', function() {
          if (activeWindow!=null) activeWindow.close(map);
          infowindow[value.id].open(map, marker[value.id]);
          activeWindow=infowindow[value.id];
        });
        marker[value.id].setMap(map);
      });

      var str = "";
      $.each(temp, function(key, value) {
        str=str+value;
        if(value!=temp[temp.length-1]) str=str+", ";
      });

      sebaran.row.add( [
              value0.tanggal,
              '<center>'+value0.sebaran_hotspot.length+'</center>',
              str
          ] ).draw( false );
    });
  }

  $('#jumlah-hotspot').html(jumlah+" Titik");
  $('#banyak-hotspot').html(banyak[0]+" Titik pada Tanggal "+banyak[1]);
  $('#dikit-hotspot').html(dikit[0]+" Titik pada Tanggal "+dikit[1]);
}
