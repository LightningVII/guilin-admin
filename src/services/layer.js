import request from '@/utils/request';
import { stringify } from 'querystring';

export async function queryLayerTree() {
  return request('/strapi/layer/tree');
}

export async function queryLayerGetLayerUrl(payload) {
  return request(`/strapi/layer/getLayerUrl?${stringify(payload)}`);
}

export async function queryLayerAdd(payload) {
  return request(`/strapi/layer/add`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryLayerUpdate(payload) {
  return request(`/strapi/layer/update`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}

export async function queryLayerDelete(payload) {
  return request(`/strapi/layer/delete`, {
    method: 'POST',
    data: stringify(payload),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;',
    },
  });
}
