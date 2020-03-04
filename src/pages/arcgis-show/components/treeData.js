export const treeData = [
  {
    title: '影像图层',
    key: 'rs-layer',
    children: [
      {
        title: '2020年1月',
        key: '0-0-1',
        loadType: 'tile',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201805/MapServer/tile/{level}/{row}/{col}',
      },
      {
        title: '2020年2月',
        key: '0-0-2',
        loadType: 'tile',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201809/MapServer/tile/{level}/{row}/{col}',
      },
      {
        title: '2020年3月',
        key: '0-0-3',
        loadType: 'tile',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201810/MapServer/tile/{level}/{row}/{col}',
      },
      {
        title: '2020年4月',
        key: '0-0-4',
        loadType: 'tile',
        layerUrl:
          'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201812/MapServer/tile/{level}/{row}/{col}',
      },
    ],
  },
  {
    title: '变化图斑',
    key: 'bhtb',
    children: [
      {
        title: '2020年第1期',
        key: '0-1-0',
        loadType: 'feature',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
      {
        title: '2020年第2期',
        key: '0-1-1',
        loadType: 'feature',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
      {
        title: '2020年第3期',
        key: '0-1-2',
        loadType: 'feature',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
      {
        title: '2020年第4期',
        key: '0-1-3',
        loadType: 'feature',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
      },
    ],
  },
  {
    title: '基础地理图层',
    key: 'base-layer',
    children: [
      {
        title: '行政区划',
        key: '0-3-0',
        loadType: 'feature',
        layerUrl: 'http://218.3.176.6:6080/arcgis/rest/services/Grid/MS_SL_Grid_city/MapServer/0',
      },
    ],
  },
];
