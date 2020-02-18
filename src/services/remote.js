// import request from '@/utils/request';
import remoteSensing from '@/constants/remoteSensing';

export async function queryRemoteData(params) {
  console.log('queryRemoteData', params);
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          totalCount: 100,
          data: remoteSensing.features,
        }),
      1000,
    ),
  );
}
