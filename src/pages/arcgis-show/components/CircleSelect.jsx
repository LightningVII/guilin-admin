import React from 'react';
import { Drawer, Statistic, Row, Col, Tooltip } from 'antd';
import { EditOutlined, ClearOutlined } from '@ant-design/icons';
import { loadModules } from 'esri-loader';

let EsriDraw = null;
let EsriGraphic = null;
let EsriPolygon = null;
let EsriQuery = null;
let draw = null;
let bhlxArrays = [];

class CicleSelect extends React.Component {
    constructor(props) {
        super(props);
        // 设置 initial state
        this.state = {
            visible: false,
            sumArea: 0,
            bhtbCount: 0,
            bhlxArray: []
        }
    }

    componentDidMount() {
        loadModules(["esri/views/draw/Draw", "esri/Graphic", "esri/geometry/Polygon", "esri/tasks/support/Query"]).then(
            ([Draw, Graphic, Polygon, Query]) => {
                EsriDraw = Draw;
                EsriGraphic = Graphic;
                EsriPolygon = Polygon;
                EsriQuery = Query;
                this.redraw()
            }
        );
    }

    createPolygon = event => {
        const mapView = this.props.view;
        // 清除之前绘制
        mapView.graphics.removeAll();
        bhlxArrays = [];
        this.setState({
            sumArea: 0,
            bhtbCount: 0,
            bhlxArray: []
        })

        // 生成绘制的图形
        const graphic = new EsriGraphic({
            geometry: new EsriPolygon({
                hasZ: false,
                hasM: false,
                rings: [event.vertices],
                spatialReference: mapView.spatialReference
            }),
            symbol: {
                type: "simple-fill",
                color: [51, 51, 204, 0.2],
                style: "solid",
                outline: {
                    color: "orange",
                    width: 1
                }
            }
        });
        // 将绘制的图形添加到view
        mapView.graphics.add(graphic);
        if (event.type === "draw-complete") {
            this.setState({
                visible: true
            })
            mapView.cursor = "default"
            const layers = this.props.view.map.allLayers;
            layers.forEach(item => {
                switch (item.type) {
                    case "feature":
                        this.query(graphic.geometry, item)
                        break;
                    default:
                        break;
                }
            });
        }
    }

    query = (geometry, item) => {
        const that = this
        const fMap = this.props.view.map
        const fLayer = fMap.findLayerById(item.id)
        const query = new EsriQuery();
        query.geometry = geometry;
        query.returnGeometry = false;
        query.outFields = ["*"];
        fLayer.queryFeatures(query).then(results => {
            if (results.features.length > 0 && results.features[0].attributes.area) {
                let area = 0;
                let count = 0;
                results.features.forEach(fea => {
                    area = fea.attributes.area + area
                    count += 1
                    const bhlx = fea.attributes.BHLX
                    if (bhlxArrays.indexOf(bhlx) === -1) {
                        bhlxArrays.push(bhlx)
                    }
                })

                that.setState(prevState => ({
                    sumArea: area + prevState.sumArea,
                    bhtbCount: count + prevState.bhtbCount,
                    bhlxArray: bhlxArrays
                }))
            }
        });
    }

    setContentInfo = () => {
        const content = (<Statistic title="图斑总面积" value={this.state.sumArea} precision={2} suffix="亩" />)
        return content;
    }

    redraw = () => {
        const mapView = this.props.view;
        draw = new EsriDraw({
            view: this.props.view
        });
        mapView.graphics.removeAll();
        const action = draw.create("polygon", { mode: "click" });
        mapView.cursor = "crosshair";
        action.on(["vertex-add", "cursor-update", "draw-complete", "vertex-remove"], this.createPolygon);
    }


    render() {
        return (
            <Drawer
                title="查询结果统计"
                placement="bottom"
                mask={false}
                onClose={() => {
                    this.props.view.graphics.removeAll();
                    this.props.onClose()
                }}

                visible={this.state.visible}
                height='180px'
                style={{
                    width: "400px",
                    left: "calc(50% - 150px)"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic title="图斑总面积" value={this.state.sumArea} precision={2} suffix="亩" />
                        </Col>
                        <Col span={8}>
                            <Statistic title="图斑数量" value={this.state.bhtbCount} suffix="个" />
                        </Col>
                        <Col span={8}>
                            <Statistic title="变化类型数量" value={this.state.bhlxArray.length} suffix="类" />
                        </Col>
                    </Row>
                </div>

                <Tooltip title="清除绘制">
                    <ClearOutlined
                        onClick={() => {
                            this.props.view.graphics.removeAll()
                        }}
                        style={{ position: "absolute", top: 20, right: 60, cursor: 'pointer' }} />
                </Tooltip>

                <Tooltip title="重新绘制">
                    <EditOutlined
                        onClick={() => {
                            this.redraw()
                        }}
                        style={{ position: "absolute", top: 20, right: 100, cursor: 'pointer' }} />
                </Tooltip>
            </Drawer>
        );
    }
}

export default CicleSelect;
