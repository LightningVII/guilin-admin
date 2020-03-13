import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
// import { template } from './featureTemplate.js';

const MyImageLayer = props => {
  const [imageLayer, setImageLayer] = useState(null);

  useEffect(() => {
    loadModules(['esri/core/urlUtils', 'esri/layers/WebTileLayer'])
      .then(([urlUtils, WebTileLayer]) => {
        urlUtils.addProxyRule({
          urlPrefix: 'http://127.0.0.1:83/arcgis/rest/services',
          proxyUrl: 'http://112.35.60.89:82/resourceProxy',
        });

        const wt = new WebTileLayer({
          urlTemplate: props.imgLayer.layerUrl,
          id: props.imgLayer.id,
        });

        setImageLayer(wt);
        props.view.map.add(wt);
      })
      .catch(err => console.error(err));

    return function cleanup() {
      props.view.map.remove(imageLayer);
    };
  }, []);

  return null;
};

export default MyImageLayer;
