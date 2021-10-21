import request from '@/utils/request';

//查询出金记录
export async function getWithdrawList(params) {
    return request(`${PATH}/v2/adminor/getWithdrawList?keyWord=${params.keyWord}&pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`, {
        method: 'get',
        headers: { 'accessToken': params.accessToken },
    });
}
//修改密码
export async function changePassword(params) {
    let formData = new FormData();
    formData.append('info', params.info);
    formData.append('oldPassword', params.oldPassword);
    formData.append('newPassword', params.newPassword);
    return request(`${PATH}/userInfo/changePassword`, {
        method: 'post',
        data: formData,
        headers: { 'accessToken': params.accessToken, },
    });
}
/**分佣的接口 */

export async function commissionList(params, options) {
    return request(`${PATH}/commission/list?id=${params.id}&pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`, {
        method: 'GET',
        headers: { 'accessToken': params.accessToken, },
        ...(options || {}),
    });
}

/**购买记录 */

export async function purchaseRecord(params, options) {
    return request(`${PATH}/v2/user/purchaseRecord?userId=${params.userId}&recommand=${params.recommand}&pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`, {
        method: 'GET',
        headers: { 'accessToken': params.accessToken, },
        ...(options || {}),
    });
}

//产品查询
export async function productList(params, options) {
    return request(`${PATH}/v2/product/query?superiorRecommendationCode=${params.code}&userId=${params.userId}`, {
        method: 'GET',
        headers: { 'accessToken': params.accessToken, },
        ...(options || {}),
    });
}


/**1.应付金额接口 */

export async function calPayMoney(params, options) {
    return request(`${PATH}/institution/calPayMoney?recommandCode=${params.recommandCode}&userId=${params.userId}&productUnqiueIdentification=${params.productUnqiueIdentification}`, {
        method: 'GET',
        headers: { 'accessToken': params.accessToken, },
        ...(options || {}),
    });
}


/**2.生成订单接口 */
export async function generateOrder(params, options) {
    let dataParams = {
        orderNo: params.orderNo,
        payTime: params.payTime,
        money: params.money,
        userId: params.userId,
        recommandCode: params.recommandCode,
        superiorRecommandCode: params.superiorRecommandCode,
        uniqueIdentification: params.uniqueIdentification,
        productName: params.productName,
        payType: params.payType,
        paymentVoucherUrl: params.paymentVoucherUrl,
    }
    return request(`${PATH}/institution/generateOrder`, {
        method: 'POST',
        headers: { 'accessToken': params.accessToken, },
        data: dataParams,
        ...(options || {}),
    });
}

/**.提交资料 */
export async function insertDatum(params, options) {
    let dataParams = {
        realName: params.realName,
        usdLink: params.usdLink,
        prCode: params.prCode,
        identityCardUrlPositive: params.identityCardUrlPositive,
        identityCardUrlReverse: params.identityCardUrlReverse,
        userId: params.userId,
        country: params.country,
        identityNumber: params.identityNumber
    }
    return request(`${PATH}/v2/adminor/insertDatum`, {
        method: 'POST',
        headers: { 'accessToken': params.accessToken, },
        data: dataParams,
        ...(options || {}),
    });
}

/**.提交 出金申请*/
export async function insertWithdraw(params, options) {
    let dataParams = {
        realName: params.realName,
        account: params.account,
        cashAmount: params.cashAmount,
        usdLink: params.usdLink,
        remark: params.remark,
        qrCode: params.qrCode,
        userId: params.userId,
        payType: params.payType
    }
    return request(`${PATH}/v2/adminor/insertWithdraw`, {
        method: 'POST',
        headers: { 'accessToken': params.accessToken, },
        data: dataParams,
        ...(options || {}),
    });
}

//获取余额
export async function getBlance(params, options) {
    return request(`${PATH}/v2/adminor/getBlance?userId=${params.userId}`, {
        method: 'GET',
        headers: { 'accessToken': params.accessToken, },
        ...(options || {}),
    });
}

//个人信息接口
export async function getUserInfo(params, options) {
    return request(`${PATH}/userInfo/getUserInfo/?recommandCode=${params.recommendationCode}`, {
        method: 'GET',
        headers: { 'accessToken': params.accessToken, },
        ...(options || {}),
    });
}
/**
 * 2.会员修改
 */
export async function infoUpdate(params, token, options) {

    return request(`${PATH}/v2/user/update`, {
        method: 'POST',
        data: params,
        headers: { 'accessToken': token, },
        ...(options || {}),
    });
}

//手机号验证码
export async function getFakeCaptcha(mobile) {
    return request(`${PATH}/sms/send?phone=${mobile}`);
}
//邮箱验证码
export async function getEmailCode(email) {
    return request(`${PATH}/email/send?email=${email}`);
}
