import React from 'react';
import { loadModules } from 'esri-loader';
import { baseMapList, labelMapList } from './json/baseMapList'
import style from './css/style.css'

export default class BaseMap extends React.Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();
        this.state = {
            height: this.props.height || '100vh',
            loadStatus: 'visible',
            loadInfo: '地图加载中...'
        }
    }

    componentDidMount() {
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/WebTileLayer', 'esri/Basemap'], { css: true })
            .then(([ArcGISMap, MapView, WebTileLayer, Basemap]) => {
                let bm = localStorage.getItem('baseMap');
                let lm = localStorage.getItem('labelMap');
                const defaultMap = baseMapList[0];
                const defaultLabel = labelMapList[0];
                if (bm) {
                    bm = JSON.parse(bm)
                    defaultMap.title=bm.title
                }
                if (lm) {
                    lm = JSON.parse(lm)
                }
                this.argmap = new ArcGISMap({
                    basemap: new Basemap({
                        baseLayers: [new WebTileLayer(bm || defaultMap)],
                        referenceLayers: [new WebTileLayer(lm || defaultLabel)],
                        title: defaultMap.title
                    })
                });

                this.view = new MapView({
                    container: this.mapRef.current,
                    map: this.argmap,
                    center: [117.18, 34.27],
                    zoom: 13,
                });

                this.view.when(() => {
                    this.setState({
                        loadStatus: 'hidden',
                        loadInfo: '加载成功'
                    })
                    this.props.handleLoad(this.argmap, this.view);
                }, error => {
                    this.setState({
                        loadStatus: 'visible',
                        loadInfo: error
                    })
                })
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
                style={{ height: this.state.height }}
            >
                <b
                    className={style.loadingInfo}
                    style={{
                        visibility: this.state.loadStatus
                    }}
                >{this.state.loadInfo}</b>
                {this.props.child}
            </div>
        );
    }
}