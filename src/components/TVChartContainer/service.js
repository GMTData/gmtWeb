import request from '@/utils/request';
//是否有获取股价的权限
export async function queryStockAuthorize(params) {
    return request(`${PATH}/f106/getStockAuthorize?ric=${params.ric}`, {
        method: 'get',
        headers: { 'accessToken': params.accessToken },
    });
}
//从同花顺中获取数据
export async function queryInterdayTH(params) {
    return request(`${PATH}/f106/getInterdayTH?ric=${params.ric}&startTime=${params.startTime}&endTime=${params.endTime}&period=${params.period}`, {
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