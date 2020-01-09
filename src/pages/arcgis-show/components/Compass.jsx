import React from 'react';
import { Icon, Tooltip } from 'antd';
// import logo from "../../../../public/favicon.png"

const compassStyle = {
    width: 184,
    height: 184,
    borderRadius: 50,
    backgroundImage: `url(https://webapi.amap.com/theme/v1.3/controlbar/ctb.png)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-44px -60px",
}

const compassPointerStyle = {
    position: "absolute",
    width: 60,
    height: 96,
    top: 46,
    left: 60,
    border: "none",
    zIndex: 2,
    backgroundImage: `url(https://webapi.amap.com/theme/v1.3/controlbar/ctb.png)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-562px -52px",
}

const zoomStyle = {
    width: "29px",
    height: "73px",
    marginTop: "-38px",
    marginLeft: "38px",
    textAlign: "center",
    padding: "0 2px",
    background: "#fff",
    borderRadius: "3px"
}

const zoomInStyle = {
    width: "24px",
    height: "36px",
    margin: " 0 auto",
    padding: "10px 0",
    cursor: "pointer",
    borderBottom: "1px #dfdfdf solid",
}

const zoomOutStyle = {
    width: "24px",
    height: "36px",
    margin: " 0 auto",
    padding: "10px 0",
    cursor: "pointer"
}

class Compass extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {

        };

        // 这个绑定是必要的，使`this`在回调中起作用

    }

    render() {
        return (
            <div style={{ width: 64, height: "auto" }}>
                <div style={{ transform: "scale(0.35)" }}>
                    <div style={compassStyle}>
                        <div style={compassPointerStyle}></div>
                    </div>
                </div>
                <div style={zoomStyle}>
                    <Tooltip placement="left" title="放大">
                        <Icon type="plus" style={zoomInStyle} />
                    </Tooltip>
                    <Tooltip placement="left" title="缩小">
                        <Icon type="minus" style={zoomOutStyle} />
                    </Tooltip>
                </div>
            </div >
        );
    }
}

export default Compass;