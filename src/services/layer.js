import request from '@/utils/request';
import { stringify } from 'querystring';

export async function queryLayerTree() {
  return request('/strapi/layer/tree');
}

export async function queryLayerGetLayerUrl(payload) {
  return request(`/strapi/layer/getLayerUrl?${stringify(payload)}`);
}
