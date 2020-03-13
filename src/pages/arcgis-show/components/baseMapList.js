const token = 'f976ce9b5e5a48f5f4753c52b37bd0b8';

export const baseMapList = [
  {
    title: '天地图街道图',
    urlTemplate: `http://t{subDomain}.tianditu.com/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
    subDomains: [1, 2, 3, 4, 5, 6],
    copyright: '地图数据 © 2018 <a href="http://www.tianditu.gov.cn" target="_blank">天地图</a>',
    key: 'tiandituLayer_vec',
    thumbnailUrl: `http://t1.tianditu.com/DataServer?T=vec_w&x=13&y=6&l=4&tk=${token}`,
    type: 'baseMap', // 分为baseMap 和 labelMap
  },
  {
    title: '谷歌影像图',
    urlTemplate: 'http://mt{subDomain}.google.cn/maps/vt?lyrs=s@821&x={col}&y={row}&z={level}',
    subDomains: [0, 1, 2, 3],
    copyright:
      '地图数据 © 2018 Google <a href="http://www.google.cn/maps" target="_blank">谷歌地图</a>',
    key: 'google_img',
    thumbnailUrl: 'https://mt1.google.cn/maps/vt?lyrs=s%40781&hl=zh-CN&x=13&y=6&z=4',
    type: 'baseMap', // 分为baseMap 和 labelMap
  },
  {
    title: '天地图卫星图',
    urlTemplate: `http://t{subDomain}.tianditu.com/img_w/wmts?layer=img&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
    subDomains: [1, 2, 3, 4, 5, 6],
    copyright: '地图数据 © 2018 <a href="http://www.tianditu.gov.cn" target="_blank">天地图</a>',
    key: 'tiandituLayer_img',
    thumbnailUrl: `http://t1.tianditu.com/DataServer?T=img_w&x=13&y=6&l=4&tk=${token}`,
    type: 'baseMap', // 分为baseMap 和 labelMap
  },
];

export const labelMapList = [

  {
    title: '矢量注记',
    urlTemplate: `http://t{subDomain}.tianditu.com/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
    subDomains: [0, 1, 2, 3],
    copyright:
      '地图数据 © 2018 <a href="http://lbs.tianditu.gov.cn/server/MapService.html target="_blank"">天地图</a>',
    key: 'tdtLabelStreet',
    thumbnailUrl: 'https://service.tianditu.gov.cn/uploadfile/pic/1439355469950.jpg',
    type: 'labelMap',
  },
  {
    title: '影像注记',
    urlTemplate: `http://t{subDomain}.tianditu.com/cia_w/wmts?layer=cia&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
    subDomains: [0, 1, 2, 3],
    copyright:
      '地图数据 © 2018 <a href="http://lbs.tianditu.gov.cn/server/MapService.html target="_blank"">天地图</a>',
    key: 'tdtLabelImg',
    thumbnailUrl: `https://service.tianditu.gov.cn/uploadfile/pic/1438946153853.jpg`,
    type: 'labelMap',
  }
];
