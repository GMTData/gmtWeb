import request from '@/utils/request';
//热门股票
export async function queryHotStock(params) {
    return request(`${PATH}/host/stock?stockType=${params.stockType}`, {
        method: 'get',
        headers: { 'accessToken': params.accessToken },
    });
}
//热门新闻
export async function queryHotNews(params) {
    return request(`${PATH}/news/getTopNews?size=${params.size}`, {
        method: 'get',
        headers: { 'accessToken': params.accessToken },
    });
}
//轮播图
export async function queryBanner(params) {
    return request(`${PATH}/banner/queryByPosition?position=${params.position}`, {
        method: 'get',
        headers: { 'accessToken': params.accessToken },
    });
}

//查询RIC数据
export async function queryRicLists(params) {
    return request(`${PATH}/ric/queryByRic?ric=${params.ric}&pageSize=${params.pageSize}&page=${params.page}`, {
        method: 'get',
        headers: { 'accessToken': params.accessToken },
    });
}