import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { polylineSymbol } from './json/lineSymbol.js'

const MyFeatureLayer = props => {
  const [featureLayer, setFeatureLayer] = useState(null);
  useEffect(() => {
    loadModules(['esri/Graphic'])
      .then(([Graphic]) => {
        setFeatureLayer(
          props.view.graphics.add(new Graphic({
            geometry: props.geometry,
            symbol: polylineSymbol
          }))
        );
      })
      .catch(err => console.error(err));

    return function cleanup() {
      props.view.map.remove(featureLayer);
    };
  }, []);

  return null;
};

export default MyFeatureLayer;
