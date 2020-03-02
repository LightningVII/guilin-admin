import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { template } from './featureTemplate.js';

const MyFeatureLayer = props => {
  const [featureLayer, setFeatureLayer] = useState(null);
  useEffect(() => {
    loadModules(['esri/core/urlUtils', 'esri/layers/FeatureLayer'])
      .then(([urlUtils, FeatureLayer]) => {
        urlUtils.addProxyRule({
          urlPrefix: 'http://127.0.0.1:83/arcgis/rest/services',
          proxyUrl: 'http://112.35.60.89:82/resourceProxy',
        });

        const fl = new FeatureLayer({
          url: 'http://218.3.176.6:6080/arcgis/rest/services/GL/GLBHTB_Test/MapServer/0',
          id: 'bhtb1',
          outFields: ['*'],
          popupTemplate:template,
          title: '202001',
        });

        setFeatureLayer(fl);
        props.view.map.add(fl);
      })
      .catch(err => console.error(err));

    return function cleanup() {
      props.view.map.remove(featureLayer);
    };
  }, []);

  return null;
};

export default MyFeatureLayer;
