import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const MyFeatureLayer = props => {
  const [featureLayer, setFeatureLayer] = useState(null);
  useEffect(() => {
    loadModules(['esri/core/urlUtils', 'esri/layers/FeatureLayer'])
      .then(([urlUtils, FeatureLayer]) => {
        urlUtils.addProxyRule({
          urlPrefix: 'http://112.35.60.89:83/arcgis/rest/services',
          proxyUrl: 'http://112.35.60.89:82/resourceProxy',
        });

        const fl = new FeatureLayer({
          url: 'http://112.35.60.89:83/arcgis/rest/services/CompreRegionService/FeatureServer',
          id: 'microGridFeatureLayer',
          outFields: ['*'],
          title: '综合业务区图层',
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
