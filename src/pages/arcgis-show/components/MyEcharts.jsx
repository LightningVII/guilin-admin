import React, { Component } from 'react';
import echarts from "echarts";
import { mapJson, geoCoordMap } from './xuzhouJSON.js';

const convertData = (data) => {
    const res = [];

    for (let i = 0; i < data.length; i += 1) {
        const geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                value: geoCoord.concat(data[i].value),
                name: data[i].name,
            });
        }
    }
    return res;
};

class LayoutImg extends Component {
    constructor() {
        super();
        this.state = {
            vmData: [
                { name: '贾汪区', value: 180, num: 10 },
                { name: '鼓楼区', value: 124, num: 10 },
                { name: '丰县', value: 104, num: 10 },
                { name: '沛县', value: 114, num: 10 },
                { name: '云龙区', value: 100, num: 10 },
                { name: '泉山区', value: 38, num: 10 },
                { name: '铜山区', value: 71, num: 10 },
                { name: '邳州市', value: 64, num: 10 },
                { name: '新沂市', value: 92, num: 10 },
                { name: '睢宁县', value: 44, num: 10 }
            ]
        }
    }

    componentDidMount() {
        this.initMapDidMount();
    }

    initMapDidMount() {
        echarts.registerMap('xuzhou', mapJson); // 注册地图
        const mapChart = echarts.init(document.getElementById('map'));
        const option = {
            backgroundColor: '#044161',
            title: {
                text: '徐州市变化图斑',
                subtext: '徐州市自然资源局',
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter(params) {      // 格式化鼠标指到点上的弹窗返回的数据格式
                    return `${params.name} : ${params.value[2]}`;
                }
            },
            geo: {         // 地里坐标系组件（相当于每个省块）
                map: 'xuzhou',
                roam: true,      // 是否开启缩放 
                label: {
                    emphasis: {        // 鼠标划到后弹出的文字 显示省份
                        color: '#FF0000',    // 高亮背景色
                        show: false,       // 是否高亮显示
                        fontSize: 12,      // 字体大小
                        // fontWeight: 2
                    }
                },
                itemStyle: {         // 坐标块本身
                    normal: {         // 坐标块默认样式控制
                        areaColor: '#004981',  // 坐标块儿颜色
                        borderColor: '#029FD4',
                        borderWidth:"1.5"
                    },
                    emphasis: {
                        areaColor: 'transparent'  // 放坐标块儿上，块儿颜色
                    }
                }
            },
            series: [
                {
                    name: '信息',   // series名称
                    type: 'effectScatter',    // series图表类型
                    effectType: 'ripple',     // 圆点闪烁样式，目前只支持ripple波纹式
                    coordinateSystem: 'geo',   // series坐标系类型
                    data: convertData(this.state.vmData),// series数据内容
                    showEffectOn: 'emphasis',    // 配置何时显示特效 render 一直显示，emphasis放上去显示
                    symbolSize(val){
                        return val[2] / 10;
                    },
                    rippleEffect: {        // ripple的样式控制
                        brushType: 'stroke',
                        color: '#28FF28',
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true   // 显示位置信息，
                        }
                    },

                    itemStyle: {         // 散点本身显示控制
                        normal: {
                            color: '#28FF28',
                            shadowBlur: 10,
                            shadowColor: '#28FF28'
                        }
                    },
                    zlevel: 1
                }
            ],
            symbolSize: 12,
        }
        if (option && typeof option === "object") {
            mapChart.setOption(option);
        }
    }
    
    render() {
        return (
            // <div className="cloudhost-box">
                <div id="map" style={{ width: '100%', height: 328, mergeLeft: 0 }} />
            // </div>
        );
    }
}

export default LayoutImg;