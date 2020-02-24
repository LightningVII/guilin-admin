import React from 'react';
import { Button } from 'antd';


class MapBottom extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            X: "117.1423",
            Y: "34.2133",
            zoom: "8"
        };


    }

    componentDidMount() {
        this.getXY();
    }

    getXY = () => {
        this.props.mapView.on('pointer-move', evt => {
            const point = this.props.mapView.toMap({ x: evt.x, y: evt.y });
            this.setState({
                X: point.longitude.toFixed(4),
                Y: point.latitude.toFixed(4),
                zoom: this.props.mapView.zoom
            })
        })
    }

    render() {


        return (
            <>

                <div style={{ textAlign: 'right', marginRight: 200 }}>
                    经度:{this.state.X} &#12288; 纬度:{this.state.Y} &#12288;级别:{this.state.zoom} &#12288;
                    底图: <Button size='small' style={{height:'20px',fontSize:12}}>天地图街道图</Button>
                </div>


            </>
        )
    }
}

export default MapBottom;