import React from 'react';
import { Icon, Tooltip } from 'antd';
import style from "./style.css";

class Compass extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            rotateDegree: 0
        };

        this.RotateLeftDegree = this.RotateLeftDegree.bind(this);
        this.RotateRightDegree = this.RotateRightDegree.bind(this);
    }

    RotateLeftDegree() {
        this.setState(prevState => ({
            rotateDegree: prevState.rotateDegree - 10,
        }));
        this.RotateMap();
    }

    RotateRightDegree() {
        this.setState(prevState => ({
            rotateDegree: prevState.rotateDegree + 10,
        }));
    }

    RotateMap(){
        this.props.view.rotation=this.state.rotateDegree;
    }

    render() {

        return (
            <div style={{ width: 64, height: "auto" }}>
                <div style={{ transform: "scale(0.35)" }}>
                    <div className={style.compassStyle}>
                        <div className={style.compassClockStyle}>
                            <div className={style.compassPointerStyle}
                                style={{
                                    transform: `rotate(${this.state.rotateDegree}deg)`
                                }}
                            ></div>
                        </div>
                        <div className={style.compassRotateLeft}
                            onClick={this.RotateLeftDegree}
                        >

                        </div>
                        <div className={style.compassRotateRight}
                            onClick={this.RotateRightDegree}
                        >

                        </div>

                    </div>
                </div>
                <div className={style.zoomStyle}>
                    <Tooltip placement="left" title="放大">
                        <Icon type="plus" className={style.zoomInStyle} />
                    </Tooltip>
                    <Tooltip placement="left" title="缩小">
                        <Icon type="minus" className={style.zoomOutStyle} />
                    </Tooltip>
                </div>
            </div >
        );
    }
}

export default Compass;