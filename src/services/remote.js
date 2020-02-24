import request from '@/utils/request';
import { stringify } from 'querystring';
import { TabsEnum } from '@/constants/basicEnum';

// import remoteSensing from '@/constants/remoteSensing';

export async function queryRemoteData(params) {
  console.log('object', params);
  const status = TabsEnum.map(({ tab }) => tab).indexOf(params.status);
  if (status > 0) {
    params.status = status - 1;
  } else {
    delete params.status;
  }
  console.log('object', params);
  return request(
    `http://qs.vipgz4.idcfengye.com/changespot/list?${stringify({
      userId: '1',
    })}`,
  );

  // console.log('queryRemoteData', params);
  // return new Promise(resolve =>
  //   setTimeout(
  //     () =>
  //       resolve({
  //         totalCount: 100,
  //         data: remoteSensing.features,
  //       }),
  //     1000,
  //   ),
  // );
}
