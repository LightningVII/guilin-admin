export const treeData = [
  {
    title: '影像图层',
    key: 'rsLayer',
    loadType: 'parent',
    children: [
      {
        title: '2020年1月',
        key: '0-0-1',
        loadType: 'tile',
        layerdate: '202001',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201805/MapServer/tile/{level}/{row}/{col}',
      },
      {
        title: '2020年2月',
        key: '0-0-2',
        loadType: 'tile',
        layerdate: '202002',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201809/MapServer/tile/{level}/{row}/{col}',
      },
      {
        title: '2020年3月',
        key: '0-0-3',
        loadType: 'tile',
        layerdate: '202003',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201810/MapServer/tile/{level}/{row}/{col}',
      },
      {
        title: '2020年4月',
        key: '0-0-4',
        loadType: 'tile',
        layerdate: '202004',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201812/MapServer/tile/{level}/{row}/{col}',
      }
    ],
  },
  {
    title: '变化图斑',
    key: 'bhtb',
    loadType: 'parent',
    children: [
      {
        title: '2020年第1期',
        key: '0-1-0',
        loadType: 'feature',
        qsx: '202001',
        hsx: '202002',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
      {
        title: '2020年第2期',
        key: '0-1-1',
        loadType: 'feature',
        qsx: '202002',
        hsx: '202003',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
      {
        title: '2020年第3期',
        key: '0-1-2',
        loadType: 'feature',
        qsx: '202003',
        hsx: '202004',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
      {
        title: '2020年第4期',
        key: '0-1-3',
        loadType: 'feature',
        qsx: '202004',
        hsx: '202005',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      }
    ],
  },
  {
    title: '基础地理图层',
    key: 'baseLayer',
    loadType: 'parent',
    children: [
      {
        title: '行政区划',
        key: '0-3-0',
        loadType: 'feature',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/BaseData/MS_SL_BaseData_city/MapServer/0',
      },
    ],
  },
];


export const geo = [

]

export const xzqFeature = {
  title: '行政区划',
  key: '0-3-0',
  loadType: 'feature',
  layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/BaseData/MS_SL_BaseData_city/MapServer/0',
  extent: {
    type: "extent",
    xmax: 13378262.686815985,
    xmin: 12900989.882203575,
    ymax: 4213152.162529322,
    ymin: 3968247.923903736,
    spatialReference: { wkid: 102100 }
  }
}