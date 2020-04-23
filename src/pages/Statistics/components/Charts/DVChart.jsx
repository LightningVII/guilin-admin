import React, { Component } from 'react';
import DataSet from '@antv/data-set';
import G2 from '@antv/g2';


class DVChart extends Component {
    constructor() {
        super();
        this.state = {
        }
    }


    componentDidMount() {
        if(this.props.data){
            const ds = new DataSet();
            const dv = ds.createView().source(this.props.data);
            dv.transform({
                type: 'map',
                callback(row) {
                    const item = row;
                    item.BHLX = `${item.QSXDLMC} / ${item.HSXDLMC}`;
                    return item;
                }
            });
    
            dv.transform({
                type: 'rename',
                map: {
                    new: '新增',
                    total: '总计'
                }
            });
    
            dv.transform({
                type: 'fold',
                fields: ['总计', '新增'], // 展开字段集
                key: '变化类型', // key字段
                value: '类型数量', // value字段
                retains: ['BHLX'] // 保留字段集，默认为除fields以外的所有字段
            });
    
            const chart = new G2.Chart({
                container: 'bhlxContainer',
                forceFit: true,
                padding: 'auto',
                height: 328
            });
            chart.source(dv);
            chart.coord().transpose();
            chart.axis(('BHLX'), {
                label: null
            });
            chart.intervalStack().position('BHLX*类型数量').color('变化类型');
            chart.render();
        }
    }

    render() {
        return (
            <div id="bhlxContainer" />
        );
    }

}

export default DVChart;

