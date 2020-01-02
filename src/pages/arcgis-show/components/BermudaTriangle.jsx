import { useState, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const BermudaTriangle = props => {
  const [graphic, setGraphic] = useState(null);
  useEffect(() => {
    loadModules(['esri/Graphic'])
      .then(([Graphic]) => {
        // Create a polygon geometry
        const polygon = {
          type: 'polygon', // autocasts as new Polygon()
          rings: props.rings,
        };

        // Create a symbol for rendering the graphic
        const fillSymbol = {
          type: 'simple-fill', // autocasts as new SimpleFillSymbol()
          color: [227, 139, 79, 0.8],
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 1,
          },
        };

        // Add the geometry and symbol to a new graphic
        const g = new Graphic({
          geometry: polygon,
          symbol: fillSymbol,
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
