import React from 'react';
import {Icon } from 'antd';

const compassStyle={
    width:"60px",
    height:"60px",
    backgroundColor:"#CCC",
    borderRadius:"50%"
}

const zoomStyle={
    width: "29px",
    height: "73px",
    marginTop:"16px",
    marginLeft:"16px",
    textAlign:"center",
    padding: "0 2px",
    background: "#fff",
    borderRadius: "3px"
}

const zoomInStyle={
    width: "24px",
    height: "36px",
    margin:" 0 auto",
    padding: "10px 0",
    cursor: "pointer",
    borderBottom: "1px #dfdfdf solid",
}

const zoomOutStyle={
    width: "24px",
    height: "36px",
    margin:" 0 auto",
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
            <div style={{width:40,height:"auto"}}>
                <div style={compassStyle}>

                </div>
                <div style={zoomStyle}>

                    <Icon type="plus" style={zoomInStyle}/>
                    <Icon type="minus" style={zoomOutStyle}/>
      
                </div>
            </div>
        );
    }
}

export default Compass;