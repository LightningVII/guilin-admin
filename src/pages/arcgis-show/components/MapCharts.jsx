import React, { Component } from 'react';
import DataSet from '@antv/data-set';
import G2 from '@antv/g2';
import { connect } from 'dva';
import { mapJson } from './json/xuzhouJSON';


class LayoutImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const chart = new G2.Chart({
            container: 'container',
            forceFit: true,
            height: 328,
            padding: [10, '20%'],
        });

        chart.scale({
            x: { sync: true, nice: false },
            y: { sync: true, nice: false }
        });
        chart.coord().reflect();
        chart.legend(false);
        chart.axis(false);
        chart.tooltip({
            showTitle: false,
            containerTpl: '<div class="g2-tooltip"><table class="g2-tooltip-list"></table></div>',
            itemTpl: '<tr data-index="{index}"><td style="padding:5px;">{name}</td><td style="padding:5px;">{value}</td></tr>'
        });

        const { dispatch } = this.props;
        dispatch({
            type: 'remoteSensing/fetchChangespotTBCount'
        }).then(res => {
            if (res.code === 200)
                this.renderChart(chart, res.content)
        });
    }


    renderChart = (chart, data) => {
        const ds = new DataSet();
        const dv = ds.createView('back')
            .source(mapJson, {
                type: 'GeoJSON'
            })
            .transform({
                type: 'geo.projection',
                projection: 'geoMercator',
                as: ['x', 'y', 'centroidX', 'centroidY']
            });
        const bgView = chart.view();
        bgView.source(dv);
        bgView.tooltip(false);
        bgView.polygon()
            .position('x*y')
            .style({
                fill: '#EAEAEA',
                stroke: '#BABABA',
                lineWidth: 1.2,
                fillOpacity: 0.8
            });


        const userData = ds.createView().source(data);

        userData.transform({
            type: 'map',
            callback: obj => {
                const projectedCoord = dv.geoProjectPosition([obj.LNG, obj.LAT], 'geoMercator');
                const objData = {
                    x: projectedCoord[0],
                    y: projectedCoord[1],
                    区县: obj.COUNTY,
                    图斑数量: `${obj.TASKNUM}个`,
                    图斑面积: `${obj.AREA.toFixed(2)}亩`
                }
                return objData;
            }
        });
        const pointView = chart.view();
        pointView.source(userData);
        pointView.point()
            .position('x*y')
            .size('图斑数量', [10, 20])
            .shape('circle')
            .color('#38A1FF')
            .tooltip('区县*图斑数量*图斑面积');
        chart.render();
    }

    render() {
        return (
            <div id="container" style={{ height: 328 }}/>
        );
    }

}
export default connect(({ remoteSensing }) => ({
    tbcount: remoteSensing.tbcount
}))(LayoutImg);




