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
        // const data = [
        //     { BHLX: '变化类型1', QSXDLMC: '农用地', HSXDLMC: '建设用地', total: 23, new: 2 },
        //     { BHLX: '变化类型2', QSXDLMC: '未利用地', HSXDLMC: '建设用地', total: 30, new: 3 },
        //     { BHLX: '变化类型3', QSXDLMC: '建设用地（无定着物）', HSXDLMC: '建设用地（有定着物）', total: 13, new: 4 },
        //     { BHLX: '变化类型4', QSXDLMC: '建设用地（有定着物）', HSXDLMC: '建设用地（定着物发生变化）', total: 32, new: 12 },
        //     { BHLX: '变化类型5', QSXDLMC: '建设用地（有定着物）', HSXDLMC: '建设用地（无定着物）', total: 43, new: 14 },
        //     { BHLX: '变化类型6', QSXDLMC: '建设用地', HSXDLMC: '农用地', total: 54, new: 12 },
        //     { BHLX: '变化类型7', QSXDLMC: '未利用地', HSXDLMC: '农用地', total: 32, new: 20 },
        //     { BHLX: '变化类型8', QSXDLMC: '农用地', HSXDLMC: '未利用地', total: 23, new: 6 },
        //     { BHLX: '变化类型9', QSXDLMC: '其他', HSXDLMC: '其他', total: 54, new: 9 }
        // ];

        const data = [
            { "HSXDLMC": "建设用地", "new": 1, "total": 1, "QSXDLMC": "农用地", "BHLX": "1" },
            { "HSXDLMC": "建设用地", "new": 7, "total": 7, "QSXDLMC": "未利用地", "BHLX": "2" },
            { "HSXDLMC": "建设用地（有定着物）", "new": 11, "total": 11, "QSXDLMC": "建设用地（无定着物）", "BHLX": "3" },
            { "HSXDLMC": "建设用地（定着物变化）", "new": 3, "total": 3, "QSXDLMC": "建设用地（有定着物）", "BHLX": "4" }
        ]

        const ds = new DataSet();
        const dv = ds.createView().source(data);
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
            fields: ['总计','新增'], // 展开字段集
            key: '变化类型', // key字段
            value: '类型数量', // value字段
            retains: ['BHLX'] // 保留字段集，默认为除fields以外的所有字段
        });

        const chart = new G2.Chart({
            container: 'bhlxContainer',
            forceFit: true,
            padding: [20,20,60,20],
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

    render() {
        return (
            <div id="bhlxContainer" />
        );
    }

}

export default DVChart;

