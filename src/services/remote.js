// import request from '@/utils/request';

export async function queryRemoteData(params) {
  const tableListDataSource = [];
  const initNum = params.pageSize * (params.current - 1) + 1;

  for (let i = initNum; i < initNum + params.pageSize; i += 1) {
    tableListDataSource.push({
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
