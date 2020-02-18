import React from 'react';
import { loadModules } from 'esri-loader';
import { Button, Divider, Icon } from 'antd';
import style from "./style.css";


let EsriSwipe;


class MapSwipe extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
         
        };

        loadModules(['esri/widgets/Swipe'])
            .then(([Swipe]) => {
                EsriSwipe = Swipe;
            })

    }

    



    render() {
        return (
            <>
                {/* <Card size="small" title="选择测量工具" extra={<a href="#" onClick={this.closeCompents}>X</a>} style={{ width: 300 ,visibility:this.props.showMeasure2?'visible':'hidden'}}> */}
                    <Button className={style.measureBtn} onClick={this.lineMeasure}><Icon type="line" /> 线测量</Button>
                    <Button className={style.measureBtn} onClick={this.areaMeasure}><Icon type="border" /> 面测量</Button>
                    {/* <Divider type="vertical"  style={{margin:"0px 5px",height:"2.5em"}}/> */}
                    <div style={{ float: "left" }}><Divider type="vertical" style={{ margin: 5, height: 18 }} /></div>
                    <Button className={style.measureBtn} onClick={this.destroyWidget}><Icon type="delete" /> 清除</Button>
                {/* </Card> */}
            </>
        )
    }
}

export default MapSwipe;