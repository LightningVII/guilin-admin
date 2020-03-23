import React from 'react';
import { loadModules } from 'esri-loader';

const token = 'f976ce9b5e5a48f5f4753c52b37bd0b8';

export default class BaseMap extends React.Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.state = {
            height:this.props.height||'100vh',
            width:this.props.width||'100vw',

        }
    }

    componentDidMount() {
        // lazy load the required ArcGIS API for JavaScript modules and CSS
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/WebTileLayer', 'esri/Basemap'], { css: true })
            .then(([ArcGISMap, MapView, WebTileLayer, Basemap]) => {
                const tiandituLabelLayer = new WebTileLayer({
                    urlTemplate: `http://t{subDomain}.tianditu.com/cva_w/wmts?layer=cva&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
                    subDomains: [0, 1, 2, 3],
                    id: 'tdtLabelStreet',
                    visible: true,
                    listMode: 'hide',
                    copyright:
                        '地图数据 © 2018 tianditu <a href="http://lbs.tianditu.gov.cn/server/MapService.html">tianditu</a>',
                });

                const tiandituLayerVec = new WebTileLayer({
                    urlTemplate: `http://t{subDomain}.tianditu.com/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=&TileMatrix={level}&TileCol={col}&TileRow={row}&tk=${token}`,
                    subDomains: [1, 2, 3, 4, 5, 6],
                    id: 'tiandituLayer_vec',
                    copyright:
                        '地图数据 © 2018 <a href="http://www.tianditu.gov.cn" target="_blank">天地图</a>',
                });

                this.argmap = new ArcGISMap({
                    basemap: new Basemap({
                        baseLayers: [tiandituLayerVec],
                        referenceLayers: [tiandituLabelLayer],
                        title: '天地图街道图',
                        thumbnailUrl: `http://t1.tianditu.com/DataServer?T=img_w&x=13&y=6&l=4&tk=${token}`,
                    })
                });

                this.view = new MapView({
                    container: this.mapRef.current,
                    map:this.argmap,
                    center: [117.18, 34.27],
                    zoom: 13,
                });

                this.props.getMapView(this.argmap,this.view);
            });
    }

    componentWillUnmount() {
        if (this.view) {
            this.view.container = null;
        }
    }

    render() {
        return (
            <div
                ref={this.mapRef}
                style={{ height:this.state.height, width: this.state.width }}
            />
        );
    }
}