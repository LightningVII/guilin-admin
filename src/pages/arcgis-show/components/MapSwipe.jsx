import React from 'react';
import { loadModules } from 'esri-loader';
import { message, Button } from 'antd';



import MyBasemap from './MyBasemap';


let EsriSwipe;
let EsriWebTileLayer;
let EsriFeatureLayer;

class MapSwipe extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            LT: "",
            RT: ""
        };

        loadModules(['esri/widgets/Swipe', 'esri/layers/WebTileLayer', 'esri/layers/FeatureLayer'])
            .then(([Swipe, WebTileLayer, FeatureLayer]) => {
                EsriSwipe = Swipe;
                EsriWebTileLayer = WebTileLayer;
                EsriFeatureLayer = FeatureLayer;
            })

    }

    initSwipe = (map, mapView, layersArray) => {
        const rLayers = [];
        const fLayers = [];
        layersArray.forEach(node => {
            const type = node.props.loadType;
            if (type) {
                switch (type) {
                    case "tile":
                        rLayers.push(node)
                        break;
                    case "feature":
                        fLayers.push(node)
                        break;
                    default:
                        break;
                }
            }
        })
        if (rLayers.length === 2) {
            this.setState({
                LT: rLayers[0].props.title,
                RT: rLayers[1].props.title
            })


            const layer1 = new EsriWebTileLayer({
                urlTemplate: rLayers[0].props.layerUrl
            })

            const layer2 = new EsriWebTileLayer({
                urlTemplate: rLayers[1].props.layerUrl
            })

            map.addMany([layer1, layer2])

            const swipe = new EsriSwipe({
                view: mapView,
                leadingLayers: [layer1],
                trailingLayers: [layer2],
                // direction: "vertical", // swipe widget will move from top to bottom of view
                position: 50 // position set to middle of the view (50%)
            });
            mapView.ui.add(swipe)

            fLayers.forEach(fLayer => {
                map.add(new EsriFeatureLayer({ url: fLayer.props.layerUrl, id: fLayer.key }))
            })


        } else {
            message.info("请选择两幅栅格影像")
        }



    }

    render() {
        const heightStyle = 'calc(100vh - 180px)'
        const layerArray = this.props.layersArray
        return (
            <>

                <MyBasemap
                    height={heightStyle}
                    handleLoad={(map, view) => {
                        this.initSwipe(map, view, layerArray)
                    }}
                />
                <Button style={{ position: 'absolute', bottom: 30, right: 12, zIndex: 9 }}
                    onClick={this.handleOpenModal}>{this.state.LT}</Button>
                <Button style={{ position: 'absolute', bottom: 30, left: 12, zIndex: 9 }}
                    onClick={this.handleOpenModal}>{this.state.RT}</Button>


            </>
        )
    }
}

export default MapSwipe;