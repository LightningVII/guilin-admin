import React, { useState, useEffect } from 'react';
import { loadModules, setDefaultOptions } from 'esri-loader';
import { Map } from '@esri/react-arcgis';
import BermudaTriangle from './BermudaTriangle';

setDefaultOptions({ css: true });

const MyBasemap = () => {
  const [basemap, setBasemap] = useState(null);
  useEffect(() => {
    loadModules(['esri/layers/WebTileLayer', 'esri/Basemap'])
      .then(([WebTileLayer, Basemap]) => {
        const googleLayer = new WebTileLayer({
          urlTemplate:
            'http://mt{subDomain}.google.cn/maps/vt?lyrs=s@821&x={col}&y={row}&z={level}',
          subDomains: [0, 1, 2, 3],
          copyright: '',
        });

        setBasemap(
          new Basemap({
            baseLayers: [googleLayer],
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
      mapProperties={{ basemap }}
      viewProperties={{
        center: [117.290592, 34.21428],
        zoom: 13,
      }}
      style={{ height: '100vh' }}
    >
      <BermudaTriangle />
    </Map>
  );
};

export default MyBasemap;
