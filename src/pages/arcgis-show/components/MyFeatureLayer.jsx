import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { bhtblLineSymbol } from './json/lineSymbol.js'

const MyFeatureLayer = props => {
  const [featureLayer, setGraphic] = useState(null);
  useEffect(() => {
    loadModules(['esri/Graphic',"esri/geometry/Polygon"])
      .then(([Graphic,Polygon]) => {
        const polygon = new Polygon ({
          hasZ: true,
          hasM: true,
          rings: props.geo.coordinates, 
        });
        const g = new Graphic({
          geometry: polygon,
          symbol: bhtblLineSymbol,
        });
        props.view.extent=polygon.extent
        setGraphic(g);
        props.view.graphics.add(g);
      })
      .catch(err => console.error(err));

    return function cleanup() {
      props.view.map.remove(featureLayer);
    };
  }, []);

  return null;
};

export default MyFeatureLayer;
