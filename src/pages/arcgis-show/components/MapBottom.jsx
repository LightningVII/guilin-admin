import React from 'react';
import { debounce } from 'lodash'
import { Card, Col, Row, Tooltip } from 'antd';
import { loadModules } from 'esri-loader';
import { EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import style from './style.css';

import { baseMapList, labelMapList } from './baseMapList.js';

let EsriWebTileLayer;
class MapBottom extends React.Component {
  constructor(props) {
    super(props);
    this.getXY = debounce(this.getXY, 0);// 防抖函数
    // 设置 initial state
    this.state = {
      X: "117.1812",
      Y: "34.2734",
      zoom: "13",
      scale: '10000',
      baseMapTitle: this.props.mapView.map.basemap.title,
      showBaseMapCard: false, // 是否显示切换底图Card
      showAreaQuery: false
    };
  }

  componentDidMount() {
    loadModules(['esri/layers/WebTileLayer'])
      .then(([WebTileLayer]) => {
        EsriWebTileLayer = WebTileLayer;

        // const scaleBar = new ScaleBar({
        //   view: this.props.mapView,
        //   unit: "metric" 
        // });

        // Add the widget to the bottom left corner of the view
        // this.props.mapView.ui.add(scaleBar,'bottom-left');

        this.props.mapView.on('pointer-move', evt => {
          this.getXY(evt.x, evt.y);
          // console.log(evt.x,evt.y)
        })

        this.props.mapView.watch('extent', ext => {
          if (ext)
            this.getXY(ext.center.longitude, ext.center.latitude);
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


  getXY = (px, py) => {
    const point = this.props.mapView.toMap({ x: px, y: py });
    if (point)
      this.setState({
        X: point.longitude.toFixed(4),
        Y: point.latitude.toFixed(4),
        zoom: this.props.mapView.zoom.toFixed(0),
        scale: this.props.mapView.scale.toFixed(0)
      })
  }

  showBaseMap = () => {
    this.setState(prevState => ({
      showBaseMapCard: !prevState.showBaseMapCard
    }))
  }

  areaQuery = () => {
    this.setState(prevState => ({
      showAreaQuery: !prevState.showAreaQuery
    }))
  }

  render() {
    return (
      <>
        <div style={{ textAlign: 'right', marginRight: 100 }}>
          经度:<Tooltip placement="top" title='输入经纬度'><a>{this.state.X}</a> </Tooltip>&#12288;
          纬度:<Tooltip placement="top" title='输入经纬度'><a>{this.state.Y}</a></Tooltip> &#12288;
          比例尺:<a>1:{this.state.scale}</a>&#12288;

          级别:<Tooltip placement="top" title='设置级别'><a>{this.state.zoom}</a></Tooltip>&#12288;
          视域统计：<Tooltip placement="top" title='打开统计'><a onClick={() => { this.areaQuery() }}><EyeOutlined />&nbsp;</a></Tooltip>&#12288;
          当前底图: <Tooltip placement="top" title='打开选项卡'><a onClick={() => this.showBaseMap()}><GlobalOutlined />&nbsp;{this.state.baseMapTitle}</a></Tooltip>
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


        {this.state.showAreaQuery ? (
          <div className={style.areaQuery}>
            当前范围统计<br />
            图斑面积：28平方公里<br />
            图斑数量：23个<br />
            图斑类型：2个<br />
          </div>
        ) : null}

      </>
    );
  }
}

export default MapBottom;
