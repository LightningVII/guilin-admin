import React from 'react';
import { loadModules } from 'esri-loader';
import { Row, Col, Button } from 'antd';

import MyBasemap from './MyBasemap';
import BermudaTriangle from './BermudaTriangle';

let EsriWebTileLayer;
let EsriFeatureLayer;
let EsriGraphicsLayer;
let EsriGraphic;
let maps = [];
const sym = {
  type: 'simple-line', // autocasts as new SimpleFillSymbol()
  color: 'red',
  outline: {
    // autocasts as new SimpleLineSymbol()
    color: [128, 128, 128, 0.5],
    width: '0.5px',
  },
};

class MapCompare extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {};

    loadModules([
      'esri/layers/WebTileLayer',
      'esri/layers/FeatureLayer',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
    ]).then(([WebTileLayer, FeatureLayer, GraphicsLayer, Graphic]) => {
      EsriWebTileLayer = WebTileLayer;
      EsriFeatureLayer = FeatureLayer;
      EsriGraphicsLayer = GraphicsLayer;
      EsriGraphic = Graphic;
    });
  }

  getTiledLayers = layersArray => {
    const obj = {};
    const tLayers = [];
    const fLayers = [];
    if (this.props.featrueGraphic) {
      const graphic1 = {};
      const graphic2 = {};
      // graphic1=this.props.featrueGraphic
      // const graphic2 = this.props.featrueGraphic;
      graphic1.props = {};
      graphic1.props.title = this.props.featrueGraphic.attributes.QSX;
      graphic1.props.layerUrl =
        'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201812/MapServer/tile/{level}/{row}/{col}';
      graphic1.key = '1';
      graphic2.props = {};
      graphic2.props.layerUrl =
        'http://218.3.176.6:6080/arcgis/rest/services/Raster/MS_SG_GF_201802/MapServer/tile/{level}/{row}/{col}';
      graphic2.key = '2';
      graphic2.props.title = this.props.featrueGraphic.attributes.HSX;
      tLayers.push(graphic1);
      tLayers.push(graphic2);
      const fg = this.props.featrueGraphic;
      fg.symbol = sym;
      fLayers.push(fg);
    } else {
      layersArray.forEach(node => {
        const type = node.props.loadType;
        if (type) {
          switch (type) {
            case 'tile':
              tLayers.push(node);
              break;
            case 'feature':
              fLayers.push(node);
              break;

            default:
              break;
          }
        }
      });
    }
    obj.tLayers = tLayers;
    obj.fLayers = fLayers;
    return obj;
  };

  handleLoad = (map, view, item, fLCounts, tLCounts) => {
    if (this.props.featrueGraphic) {
      map.add(new EsriWebTileLayer({ urlTemplate: item.props.layerUrl, id: item.key }));
      // fLCounts.forEach(fLayer => {
      //      map.add(new EsriGraphicsLayer({graphics: [fLayer]}))
      // })

      // map.add(new EsriGraphicsLayer({graphics: fLCounts}))
      const fls = [];
      fLCounts.forEach(fLayer => {
        const g = new EsriGraphic({
          geometry: fLayer.geometry,
          symbol: sym,
          attributes: fLayer.attributes,
        });
        fls.push(g);
        view.extent = fLayer.geometry.extent;
      });
      const gl = new EsriGraphicsLayer({ graphics: fls });
      map.add(gl);
    } else {
      map.add(new EsriWebTileLayer({ urlTemplate: item.props.layerUrl, id: item.key }));
      fLCounts.forEach(fLayer => {
        map.add(new EsriFeatureLayer({ url: fLayer.props.layerUrl, id: fLayer.key }));
      });
    }

    const mapObj = {};
    mapObj.key = item.key;
    mapObj.view = view;
    maps.push(mapObj);

    if (maps.length === tLCounts.length) {
      maps.forEach(mapItem => {
        mapItem.view.watch('extent', () => {
          if (mapItem.view.focused) {
            this.setExtentMove(maps, mapItem);
          }
        });
      });
    }
  };

  setExtentMove = (mapList, item) => {
    mapList.forEach(mItem => {
      const map = mItem;
      if (mItem.key !== item.key) {
        map.view.extent = item.view.extent;
      }
    });
  };

  render() {
    let countsUp = [];
    let countsDown = [];
    let heightStyle = '';
    let colSpan = 4;
    maps = [];

    const obj = this.getTiledLayers(this.props.layersArray);
    const tLCounts = obj.tLayers;
    const fLCounts = obj.fLayers;

    if (tLCounts.length <= 2) {
      countsUp = tLCounts;
      heightStyle = 'calc(100vh - 180px)';
      colSpan = 24 / countsUp.length;
    } else {
      const num = Math.ceil(tLCounts.length / 2);
      countsUp = tLCounts.slice(0, num);
      countsDown = tLCounts.slice(num);
      heightStyle = 'calc(50vh - 90px)';
      colSpan = 24 / num;
    }

    return (
      <>
        <div className="gutter-example">
          <Row gutter={16}>
            {countsUp.map(item => (
              <Col className="gutter-row" span={colSpan} key={item.key}>
                <Button
                  style={{ position: 'absolute', top: 1, right: 12, zIndex: 9 }}
                  onClick={this.handleOpenModal}
                >
                  {item.props.title}
                </Button>
                <MyBasemap
                  height={heightStyle}
                  handleLoad={(map, view) => this.handleLoad(map, view, item, fLCounts, tLCounts)}
                >
                  <BermudaTriangle />
                </MyBasemap>
              </Col>
            ))}
          </Row>
          <br />
          <Row gutter={16}>
            {countsDown.map(item => (
              <Col className="gutter-row" span={colSpan} key={item.key}>
                <Button style={{ position: 'absolute', top: 1, right: 12, zIndex: 9 }}>
                  {item.props.title}
                </Button>
                <MyBasemap
                  height={heightStyle}
                  handleLoad={(map, view) => this.handleLoad(map, view, item, fLCounts, tLCounts)}
                >
                  <BermudaTriangle />
                </MyBasemap>
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  }
}

export default MapCompare;
