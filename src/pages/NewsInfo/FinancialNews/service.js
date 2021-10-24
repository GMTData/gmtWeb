import request from '@/utils/request';
//默认一二级分类
export async function queryClassList(params) {
  return request(`${PATH}/classes/defaultClasses?language=${params.language}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询分类
export async function queryByParentId(params) {
  return request(`${PATH}/classes/queryByParentId?parentId=${params.parentId}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//查询新闻列表
export async function queryNewsList(params) {
  return request(`${PATH}/news/titleList?classId=${params.classId}&size=${params.size}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
//新闻详情接口
export async function queryNewsInfo(params) {
  return request(`${PATH}/news/details?newsId=${params.newsId}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}

//收藏新增接口
export async function collectionAdd(params) {
  let formData = new FormData();
  formData.append('ric', params.ric);
  formData.append('id', params.id);
  formData.append('dcn', params.dcn);
  formData.append('size', params.size);
  formData.append('fileName', params.fileName);
  formData.append('fileType', params.fileType);
  formData.append('publicDate', params.publicDate);
  formData.append('noticeDate', params.noticeDate);
  formData.append('userId', params.userId);
  formData.append('type', params.type);
  return request(`${PATH}/collection/insert`, {
    method: 'post',
    headers: { 'accessToken': params.accessToken, "Content-Type": "application/json" },
    data: JSON.stringify(params)
  });
}

//查询收藏新闻
export async function queryCollectionByUserId(params) {
  return request(`${PATH}/collection/queryByUserId?userId=${params.userId}&type=${params.type}`, {
    method: 'get',
    headers: { 'accessToken': params.accessToken },
  });
}
