var map=null;
var spots=null;
var selected=0;
var date_sel=0;

var today = new Date();
    today = $.format.date(new Date(), "yyyy-MM-dd");
var today_text = $.format.date(new Date(), "dd-MMMM-yyyy");

var datepicker;
var marker = new Array();
var infowindow = new Array();
var activeWindow;

$(document).ready(function() {
  loadPatrol(today);

  datepicker = $('#datepicker').datepicker({
    uiLibrary: 'bootstrap4',
    iconsLibrary: 'fontawesome',
    size: 'small',
    format: 'dd-mmmm-yyyy',
    value: today_text,
    maxDate: function() {
      return new Date();
    },
    modal: false,
    close: function (e) {
      if(date_sel!=$.format.date(new Date(datepicker.value()), "yyyy-MM-dd"))
      { date_sel=$.format.date(new Date(datepicker.value()), "yyyy-MM-dd");
        loadPatrol(date_sel);
      }
    }
  });
});

function loadPatrol(day) {
  $.ajax({
    type: 'GET',
    url: API.patroli.childs.list.url,
    data: { tanggal_patroli: day },
    success:
    function (response) {
      spots = response.data;
      initMap();
    },
    dataType: 'json',
    async:true
  });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('mainMaps'), {
    center: {lat: -1.5, lng: 117.384},
    mapTypeId:"hybrid",
    zoom: 5
  });

  if (spots.length != null){
    $.each(spots, function( key0, value0 ) {
      $.each(value0.lokasi_patroli, function( key1, value1 ) {
      if (value1.patroli_darat!= null){
          marker[value1.id] = new google.maps.Marker({
            position: { lat: parseInt(value1.latitude), lng: parseInt(value1.longitude) },
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          });
          // console.log(value);
          if(value1.kondisi_karhutla==null) value1.kondisi_karhutla={nama:"Tidak Dituliskan"};
          infowindow[value1.id] = new google.maps.InfoWindow({
            content:
              '<table class="text-left">'+
              '<tr>'+
                  '<td colspan=3 class="text-center font-weight-bold">Ringkasan Patroli Darat</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Provinsi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kota/Kab</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.kotakab.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kecamatan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Desa Kelurahan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Daerah Operasi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.kotakab.daops.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kondisi Pantauan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td class="font-weight-bold">'+value1.kondisi_karhutla.nama+'</td>'+
              '</tr>'+
              '</table>'
           });
          marker[value1.id].addListener('click', function() {
            if (activeWindow!=null) activeWindow.close(map);
            infowindow[value1.id].open(map, marker[value1.id]);
            activeWindow=infowindow[key];
          });
          marker[value1.id].setMap(map);
      }

      if (value1.patroli_udara != null){
          marker[value1.id] = new google.maps.Marker({
            position: { lat: parseInt(value1.latitude), lng: parseInt(value1.longitude) },
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          });

          if(value1.kondisi_karhutla==null) value1.kondisi_karhutla={nama:"Tidak Dituliskan"};
          infowindow[value1.id] = new google.maps.InfoWindow({
            content:
              '<table class="text-left">'+
              '<tr>'+
                  '<td colspan=3 class="text-center font-weight-bold">Ringkasan Patroli Udara</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Provinsi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kota/Kab</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.kotakab.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kecamatan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Desa Kelurahan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Daerah Operasi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.desa_kelurahan.kecamatan.kotakab.daops.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Radius Operasi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.radial+' Km</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Suhu/Kelembaban</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value1.suhu+' &#8451; / '+value1.kelembaban+'%</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kondisi Pantauan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td class="font-weight-bold">'+value1.kondisi_karhutla.nama+'</td>'+
              '</tr>'+
              '</table>'
           });
          marker[value1.id].addListener('click', function() {
            if (activeWindow!=null) activeWindow.close(map);
            infowindow[value1.id].open(map, marker[value1.id]);
            activeWindow=infowindow[key];
          });
          marker[value1.id].setMap(map);
      }

        });
    });
  }
}
  // if (spots.length>0){
  //   $.each(spots, function( key0, value0 ) {
  //     if (value0.patroli_darat.length>0){
  //       $.each(value0.patroli_darat, function( key, value ) {
  //         marker[value.id] = new google.maps.Marker({
  //           position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
  //           icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
  //         });
  //         // console.log(value);
  //         if(value.kondisi_karhutla==null) value.kondisi_karhutla={nama:"Tidak Dituliskan"};
  //         infowindow[value.id] = new google.maps.InfoWindow({
  //           content:
  //             '<table class="text-left">'+
  //             '<tr>'+
  //                 '<td colspan=3 class="text-center font-weight-bold">Ringkasan Patroli</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Provinsi</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Kota/Kab</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.kotakab.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Kecamatan</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Desa Kelurahan</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Daerah Operasi</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Kondisi Pantauan</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td class="font-weight-bold">'+value.kondisi_karhutla.nama+'</td>'+
  //             '</tr>'+
  //             '</table>'
  //          });
  //         marker[value.id].addListener('click', function() {
  //           if (activeWindow!=null) activeWindow.close(map);
  //           infowindow[value.id].open(map, marker[value.id]);
  //           activeWindow=infowindow[key];
  //         });
  //         marker[value.id].setMap(map);
  //       });
  //     }

  //     if (value0.patroli_udara.length>0){
  //       $.each(value0.patroli_udara, function( key, value ) {
  //         // console.log(value);
  //         marker[value.id] = new google.maps.Marker({
  //           position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
  //           icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  //         });

  //         if(value.kondisi_karhutla==null) value.kondisi_karhutla={nama:"Tidak Dituliskan"};
  //         infowindow[value.id] = new google.maps.InfoWindow({
  //           content:
  //             '<table class="text-left">'+
  //             '<tr>'+
  //                 '<td colspan=3 class="text-center font-weight-bold">Ringkasan Patroli Udara</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Provinsi</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Kota/Kab</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.kotakab.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Kecamatan</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Desa Kelurahan</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Daerah Operasi</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.nama+'</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Radius Operasi</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.radial+' Km</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Suhu/Kelembaban</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td>'+value.suhu+' &#8451; / '+value.kelembaban+'%</td>'+
  //             '</tr>'+
  //             '<tr>'+
  //               '<td>Kondisi Pantauan</td>'+
  //               '<td>&nbsp; : &nbsp;</td>'+
  //               '<td class="font-weight-bold">'+value.kondisi_karhutla.nama+'</td>'+
  //             '</tr>'+
  //             '</table>'
  //          });
  //         marker[value.id].addListener('click', function() {
  //           if (activeWindow!=null) activeWindow.close(map);
  //           infowindow[value.id].open(map, marker[value.id]);
  //           activeWindow=infowindow[key];
  //         });
  //         marker[value.id].setMap(map);
  //       });
  //     }
