import React, { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { Map } from '@esri/react-arcgis';

const token = 'f976ce9b5e5a48f5f4753c52b37bd0b8';
const mapProperties = {};

const MyBasemap = props => {
  const { center, zoom, children, handleLoad, height } = props;
  const [basemap, setBasemap] = useState(null);
  useEffect(() => {
    loadModules(['esri/layers/WebTileLayer', 'esri/Basemap'])
      .then(([WebTileLayer, Basemap]) => {
        
        const tiandituLabelLayer = new WebTileLayer({
          urlTemplate: `http://t{subDomain}.tianditu.com/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
          subDomains: [0, 1, 2, 3],
          id: 'tdtLabelStreet',
          visible: true,
          listMode: 'hide',
          copyright:
            '地图数据 © 2018 tianditu <a href="http://lbs.tianditu.gov.cn/server/MapService.html">tianditu</a>',
        });

        const tiandituLayerVec = new WebTileLayer({
          urlTemplate: `http://t{subDomain}.tianditu.com/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
          subDomains: [1, 2, 3, 4, 5, 6],
          id:'tiandituLayer_vec',
          copyright:
            '地图数据 © 2018 <a href="http://www.tianditu.gov.cn" target="_blank">天地图</a>',
        });

        setBasemap(
          new Basemap({
            baseLayers: [tiandituLayerVec],
            referenceLayers:[tiandituLabelLayer],
            title: '天地图街道图',
            thumbnailUrl: `http://t1.tianditu.com/DataServer?T=img_w&x=13&y=6&l=4&tk=${token}`,
          })
        );
      })
      .catch(err => console.error(err));
  }, []);

  mapProperties.basemap = mapProperties.basemap || basemap;

  return (
    <Map
      id="hiugiuu"
      onLoad={handleLoad}
      mapProperties={mapProperties}
      // mapProperties={{ basemap: 'satellite' }}
      loaderOptions={{ css: true }}
      viewProperties={{
        center,
        zoom,
      }}
      style={{ height }}
    >
      {children}
    </Map>
  );
};

MyBasemap.defaultProps = {
  center: [117.18, 34.27],
  zoom: 13,
  height: '100vh',
};

export default MyBasemap;
