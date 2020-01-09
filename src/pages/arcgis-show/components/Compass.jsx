import React from 'react';
import { Icon, Tooltip } from 'antd';
import compassLogo from "../../../../public/compass/ctb.png"

const compassStyle = {
    width: 184,
    height: 184,
    borderRadius: 50,
    backgroundImage: `url(${compassLogo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-44px -60px",
}

const compassClockStyle = {
    position: "absolute",
    width: 96,
    height: 96,
    top: 92,
    left: 92,
    margin: -48,
    zIndex: 0,
    backgroundImage: `url(${compassLogo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-462px -52px",
}

const compassRotateLeft = {
    position: "absolute",
    width: 42,
    height: 104,
    top: 38,
    left: 4,
    zIndex: 0,
    backgroundImage: `url(${compassLogo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-603px -154px",
}


const compassRotateRight = {
    position: "absolute",
    width: 42,
    height: 104,
    top: 38,
    zIndex: 0,
    backgroundImage: `url(${compassLogo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-603px -154px",
    left: 134,
    transform: "rotateY(180deg)"
}

const compassPointerStyle = {
    position: "absolute",
    width: 60,
    height: 96,
    left: 18,
    border: "none",
    zIndex: 2,
    backgroundImage: `url(${compassLogo})`,
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


    }

    render() {
        return (
            <div style={{ width: 64, height: "auto" }}>
                <div style={{ transform: "scale(0.35)" }}>
                    <div style={compassStyle}>
                        <div style={compassClockStyle}>
                            <div style={compassPointerStyle}></div>
                        </div>
                        <div style={compassRotateLeft}>

                        </div>
                        <div style={compassRotateRight}>

                        </div>

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