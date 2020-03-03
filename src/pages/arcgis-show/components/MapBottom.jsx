import React from 'react';
import { debounce } from 'lodash'
import { Card, Col, Row } from 'antd';
import { loadModules } from 'esri-loader';
import style from './style.css'

import { baseMapList, labelMapList } from './baseMapList.js'


let EsriWebTileLayer;
let EsriBasemap;
class MapBottom extends React.Component {
    constructor(props) {
        super(props);
        this.getXY = debounce(this.getXY, 20);// 防抖函数
        // 设置 initial state
        this.state = {
            X: "117.1812",
            Y: "34.2734",
            zoom: "13",
            title: '天地图街道图',
            showBaseMapCard: false, // 是否显示切换底图Card
            // baseActiveClass:style.baseMapText,
            // labelActiveClass:style.baseMapTextToggle
        };

        loadModules(['esri/layers/WebTileLayer', "esri/Basemap"])
            .then(([WebTileLayer, Basemap]) => {

                EsriWebTileLayer = WebTileLayer;
                EsriBasemap = Basemap;

            })

    }

    componentDidMount() {
        // this.getXY();

        this.props.mapView.on('pointer-move', evt => {
            this.getXY(evt);
        })

    }

    setToggleClass = (item, index, type) => {
        let togClass = style.baseMapText

        switch (type) {
            case "label":
                togClass = style.baseMapTextToggle
                break;
            case "base":
                if (item.key === this.props.mapView.map.basemap.id) {
                    togClass = style.baseMapTextToggle
                }
                break;
            default:
                break;
        }
        return togClass
    }

    changeBaseMap = item => {

        this.props.mapView.map.basemap = new EsriBasemap({
            baseLayers: [
                new EsriWebTileLayer({
                    urlTemplate: item.urlTemplate,
                    subDomains: item.subDomains,
                })
            ],
            id: item.key
        })
        this.setState({ title: item.name });

    }


    getXY = evt => {
        const point = this.props.mapView.toMap({ x: evt.x, y: evt.y });
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
                    底图: <a onClick={this.showBaseMap}>{this.state.title}</a>
                </div>

                {
                    this.state.showBaseMapCard ?
                        <Card className={style.mapBottomCard} size="small" title="切换底图" extra={<a onClick={
                            () => this.setState({
                                showBaseMapCard: false
                            })
                        }>X</a>}>
                            <Row gutter={16}>
                                <div className={style.baseMapTitle}><b>标注</b></div>
                                {
                                    labelMapList.map((item, index) =>

                                        <Col span={8} key={item.key} className={this.setToggleClass(item, index, 'label')}
                                            onClick={() => { this.changeBaseMap(item) }
                                            }>
                                            <img className={style.baseMapImg} src={item.thumbnailUrl} alt="Smiley face" width="42" height="42" />
                                            <div className={style.baseMapText}>{item.name}</div>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row gutter={16}>
                                <div className={style.baseMapTitle}><b>底图</b></div>
                                {
                                    baseMapList.map((item, index) =>

                                        <Col span={8} key={item.key} className={this.setToggleClass(item, index, 'base')}
                                            onClick={
                                                () => { this.changeBaseMap(item) }
                                            }>
                                            <img className={style.baseMapImg} src={item.thumbnailUrl} alt="Smiley face" width="42" height="42" />
                                            <div className={style.baseMapText}>{item.name}</div>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Card>
                        : null
                }


            </>
        )
    }
}

export default MapBottom;