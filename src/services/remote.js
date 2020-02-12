// import request from '@/utils/request';

export async function queryRemoteData(params) {
  const tableListDataSource = [];
  const initNum = params.pageSize * (params.current - 1) + 1;

  for (let i = initNum; i < initNum + params.pageSize; i += 1) {
    tableListDataSource.push({
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [39495686.3468, 3844021.6481999997],
            [39495695.9362, 3844020.588199999],
            [39495702.0375, 3844017.4178],
            [39495707.265599996, 3844011.08],
            [39495704.6465, 3844002.6338],
            [39495702.0269, 3843993.1317999996],
            [39495706.3809, 3843981.514799999],
            [39495706.3741, 3843965.6761000007],
            [39495704.6227, 3843947.7262999993],
            [39495701.1272, 3843928.7214],
            [39495700.2466, 3843908.6593999993],
            [39495713.3184, 3843895.9827999994],
            [39495724.6498, 3843890.6984],
            [39495723.7725, 3843878.0277999993],
            [39495720.2821, 3843870.6379000004],
            [39495715.0447, 3843855.8574],
            [39495709.810100004, 3843847.4123],
            [39495696.7332, 3843848.4738999996],
            [39495687.1455, 3843853.7576],
            [39495674.9418, 3843857.9866000004],
            [39495664.4799, 3843857.9912],
            [39495655.758, 3843849.547700001],
            [39495647.0411, 3843852.7193],
            [39495645.3058, 3843871.726500001],
            [39495646.185100004, 3843888.6207],
            [39495649.6789, 3843903.4020000007],
            [39495655.7858, 3843912.9025],
            [39495656.6631, 3843925.5731000006],
            [39495653.1893, 3843956.1961000003],
            [39495653.1977, 3843975.2025000006],
            [39495654.0778, 3843994.2085999995],
            [39495661.0583, 3844007.9323999994],
            [39495686.3468, 3844021.6481999997],
          ],
        ],
      },
      properties: {
        QSXDLBM: '20W',
        HSXDLBM: '20F',
        TBBM: 'Y18103220073N01',
        BZ: '',
        'AREA_Ä¶': 13.77135475,
        COUNTY: '沛县',
        LOCATION: '沛城镇',
        MJFJ: 0,
        NMJ: 0,
        CMJ: 0,
        FMJ: 0,
        XFMJ: 0,
        BHQMC: '',
        BHQYMJ: 0,
        BHQNMJ: 0,
        QSX: `20200${i + 1}`,
        HSX: `20200${i + 2}`,
        BHLX: 3,
        ZYGD: '',
        QSXDLMC: '建筑用地（无定着物）',
        HSXDLMC: '建筑用地（有定着物）',
        QSXBHDL: '无定着物建设用地',
        HSXBHDL: '有定着物建设用地',
        SHAPE_AREA: 9181.69485332,
        SHAPE_LEN: 463.391167343,
        BATCH: `2020年第${i + 1}期`,
      },
      key: i,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      name: `TradeCode ${i}`,
      title: `一个任务名称 ${i}`,
      owner: '曲丽丽',
      desc: '这是一段描述',
      callNo: Math.floor(Math.random() * 1000),
      status: Math.floor(Math.random() * 10) % 4,
      // updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
      // createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
      progress: Math.ceil(Math.random() * 100),
    });
  }

  /* return request('/api/rule', {
    params,
  }); */
  return new Promise(resolve => {
    console.log('queryRemoteData', params);
    setTimeout(
      () =>
        resolve({
          totalCount: 100,
          data: tableListDataSource,
        }),
      1000,
    );
  });
}
