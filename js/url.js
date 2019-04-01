var APIKey = "AIzaSyAG1wy8E-WZuD5kvCYMODyh9fZ2RConDkQ";
// var baseUrl = "http://ci.apps.cs.ipb.ac.id/siavipala/api/";
var urls = {
  sipongi:"https://cors-anywhere.herokuapp.com/http://sipongi.menlhk.go.id/action/indohotspot",
  login: "http://ci.apps.cs.ipb.ac.id/siavipala/api/auth/login",
  patroli:{
    list: "http://ci.apps.cs.ipb.ac.id/siavipala/api/patroli/list",
    laporan:"http://ci.apps.cs.ipb.ac.id/siavipala/api/patroli/unduh-laporan"
  },
  anggota:{
    list: "http://ci.apps.cs.ipb.ac.id/siavipala/api/anggota/list",
    kategori: "http://ci.apps.cs.ipb.ac.id/siavipala/api/kategori-anggota/list",
    create:"http://ci.apps.cs.ipb.ac.id/siavipala/api/anggota/create",
    delete: "http://ci.apps.cs.ipb.ac.id/siavipala/api/anggota/delete"
  },
  provinsi:{
    list:"http://ci.apps.cs.ipb.ac.id/siavipala/api/provinsi/list",
    resume: "http://ci.apps.cs.ipb.ac.id/siavipala/api/provinsi/resume",
    hotspot: "http://ci.apps.cs.ipb.ac.id/siavipala/api/hotspot-sipongi/date-range"
  },
  daops:{
    list: "http://ci.apps.cs.ipb.ac.id/siavipala/api/daops/list",
    create: "http://ci.apps.cs.ipb.ac.id/siavipala/api/daops/create",
    delete: "http://ci.apps.cs.ipb.ac.id/siavipala/api/daops/delete"
  }
};

var API = {
  sipongi:{
    name:'sipongi API',
    url:"https://cors-anywhere.herokuapp.com/http://sipongi.menlhk.go.id/action/indohotspot",
    url: "hotspot-sipongi/date-range",
    type:'child',
    method:'GET',
    returnType:'json',
    input:[],
    default:{
      start_date: "2019-01-01",
      end_date: "2019-01-02",
      provinsi: "a"
    },
    dependent:null
  },
  login:{
    name:'Login',
    url:"http://ci.apps.cs.ipb.ac.id/siavipala/api/auth/login",
    type:'child',
    method:'POST',
    returnType:'json',
    input:[
      { name:'email',
        type:'email',
        null:false
      },
      { name:'password',
        type:'text',
        null:false
      }
    ],
    default:{
      email:'rudi@gmail.com',
      password:'123'
    },
    dependent:null
  },
  patroli:{
    type:'parent',
    childs:{
      list:{
        name:'Patroli -> List',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/patroli/list",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[
          { name:'tanggal_patrol',
            type:'text',
            null:true
          }
        ],
        default:{
          tanggal_patroli:'2016-04-24'
        },
        dependent:null
      },
      laporan:{
        name:'Patroli -> Laporan',
        url:"http://ci.apps.cs.ipb.ac.id/siavipala/api/patroli/unduh-laporan",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[
          { name:'tanggal',
            type:'text',
            null:false
          },
          { name:'daops',
            type:'text',
            null:false
          },
          { name:'load',
            type:'text',
            null:false
          }
        ],
        default:{
          tanggal:'2016-04-24',
          daops:337,
          load:'pdf'
        },
        dependent:'login'
      }
    }
  },
  provinsi:{
    type:'parent',
    childs:{
      list:{
        name:'Provinsi -> List',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/provinsi/list",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[],
        default:{},
        dependent:null
      },
      resume:{
        name:'Provinsi -> Resume',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/provinsi/resume",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[
          { name:'kode_provinsi',
            type:'number',
            null:false
          },
          { name:'tahun',
            type:'number',
            null:false
          }
        ],
        default:{
          kode_provinsi:54,
          tahun:2016
        },
        dependent:null
      },
      laporan:{
        name:'Patroli -> Laporan',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/patroli/unduh-rekapitulasi-laporan",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[
          { name:'tanggal',
            type:'text',
            null:false
          },
          { name:'provinsi_id',
            type:'text',
            null:false
          },
          { name:'load',
            type:'text',
            null:false
          }
        ],
        default:{
          tanggal:'2016-04-24',
          provinsi_id:54,
          load:'pdf'
        },
        dependent:'login'
      }
    }
  },
  daops:{
    type:'parent',
    childs:{
      list:{
        name:'Daops -> List',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/daops/list",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[],
        default:{},
        dependent:null
      },
      create:{
        name:'Daops -> Create',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/daops/create",
        type:'child',
        method:'POST',
        returnType:'json',
        input:[
          { name:'provinsi_id',
            type:'number',
            null:false
          },
          { name:'nama',
            type:'text',
            null:false
          }
        ],
        default:{
          provinsi_id:54,
          nama:'daops test'
        },
        dependent:'login'
      },
      delete:{
        name:'Daops -> Delete',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/daops/delete",
        type:'child',
        method:'POST',
        returnType:'json',
        input:[
          { name:'id',
            type:'number',
            null:false
          }
        ],
        default:{
          id:0
        },
        dependent:'login'
      }
    }
  },
  anggota:{
    type:'parent',
    childs:{
      list:{
        name:'Anggota -> List',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/anggota/list",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[],
        default:{},
        dependent:'login'
      },
      kategori:{
        name:'Anggota -> Kategori',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/kategori-anggota/list",
        type:'child',
        method:'GET',
        returnType:'json',
        input:[],
        default:{},
        dependent:'login'
      },
      create:{
        name:'Anggota -> Create',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/anggota/create",
        type:'child',
        method:'POST',
        returnType:'json',
        input:[
          { name:'kategori_anggota_id',
            type:'number',
            null:false
          },
          { name:'nama',
            type:'text',
            null:false
          },
          { name:'email',
            type:'email',
            null:false
          },
          { name:'no_telepon',
            type:'text',
            null:false
          }
        ],
        default:{
          kategori_anggota_id:2,
          nama:'test anggota',
          email:'test@test.com',
          no_telepon:'0123456789'
        },
        dependent:'login'
      },
      delete:{
        name:'Anggota delete',
        url: "http://ci.apps.cs.ipb.ac.id/siavipala/api/anggota/delete",
        type:'child',
        method:'POST',
        returnType:'json',
        input:[
          { name:'id',
            type:'number',
            null:false
          }
        ],
        default:{
          id:0
        },
        dependent:'login'
      }
    }
  }
};
