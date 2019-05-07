var datepicker;
var latLng = {lat: -0.892, lng: 106.924};

var today = $.format.date(new Date(), "yyyy-MM-dd");
var data;
var tblDownload =$("#listFile").DataTable();
var tblRekap    =$("#listProvinsi").DataTable();
var idDaops  = [];
var nmDaops  = [];
var provinsi = [];

var idProv   = [];
var nmProv   = [];
var spots    = {};

$(document).ready(function() {
  loadFiles();

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
        today=date_sel;
        console.log(today);
        loadFiles();
      }
    }
  });

});

function loadFiles() {
  idDaops  = [];
  nmDaops  = [];
  idProv   = [];
  provinsi = [];
  tblDownload.clear().draw();
  tblRekap.clear().draw();

  $.ajax({
    type: 'GET',
    url: urls.patroli.list,
    data: { tanggal_patroli: today  },
    success:
    function (response) {
      data = null;
      data = response.data;
      console.log(data);
      // alert(data);
    },
    dataType: 'json',
    async:false
  });

  // $.each(data, function( key0, value0 ) {
  //   if (value0.patroli_darat.length>0){
  //     $.each(value0.patroli_darat, function( key, value ) {
  //       if(idDaops.indexOf(value.desa_kelurahan.kecamatan.kotakab.daops.id) === -1)
  //       { idDaops.push(value.desa_kelurahan.kecamatan.kotakab.daops.id);
  //         nmDaops.push(value.desa_kelurahan.kecamatan.kotakab.daops.nama);
  //         provinsi.push(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama);
  //       }

  //       if(idProv.indexOf(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.id) === -1)
  //       { idProv.push(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.id);
  //         nmProv.push(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama);
  //       }
  //     });
  //   }

    // if (value0.patroli_udara.length>0){
    //   $.each(value0.patroli_udara, function( key, value ) {
    //     if(idDaops.indexOf(value.desa_kelurahan.kecamatan.kotakab.daops.id) === -1)
    //     {  idDaops.push(value.desa_kelurahan.kecamatan.kotakab.daops.id);
    //        nmDaops.push(value.desa_kelurahan.kecamatan.kotakab.daops.nama);
    //        provinsi.push(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama);
    //     }

    //     if(idProv.indexOf(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.id) === -1)
    //     { idProv.push(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.id);
    //       nmProv.push(value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama);
    //     }
    //   });
    // }

  // });
   $.each(data, function( key0, value0 ) {
     $.each(value0.lokasi_patroli, function( key1, value1 ) { 
         if (value1.patroli_darat !=null){
            if(idDaops.indexOf(value1.desa_kelurahan.kecamatan.kotakab.id) === -1)
            { idDaops.push(value1.desa_kelurahan.kecamatan.kotakab.id);
              nmDaops.push(value1.desa_kelurahan.kecamatan.kotakab.nama);
              provinsi.push(value1.desa_kelurahan.kecamatan.kotakab.provinsi.nama);
            }

            if(idProv.indexOf(value1.desa_kelurahan.kecamatan.kotakab.provinsi.id) === -1)
            { idProv.push(value1.desa_kelurahan.kecamatan.kotakab.provinsi.id);
              nmProv.push(value1.desa_kelurahan.kecamatan.kotakab.provinsi.nama);
            }
    }
  // });
     // $.each(value0.lokasi_patroli, function( key1, value1 ) { 
        if (value1.patroli_udara != null ){
            if(idDaops.indexOf(value1.desa_kelurahan.kecamatan.kotakab.id) === -1)
            {  idDaops.push(value1.desa_kelurahan.kecamatan.kotakab.id);
               nmDaops.push(value1.desa_kelurahan.kecamatan.kotakab.nama);
               provinsi.push(value1.desa_kelurahan.kecamatan.kotakab.provinsi.nama);
            }

            if(idProv.indexOf(value1.desa_kelurahan.kecamatan.kotakab.provinsi.id) === -1)
            { idProv.push(value1.desa_kelurahan.kecamatan.kotakab.provinsi.id);
              nmProv.push(value1.desa_kelurahan.kecamatan.kotakab.provinsi.nama);
            }
    }

       });
  });

  for (var i = 1; i <= 5; i++) {
    $("#card"+(i)).html(
        '<div class="card-header">'+
        '<i class="fa fa-fw fa-file-pdf fa-5x text-danger btn disabled"></i>'+
        '</div>'+
        '<div class="card-body">'+
        '<p class="card-text">Belum Ada Laporan</p>'+
        '</div>'
      );
  }

  $.each(idDaops, function( key, value ) {
    if(key<5)
    { $("#card"+(key+1)).html(
        '<div class="card-header">'+
        '<i class="fa fa-fw fa-file-pdf fa-5x text-danger btn enabled" onClick="donlot(\''+today+'\',\''+value+'\')"></i>'+
        '</div>'+
        '<div class="card-body">'+
        '<p class="card-text">'+today+' - '+nmDaops[key]+' - '+
        provinsi[key]+'</p>'+
        '</div>'
      );
    }

    tblDownload.row.add( [
        nmDaops[key],
        provinsi[key],
        '<center><i class="fas fa-file-download btn btn-danger btn-sm" onClick="donlot(\''+today+'\',\''+value+'\')"></i></center>',
        '<center><i class="fas fa-map btn btn-primary btn-sm" data-toggle="modal" data-target="#detailModal" onClick="history(\''+value+'\',\''+nmDaops[key]+'\')"></i></center>'
    ] ).draw( false );

  });

  $.each(idProv, function( key, value ) {
    console.log(idProv);
    tblRekap.row.add( [
        nmProv[key],
        '<center><i class="fas fa-file-download btn btn-danger btn-sm" onClick="donlotRekap(\''+today+'\',\''+value+'\')"></i></center>'
    ] ).draw( false );
  });

}

function history(idDaops, namaDaops) {
  tblRekap.clear().draw();
  $('#detailModalLabel').html('Riwayat Patroli Daops '+namaDaops);

  $.ajax({
    type: 'GET',
    url: API.patroli.childs.list.url,
    data: { tanggal_patroli: today },
    success:
    function (response) {
      $('#tgl-patroli').html(": "+today);
      $('#jml-darat').html(": 0");
      $('#jml-udara').html(": 0");

      spots.patroliToday = {};
      spots.patroli = [];
      spots.patroliToday.darat = [];
      spots.patroliToday.udara = [];
      $.each(response.data, function(key, value) {
          if(value.patroli_darat.length>0 && value.patroli_darat[0].desa_kelurahan.kecamatan.kotakab.daops.id==idDaops)
          { spots.patroliToday.darat.push(value.patroli_darat);
            spots.patroli.push(value);
            $('#jml-darat').html(": "+spots.patroliToday.darat.length+' Titik');
          }
          if(value.patroli_udara.length>0 && value.patroli_udara[0].desa_kelurahan.kecamatan.kotakab.daops.id==idDaops)
          { spots.patroliToday.udara.push(value.patroli_udara);
            spots.patroli.push(value);
            $('#jml-udara').html(": "+spots.patroliToday.udara.length+' Titik');
          }
        });

        $.get("https://maps.googleapis.com/maps/api/geocode/json?language=ID&address="+namaDaops+"&key="+APIKey, function(data){
            latLng = data.results[0].geometry.location;
            initMap();
            console.log(spots);
        });
    },
    dataType: 'json',
    async:true
  });
}

function donlot(tgl,id) {
  var blob = "";
  var xhr = new XMLHttpRequest();

  xhr.onload = function(){
      if (this.status == 200) {
          blob = new Blob([xhr.response], { type: 'application/pdf' });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = "Report "+tgl+".pdf";
          link.click();
        }
  };

  try {
      xhr.open('GET', API.patroli.childs.laporan.url+'?tanggal='+tgl+'&daops='+id+'&load=pdf', true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader('Authorization','Bearer ' + localStorage.getItem("token"));
      xhr.responseType = 'blob';
      xhr.send();
  } catch (e) {
    }
}

function donlotRekap(tgl,id) {
  var blob = "";
  var xhr = new XMLHttpRequest();

  xhr.onload = function(){
      if (this.status == 200) {
          blob = new Blob([xhr.response], { type: 'application/pdf' });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = "Report Provinsi "+tgl+".pdf";
          link.click();
        }
  };

  try {
      xhr.open('GET', API.provinsi.childs.laporan.url+'?tanggal='+tgl+'&provinsi_id='+id+'&load=pdf', true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader('Authorization','Bearer ' + localStorage.getItem("token"));
      xhr.responseType = 'blob';
      xhr.send();
  } catch (e) {
    }
}

function initMap() {
  map = new google.maps.Map(document.getElementById('mainMaps'), {
    center: latLng,
    mapTypeId:"hybrid",
    zoom: 7
  });

  var marker = new Array();
  var infowindow = new Array();
  var activeWindow;

  if (spots.patroli.length>0){
    $.each(spots.patroli, function( key0, value0 ) {
      if (value0.patroli_darat.length>0){
        $.each(value0.patroli_darat, function( key, value ) {
          marker[value.id] = new google.maps.Marker({
            position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          });
          // console.log(value);
          if(value.kondisi_karhutla==null) value.kondisi_karhutla={nama:"Tidak Dituliskan"};
          infowindow[value.id] = new google.maps.InfoWindow({
            content:
              '<table class="text-left">'+
              '<tr>'+
                  '<td colspan=3 class="text-center font-weight-bold">Ringkasan Patroli</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Provinsi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kota/Kab</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.kotakab.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kecamatan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Desa Kelurahan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Daerah Operasi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kondisi Pantauan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td class="font-weight-bold">'+value.kondisi_karhutla.nama+'</td>'+
              '</tr>'+
              '</table>'
           });
          marker[value.id].addListener('click', function() {
            if (activeWindow!=null) activeWindow.close(map);
            infowindow[value.id].open(map, marker[value.id]);
            activeWindow=infowindow[key];
          });
          marker[value.id].setMap(map);
        });
      }

      if (value0.patroli_udara.length>0){
        $.each(value0.patroli_udara, function( key, value ) {
          // console.log(value);
          marker[value.id] = new google.maps.Marker({
            position: { lat: parseInt(value.latitude), lng: parseInt(value.longitude) },
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          });

          if(value.kondisi_karhutla==null) value.kondisi_karhutla={nama:"Tidak Dituliskan"};
          infowindow[value.id] = new google.maps.InfoWindow({
            content:
              '<table class="text-left">'+
              '<tr>'+
                  '<td colspan=3 class="text-center font-weight-bold">Ringkasan Patroli Udara</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Provinsi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.provinsi.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kota/Kab</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.kotakab.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kecamatan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Desa Kelurahan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Daerah Operasi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.desa_kelurahan.kecamatan.kotakab.daops.nama+'</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Radius Operasi</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.radial+' Km</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Suhu/Kelembaban</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td>'+value.suhu+' &#8451; / '+value.kelembaban+'%</td>'+
              '</tr>'+
              '<tr>'+
                '<td>Kondisi Pantauan</td>'+
                '<td>&nbsp; : &nbsp;</td>'+
                '<td class="font-weight-bold">'+value.kondisi_karhutla.nama+'</td>'+
              '</tr>'+
              '</table>'
           });
          marker[value.id].addListener('click', function() {
            if (activeWindow!=null) activeWindow.close(map);
            infowindow[value.id].open(map, marker[value.id]);
            activeWindow=infowindow[key];
          });
          marker[value.id].setMap(map);
        });
      }
    });
  }
}
