import React from 'react';
import { debounce } from 'lodash'
import { Card, Col, Row } from 'antd';
import { loadModules } from 'esri-loader';
import style from './style.css';

import { baseMapList, labelMapList } from './baseMapList.js';

let EsriWebTileLayer;
class MapBottom extends React.Component {
  constructor(props) {
    super(props);
    this.getXY = debounce(this.getXY, 20);// 防抖函数
    // 设置 initial state
    this.state = {
      X: "117.1812",
      Y: "34.2734",
      zoom: "13",
      baseMapTitle: this.props.mapView.map.basemap.title,
      showBaseMapCard: false // 是否显示切换底图Card
    };
  }

  componentDidMount() {
    loadModules(['esri/layers/WebTileLayer'])
      .then(([WebTileLayer]) => {
        EsriWebTileLayer = WebTileLayer;
        this.props.mapView.on('pointer-move', evt => {
          this.getXY(evt);
        })
      })
  }

  setToggleClass = item => {
    let togClass = style.baseMapText

    switch (item.type) {
      case "labelMap":
        if (item.key === this.props.mapView.map.basemap.referenceLayers.items[0].id) {
          togClass = style.baseMapTextToggle
        }
        break;
      case "baseMap":
        if (item.key === this.props.mapView.map.basemap.baseLayers.items[0].id) {
          togClass = style.baseMapTextToggle
        }
        break;
      default:
        break;
    }

    return togClass;
  }

  changeBaseMap = item => {
    switch (item.type) {
      case 'baseMap':
        this.setState({
          baseMapTitle: item.title
        })
        this.props.mapView.map.basemap.title = item.title;
        this.props.mapView.map.basemap.baseLayers = [
          new EsriWebTileLayer({
            urlTemplate: item.urlTemplate,
            subDomains: item.subDomains,
            id: item.key
          })
        ]

        break;
      case 'labelMap':
        this.setState({}); // 为了重新render
        this.props.mapView.map.basemap.title = item.title;
        this.props.mapView.map.basemap.referenceLayers = [
          new EsriWebTileLayer({
            urlTemplate: item.urlTemplate,
            subDomains: item.subDomains,
            id: item.key
          })
        ]
        break;
      default:

        break;
    }
  }


  getXY = evt => {
    const point = this.props.mapView.toMap({ x: evt.x, y: evt.y });
    if (point)
      this.setState({
        X: point.longitude.toFixed(4),
        Y: point.latitude.toFixed(4),
        zoom: this.props.mapView.zoom
      })
  }

  showBaseMap = () => {
    this.setState(prevState => ({
      showBaseMapCard: !prevState.showBaseMapCard
    }))
  }

  render() {
    return (
      <>
        <div style={{ textAlign: 'right', marginRight: 150, marginTop: 3 }}>
          经度:{this.state.X} &#12288; 纬度:{this.state.Y} &#12288;级别:{this.state.zoom} &#12288;
          底图: <a onClick={() => this.showBaseMap()}>{this.state.baseMapTitle}</a>
        </div>

        {this.state.showBaseMapCard ? (
          <Card
            className={style.mapBottomCard}
            size="small"
            title="切换底图"
            extra={
              <a
                onClick={() =>
                  this.setState({
                    showBaseMapCard: false,
                  })
                }
              >
                X
                  </a>
            }
          >
            <div className={style.baseMapTitle}>
              <b>标注</b>
            </div>
            <Row gutter={16}>
              {labelMapList.map(item => (
                <Col
                  span={8}
                  key={item.key}
                  className={this.setToggleClass(item)}
                  onClick={() => {
                    this.changeBaseMap(item);
                  }}
                >
                  <img
                    className={style.baseMapImg}
                    src={item.thumbnailUrl}
                    alt="Smiley face"
                    width="42"
                    height="42"
                  />
                  <div className={style.baseMapText}>{item.title}</div>
                </Col>
              ))}
            </Row>
            <div className={style.baseMapTitle}>
              <b>底图</b>
            </div>
            <Row gutter={16}>

              {baseMapList.map(item => (
                <Col
                  span={8}
                  key={item.key}
                  className={this.setToggleClass(item)}
                  onClick={() => {
                    this.changeBaseMap(item);
                  }}
                >
                  <img
                    className={style.baseMapImg}
                    src={item.thumbnailUrl}
                    alt="Smiley face"
                    width="42"
                    height="42"
                  />
                  <div className={style.baseMapText}>{item.title}</div>
                </Col>
              ))}
            </Row>
          </Card>
        ) : null}
      </>
    );
  }
}

export default MapBottom;
