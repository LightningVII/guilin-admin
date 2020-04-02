import React from 'react';
import { loadModules } from 'esri-loader';
import { message, Button } from 'antd';
// import MyBasemap from './MyBasemap';
import BaseMap from './BaseMap';
import { infoTemplate } from './json/featureTemplate.js';

let EsriSwipe;
let EsriWebTileLayer;
let EsriFeatureLayer;
let mapView;

class MapSwipe extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {
      LT: '',
      RT: '',
    };
  }

  loadGIS = () => {
    loadModules([
      'esri/widgets/Swipe',
      'esri/layers/WebTileLayer',
      'esri/layers/FeatureLayer',
    ]).then(([Swipe, WebTileLayer, FeatureLayer]) => {
      EsriSwipe = Swipe;
      EsriWebTileLayer = WebTileLayer;
      EsriFeatureLayer = FeatureLayer;
      this.initSwipe();
    });
  };

  initSwipe = () => {
    const rLayers = [];
    const fLayers = [];
    this.props.layersArray.forEach(node => {
      const type = node.loadType;
      if (type) {
        switch (type) {
          case 'tile':
            rLayers.push(node);
            break;
          case 'feature':
            fLayers.push(node);
            break;
          default:
            break;
        }
      }
    });
    if (rLayers.length === 2) {
      this.setState({
        LT: rLayers[0].title,
        RT: rLayers[1].title,
      });

      const layer1 = new EsriWebTileLayer({
        urlTemplate: rLayers[0].layerUrl,
      });

      const layer2 = new EsriWebTileLayer({
        urlTemplate: rLayers[1].layerUrl,
      });

      mapView.map.addMany([layer1, layer2]);

      const swipe = new EsriSwipe({
        view: mapView,
        leadingLayers: [layer1],
        trailingLayers: [layer2],
        // direction: "vertical", // swipe widget will move from top to bottom of view
        position: 50, // position set to middle of the view (50%)
      });
      mapView.ui.add(swipe);

      fLayers.forEach(fLayer => {
        mapView.map.add(new EsriFeatureLayer({ url: fLayer.layerUrl, id: fLayer.key, popupTemplate: infoTemplate }));
      });
    } else {
      message.info('请选择两幅栅格影像');
    }
  };

  render() {
    return (
      <>
        {/* <MyBasemap
          height="calc(100vh - 180px)"
          handleLoad={(map, view) => {
            mapView = view;
            setTimeout(() => {
              this.loadGIS();
            }, 600);
          }}
        /> */}
        <BaseMap
          height="calc(100vh - 180px)"
          handleLoad={(map, view) => {
            mapView = view;
            this.loadGIS();
          }}
        />

        <Button
          type="primary"
          style={{ position: 'absolute', bottom: 30, left: 30, zIndex: 9 }}
          onClick={this.handleOpenModal}
        >
          左影像:{this.state.LT}
        </Button>

        <Button
          type="primary"
          style={{ position: 'absolute', bottom: 30, right: 30, zIndex: 9 }}
          onClick={this.handleOpenModal}
        >
          右影像:{this.state.RT}
        </Button>
      </>
    );
  }
}

export default MapSwipe;
