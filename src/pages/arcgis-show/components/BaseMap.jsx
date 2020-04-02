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

                this.argmap = new ArcGISMap({
                    basemap: new Basemap({
                        baseLayers: [new WebTileLayer(baseMapList[0])],
                        referenceLayers: [new WebTileLayer(labelMapList[0])],
                        title: baseMapList[0].title,
                        thumbnailUrl: baseMapList[0].thumbnailUrl,
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