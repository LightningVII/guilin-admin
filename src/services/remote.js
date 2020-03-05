import request from '@/utils/request';
import { stringify } from 'querystring';
import { TabsEnum } from '@/constants/basicEnum';

export async function queryRemoteData(params) {
  const status = TabsEnum.map(({ tab }) => tab).indexOf(params.status);
  if (status > 0) {
    params.status = status - 1;
  } else {
    delete params.status;
  }

  const payload = {
    pageSize: params.pageSize,
    pageNum: params.current,
    term: params.keywords,
    startTime: params.rangePickerValue[0].format('YYYY-MM-DD'),
    endTime: params.rangePickerValue[1].format('YYYY-MM-DD'),
    userid: params.userid,
    state: params.status,
  };

  // if (!payload.status) delete payload.status;
  console.log('queryRemoteData', payload);

  return request(`/strapi/changespot/list?${stringify(payload)}`);
}

export async function queryChangespotIssue(params) {
  return request(`/strapi/changespot/issue`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryChangespotApproval(params) {
  return request(`/strapi/changespot/approval`, {
    method: 'POST',
    data: stringify(params),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryRemoteSensingDetail(tbbm) {
  return request(`/strapi/changespot/info?${stringify(tbbm)}`);
}

export async function queryChangespotFuzzyQuery(term) {
  return request(`/strapi/changespot/fuzzyQuery?${stringify(term)}`);
}

export async function queryChangespotGeomotry(tbbm) {
  return request(`/strapi/changespot/geomotry?${stringify(tbbm)}`);
}
