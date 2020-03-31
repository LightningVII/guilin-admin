import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { infoTemplate } from './featureTemplate.js';
import { polylineSymbol } from './lineSymbol.js'

const MyFeatureLayer = props => {
  const [featureLayer, setFeatureLayer] = useState(null);
  useEffect(() => {
    loadModules(['esri/core/urlUtils', 'esri/layers/FeatureLayer', 'esri/Graphic'])
      .then(([urlUtils, FeatureLayer, Graphic]) => {
        urlUtils.addProxyRule({
          urlPrefix: 'http://127.0.0.1:83/arcgis/rest/services',
          proxyUrl: 'http://112.35.60.89:82/resourceProxy',
        });

        const fl = new FeatureLayer({
          url: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
          id: 'bhtb1',
          outFields: ['*'],
          popupTemplate: infoTemplate,
          title: '202001',
        });

        const graphics = new Graphic({
          geometry: props.geometry,
          symbol: polylineSymbol
        })

        setFeatureLayer(fl);
        props.view.map.add(fl);
        props.view.graphics.add(graphics);
        props.view.extent = {
          type: "extent",
          xmax: 13026057.551445255,
          xmin: 13025591.166139795,
          ymax: 4077224.692780885,
          ymin: 4076708.145675606,
          spatialReference: { wkid: 102100 }
        }
      })
      .catch(err => console.error(err));

    return function cleanup() {
      props.view.map.remove(featureLayer);
    };
  }, []);

  return null;
};

export default MyFeatureLayer;
