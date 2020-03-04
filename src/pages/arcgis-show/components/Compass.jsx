import React from 'react';
import { debounce } from 'lodash';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import style from "./style.css";

class Compass extends React.Component {
    constructor(props) {
        super(props);
        this.setRotateDegree = debounce(this.setRotateDegree, 50);// 防抖函数
        // 设置 initial state
        this.state = {
            rotateDegree: 0
        }
    }

    componentDidMount() {
        this.props.view.watch('rotation', this.setRotateDegree)
    }

    setRotateDegree = newVal => {
        this.setState({
            rotateDegree: newVal,
        })
    }


    rotateLeftDegree = () => {
        this.rotateMap(this.state.rotateDegree - 10);
        this.setState(prevState => ({
            rotateDegree: prevState.rotateDegree - 10,
        }));
    }

    rotateRightDegree = () => {
        this.rotateMap(this.state.rotateDegree + 10);
        this.setState(prevState => ({
            rotateDegree: prevState.rotateDegree + 10,
        }));
    }

    rotateMap = rotateDegree => {
        this.props.view.rotation = rotateDegree;
    }

    zoomIn = () => {
        this.props.view.goTo({
            zoom: this.props.view.zoom + 1
        });
    }

    zoomOut = () => {
        this.props.view.goTo({
            zoom: this.props.view.zoom - 1
        });
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
                            />
                        </div>
                        <div className={style.compassRotateLeft}
                            onClick={() => this.rotateLeftDegree}
                        />
                        <div className={style.compassRotateRight}
                            onClick={() => this.rotateRightDegree}
                        />
                    </div>
                </div>
                <div className={style.zoomStyle}>
                    <Tooltip placement="left" title="放大">
                        <MinusOutlined type="plus" className={style.zoomInStyle} onClick={() => this.zoomIn()} />
                    </Tooltip>
                    <Tooltip placement="left" title="缩小">
                        <PlusOutlined type="minus" className={style.zoomOutStyle} onClick={() => this.zoomOut()} />
                    </Tooltip>
                </div>
            </div >
        );
    }
}

export default Compass;
