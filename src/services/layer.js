import request from '@/utils/request';
import { stringify as str } from 'querystring';

export const queryLayerTree = async () => request('/strapi/layer/tree');

export const queryLayerGetLayerUrl = async params =>
  request('/strapi/layer/getLayerUrl', { params });

export const queryLayerAdd = async payload =>
  request.post('/strapi/layer/add', { data: str(payload) });

export const queryLayerUpdate = async payload =>
  request.post('/strapi/layer/update', { data: str(payload) });

export const queryLayerDelete = async payload =>
  request.post('/strapi/layer/delete', { data: str(payload) });
