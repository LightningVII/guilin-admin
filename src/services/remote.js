import request from '@/utils/request';
import { stringify as str } from 'querystring';
import { TabsEnum } from '@/constants/basicEnum';

export async function queryRemoteData(payload) {
  const status = TabsEnum.map(({ tab }) => tab).indexOf(payload.status);
  if (status > 0) payload.status = status - 1;
  else delete payload.status;

  const params = {
    pageSize: payload.pageSize,
    pageNum: payload.current,
    term: payload.keywords,
    startTime: payload.rangePickerValue[0].format('YYYY-MM-DD'),
    endTime: payload.rangePickerValue[1].format('YYYY-MM-DD'),
    userid: payload.userid,
    state: payload.status,
  };

  return request('/strapi/changespot/list', { params });
}

export const querySpotIssue = async params =>
  request.post('/strapi/changespot/issue', { data: str(params) });

export const querySpotApproval = async params =>
  request.post(`/strapi/changespot/approval`, { data: str(params) });

export const queryRemoteSensingDetail = async params =>
  request('/strapi/changespot/info', { params });

export const querySpotFuzzyQuery = async params =>
  request('/strapi/changespot/fuzzyQuery', { params });

export const querySpotGeomotry = async params => request('/strapi/changespot/geomotry', { params });

export const querySpotTBCount = async params => request('/strapi/changespot/tbcount', { params });

export const querySpotBZTTJ = async params => request('/strapi/changespot/bzttj', { params });

export const querySpotGeoJson = async params => request('/strapi/changespot/geojson', { params });
