import React, { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
// import { loadModules, setDefaultOptions, loadScript, loadCss } from 'esri-loader';
import { Map } from '@esri/react-arcgis';

// loadScript({
//   url: 'http://112.35.60.89:82/api4.11/init.js',
// });
// loadCss('http://112.35.60.89:82/api4.11/esri/css/main.css');
// setDefaultOptions({ css: true });

const MyBasemap = props => {
  const { center, zoom, children, handleLoad } = props;
  const [basemap, setBasemap] = useState(null);
  // const [mapExtent, setMapExtent] = useState({});
  useEffect(() => {
    loadModules(['esri/layers/WebTileLayer', 'esri/Basemap'])
      .then(([WebTileLayer, Basemap]) => {
        const tiandituLayer = new WebTileLayer({
          urlTemplate:
            'http://t{subDomain}.tianditu.com/img_w/wmts?layer=img&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=f976ce9b5e5a48f5f4753c52b37bd0b8',
          subDomains: [1, 2, 3, 4, 5, 6],
          copyright:
            '地图数据 © 2018 <a href="http://www.tianditu.gov.cn" target="_blank">天地图</a>',
        });

        setBasemap(
          new Basemap({
            baseLayers: [tiandituLayer],
            title: '',
            id: 'google_s',
            thumbnailUrl: 'https://mt1.google.cn/maps/vt?lyrs=s%40781&hl=zh-CN&x=13&y=6&z=4',
          }),
        );
      })
      .catch(err => console.error(err));
    return () => {};
  }, []);
  return (
    <Map
      onLoad={handleLoad}
      // onDrag={handleDrag}
      mapProperties={{ basemap }}
      viewProperties={{
        center,
        zoom,
      }}
      style={{ height: '100vh' }}
    >
      {children}
    </Map>
  );
};

MyBasemap.defaultProps = {
  center: [117.290592, 34.21428],
  zoom: 13,
  // handleDrag: () => {},
};

export default MyBasemap;
