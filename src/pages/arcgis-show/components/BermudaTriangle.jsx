import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { polylineSymbol } from './json/lineSymbol.js'

const BermudaTriangle = props => {
  const [graphic, setGraphic] = useState(null);
  useEffect(() => {
    loadModules(['esri/Graphic'])
      .then(([Graphic]) => {
        // Create a polygon geometry
        const polygon = {
          type: 'polygon', // autocasts as new Polygon()
          rings: props.rings.coordinates,
        };

        // Add the geometry and symbol to a new graphic
        const g = new Graphic({
          geometry: polygon,
          symbol: polylineSymbol,
        });
        
        setGraphic(g);
        props.view.graphics.add(g);
     
      })
      .catch(err => console.error(err));

    return function cleanup() {
      props.view.graphics.remove(graphic);
    };
  }, []);

  return null;
};

BermudaTriangle.defaultProps = {
  rings: [
    [117.294418, 34.221967],
    [117.290592, 34.21428],
    [117.27886, 34.216146],
    [117.294418, 34.221967],
  ],
};

export default BermudaTriangle;
