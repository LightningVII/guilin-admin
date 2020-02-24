import React from 'react';
import { loadModules } from 'esri-loader';
import { Row, Col, Button } from 'antd';


import MyBasemap from './MyBasemap';

let EsriWebTileLayer;
let EsriFeatureLayer;
let maps = [];

class MapCompare extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
        };

        loadModules(['esri/layers/WebTileLayer', 'esri/layers/FeatureLayer'])
            .then(([WebTileLayer, FeatureLayer]) => {
                EsriWebTileLayer = WebTileLayer;
                EsriFeatureLayer = FeatureLayer;
            })

    }

    getTiledLayers = layersArray => {
        const obj = {};
        const tLayers = [];
        const fLayers = [];
        layersArray.forEach(node => {
            const type = node.props.loadType;
            if (type) {
                switch (type) {
                    case "tile":
                        tLayers.push(node)
                        break;
                    case "feature":
                        fLayers.push(node)
                        break;

                    default:
                        break;
                }
            }
        })

        obj.tLayers = tLayers;
        obj.fLayers = fLayers

        return obj
    }

    handleLoad = (map, view, item, fLCounts, tLCounts) => {
        map.add(new EsriWebTileLayer({ urlTemplate: item.props.layerUrl, id: item.key }));
        fLCounts.forEach(fLayer => {
            map.add(new EsriFeatureLayer({ url: fLayer.props.layerUrl, id: fLayer.key }))
        })
        const mapObj = {};
        mapObj.key = item.key;
        mapObj.view = view;
        maps.push(mapObj);

        if (maps.length === tLCounts.length) {
            maps.forEach(mapItem => {
                mapItem.view.watch('extent', () => {
                    if (mapItem.view.focused) {
                        this.setExtentMove(maps, mapItem)
                        // maps[1].view.extent = maps[0].view.extent
                        // maps[2].view.extent = maps[0].view.extent
                    }

                })
            })
        }

    }

    setExtentMove = (mapList, item) => {
        mapList.forEach(mItem => {
            const map = mItem;
            if (mItem.key !== item.key) {
                map.view.extent = item.view.extent
            }
        })
    }

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
            countsUp = tLCounts.slice(0, num)
            countsDown = tLCounts.slice(num)
            heightStyle = 'calc(50vh - 90px)';
            colSpan = 24 / num;
        }


        return (
            <>
                <div className="gutter-example">
                    <Row gutter={16}>
                        {
                            countsUp.map(item =>

                                <Col className="gutter-row" span={colSpan} key={item.key}>
                                    <Button style={{ position: 'absolute', top: 1, right: 12, zIndex: 9 }}
                                        onClick={this.handleOpenModal}>{item.props.title}</Button>
                                    <MyBasemap height={heightStyle}
                                        handleLoad={(map, view) => this.handleLoad(map, view, item, fLCounts, tLCounts)}
                                    ></MyBasemap>
                                </Col>
                            )
                        }
                    </Row>
                    <br />
                    <Row gutter={16}>
                        {
                            countsDown.map(item =>
                                <Col className="gutter-row" span={colSpan} key={item.key}>
                                    <Button style={{ position: 'absolute', top: 1, right: 12, zIndex: 9 }}>{item.props.title}</Button>
                                    <MyBasemap height={heightStyle}
                                        handleLoad={(map, view) => this.handleLoad(map, view, item, fLCounts, tLCounts)}
                                    ></MyBasemap>
                                </Col>
                            )
                        }
                    </Row>
                </div>

            </>
        )
    }
}

export default MapCompare;