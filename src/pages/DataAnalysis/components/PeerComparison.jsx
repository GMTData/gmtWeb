import { Spin, Table, message, Select, Row, Col } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryRatiosReport, queryValueData, getIndustryType, queryFinancialReport } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { sortArray } from '@/utils/utils';

const { Option } = Select;
const titleYearCn = '(年报)';
const titleYearEn = '(annual report)';
const oneYear = new Date().getFullYear() - 1;
const twoYear = new Date().getFullYear() - 2;
const threeYear = new Date().getFullYear() - 3;
const fourYear = new Date().getFullYear() - 4;
const PeerComparison = (props) => {
    const { keyType, ric, allData } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [pageState, setPageState] = useState(1);
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    //估值分析比较
    let params = {
        industryType: '',
        accessToken: userInfo.accessToken
    }
    //市场表现比较参数  
    let marketParams = {
        industryType: '',
        accessToken: userInfo.accessToken
    }
    //行业分类接口
    let industryParams = {
        pageSize: 100,
        pageNumber: 1,
        accessToken: userInfo.accessToken
    }
    //财务比率和财务数据比较
    let reportParams = {
        industryType: '',
        timeType: 'Annual',
        accessToken: userInfo.accessToken
    }
    /** 国际化配置 */
    const intl = useIntl();

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 801) {
                setOneInfoTitle('财务比率比较');
                changeTitleRatio(SALEM)
            } else if (keyType && keyType == 802) {
                setOneInfoTitle('财务数据比较');
                changeTitle(RTLR);
            } else if (keyType && keyType == 803) {
                setOneInfoTitle('估值分析比较');
            } else if ((keyType && keyType == 804) || keyType == 0) {
                setOneInfoTitle('市场表现比较');
            } else if (keyType && keyType == 805) {
                setOneInfoTitle('盈利预测比较');
            }
        } else {
            if (keyType && keyType == 801) {
                setOneInfoTitle('Financial ratio comparison');
                changeTitleRatio(SALEM)
            } else if (keyType && keyType == 802) {
                changeTitle(RTLR);
                setOneInfoTitle('Comparison of financial data');
            } else if (keyType && keyType == 803) {
                setOneInfoTitle('Valuation analysis and comparison');
            } else if ((keyType && keyType == 804) || keyType == 0) {
                setOneInfoTitle('Market performance comparison');
            } else if (keyType && keyType == 805) {
                setOneInfoTitle('Comparison of Profit Forecasts');
            }
        }

        //行业分类数据
        getIndustryType(industryParams).then(
            res => {
                if (res.state) {
                    setIndustryState(res.data ? res.data.result : [])
                    if (keyType == 801 || keyType == 802) {
                        getFinancialReport(res.data.result[0].rcsQcode);
                    } else if (keyType == 803) {
                        getValueData(res.data.result[0].rcsQcode)
                    } else if (keyType == 804 || keyType == 0) {
                        getRatiosReport(res.data.result[0].rcsQcode);
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }, [keyType]);

    //监测ric查询结果的变化
    useEffect(() => {

    }, [allData]);

    const [industryState, setIndustryState] = useState([]);
    //行业分类数据
    const getIndustryTypeData = (page) => {
        industryParams.pageNumber = page ? page : 1;
        getIndustryType(industryParams).then(
            res => {
                if (res.state) {
                    setIndustryState(res.data ? res.data.result : [])
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [marketState, setMarketState] = useState({});
    const [companyName, setCompanyName] = useState({});//公司名称集合
    //市场表现
    const getRatiosReport = (industryType) => {
        marketParams.industryType = industryType;
        queryRatiosReport(marketParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        //AASTTURN    总资产周转率(次)
                        setCompanyName(res.data.names ? res.data.names : {})
                        setMarketState(res.data.ratiosReport ? res.data.ratiosReport : {})
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [financialState, setFinancialState] = useState({});
    const [financialName, setFinancialName] = useState({});
    //财务比率和财务数据比较
    const getFinancialReport = (industryType) => {
        reportParams.industryType = industryType;
        queryFinancialReport(reportParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setFinancialName(res.data.names ? res.data.names : {})
                        if (res.data.financialStatements) {
                            Object.keys(res.data.financialStatements).map((fs) => {
                                let financialArray = [];
                                Object.keys(res.data.financialStatements[fs]).map((v) => {
                                    let RTLR = 0;
                                    let SCOR = 0;
                                    let LTLL = 0;
                                    let LMIN = 0;
                                    let QTLE = 0;
                                    let CIAC = 0;
                                    let ATOT = 0;
                                    let SOPI = 0;
                                    res.data.financialStatements[fs][v].map((y) => {
                                        y.lineItemObject.map((l) => {
                                            if (l.coaCode == 'SCOR') {
                                                SCOR = l.Value;
                                            }
                                            if (l.coaCode == 'RTLR') {
                                                RTLR = l.Value;
                                            }
                                            if (l.coaCode == 'LTLL') {
                                                LTLL = l.Value;
                                            }
                                            if (l.coaCode == 'LMIN') {
                                                LMIN = l.Value;
                                            }
                                            if (l.coaCode == 'QTLE') {
                                                QTLE = l.Value;
                                            }
                                            if (l.coaCode == 'CIAC') {
                                                CIAC = l.Value;
                                            }
                                            if (l.coaCode == 'ATOT') {
                                                ATOT = l.Value;
                                            }
                                            if (l.coaCode == 'SOPI') {
                                                SOPI = l.Value;
                                            }
                                        })

                                    })
                                    let saleMargin = RTLR != 0 ? eval((SCOR - RTLR) / RTLR) * 100 : 0;//销售毛利率
                                    let roe = QTLE != 0 || LMIN != 0 ? eval(CIAC / (QTLE + LMIN)) * 100 : 0;//ROE
                                    let roa = ATOT != 0 ? eval(CIAC / ATOT) * 100 : 0;//ROA
                                    let operatingProfitMargin = RTLR != 0 ? eval(SOPI / RTLR) * 100 : 0;//营业利润率
                                    let assetsLiabilities = ATOT != 0 ? eval(LTLL / ATOT) * 100 : 0;//资产负债率
                                    let ltllLmin = eval(LTLL - LMIN);//总负债
                                    let qtleLmin = eval(QTLE + LMIN);//股东权益
                                    let contrastData = {}
                                    //财务比率
                                    if (saleMargin) {
                                        contrastData.saleMargin = saleMargin.toFixed(2) + '%';
                                    } else {
                                        contrastData.saleMargin = 0;
                                    }
                                    if (roe) {
                                        contrastData.roe = roe.toFixed(2) + '%';
                                    } else {
                                        contrastData.roe = 0;
                                    }
                                    if (roa) {
                                        contrastData.roa = roa.toFixed(2) + '%';
                                    } else {
                                        contrastData.roa = 0;
                                    }
                                    if (operatingProfitMargin) {
                                        contrastData.operatingProfitMargin = operatingProfitMargin.toFixed(2) + '%';
                                    } else {
                                        contrastData.operatingProfitMargin = 0;
                                    }
                                    if (assetsLiabilities) {
                                        contrastData.assetsLiabilities = assetsLiabilities.toFixed(2) + '%';
                                    } else {
                                        contrastData.assetsLiabilities = 0;
                                    }
                                    //财务数据
                                    if (ltllLmin) {
                                        contrastData.ltllLmin = ltllLmin.toFixed(2);
                                    } else {
                                        contrastData.ltllLmin = 0;
                                    }
                                    if (qtleLmin) {
                                        contrastData.qtleLmin = qtleLmin.toFixed(2);
                                    } else {
                                        contrastData.qtleLmin = 0;
                                    }
                                    financialArray.push({ year: v, contrastData: contrastData, financial: res.data.financialStatements[fs][v] })
                                })
                                res.data.financialStatements[fs] = financialArray.sort(sortArray('year')).reverse();
                            })
                            setFinancialState(res.data.financialStatements ? res.data.financialStatements : {})
                        }
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [valuation, setValuation] = useState([]);//估值分析数据
    const [valuationName, setValuationName] = useState({});
    //估值分析
    const getValueData = (industryType) => {
        params.industryType = industryType;
        queryValueData(params).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setValuationName(res.data.names ? res.data.names : [])
                        setValuation(res.data.valueData ? res.data.valueData : [])
                    }
                } else {
                    message.error(res.message);
                }
            }
        );
    }

    const companyScroll = (e) => {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            const scrollPage = pageState;
            const nextScrollPage = scrollPage + 1;
            setPageState(nextScrollPage);
            getIndustryTypeData(nextScrollPage); // 调用api方法
        }
    };

    //根据选择的行业查询对应数据
    const getDataInfo = (e) => {
        if (keyType == 801 || keyType == 802) {
            getFinancialReport(e);
        } else if (keyType == 803) {
            getValueData(e)
        } else if (keyType == 804 || keyType == 0) {
            getRatiosReport(e);
        }
    }

    //财务比率
    const SALEM = 'SALEM';//销售毛利率
    const ROE = 'ROE';//ROE
    const ROA = 'ROA';//ROA
    const OPM = 'OPM';//营业利润率
    const AL = 'AL';//资产负债率
    const AASTTURN = 'AASTTURN';//总资产周转率(次)
    const [titleTypeRatio, setTitleTypeRatio] = useState('销售毛利率GPM(%)')
    const [valueTypeRatio, setValueTypeRatio] = useState('SALEM')
    //选择类别的操作
    const getIndicatorsRatio = (e) => {
        setValueTypeRatio(e)
        changeTitleRatio(e)
    }
    //类别的名称切换
    const changeTitleRatio = (e) => {
        if (intl.locale === "zh-CN") {
            if (e == SALEM) {
                setTitleTypeRatio('销售毛利率GPM(%)');
            } else if (e == ROE) {
                setTitleTypeRatio('净资产收益率ROE(%)');
            } else if (e == ROA) {
                setTitleTypeRatio('资产收益率ROA(%)');
            } else if (e == OPM) {
                setTitleTypeRatio('营业利润率OPR(%)');
            } else if (e == AL) {
                setTitleTypeRatio('资产负债率LOAR(%)');
            } else if (e == AASTTURN) {
                setTitleTypeRatio('总资产周转率TAT(次)');
            }
        } else {
            if (e == SALEM) {
                setTitleTypeRatio('Gross sales margin(%)');
            } else if (e == ROE) {
                setTitleTypeRatio('Return on equity(%)');
            } else if (e == ROA) {
                setTitleTypeRatio('Return on assets(%)');
            } else if (e == OPM) {
                setTitleTypeRatio('Operating margin(%)');
            } else if (e == AL) {
                setTitleTypeRatio('Asset-liability ratio(%)');
            } else if (e == AASTTURN) {
                setTitleTypeRatio('Total Asset Turnover (times)');
            }
        }
    }
    //财务数据
    const RTLR = 'RTLR';//总收入
    const CIAC = 'CIAC';//净利润  
    const ATOT = 'ATOT';//总资产(万元)
    const LTLLLMIN = 'LTLLLMIN';//LTLL-LMIN总负债
    const QTLELMIN = 'QTLELMIN';//QTLE+LMIN股东权益
    const SNCC = 'SNCC';//现金净流量
    const [titleType, setTitleType] = useState('总收入(万元)')
    const [valueType, setValueType] = useState('RTLR')
    //选择类别的操作
    const getIndicators = (e) => {
        setValueType(e)
        changeTitle(e)
    }
    //类别的名称切换
    const changeTitle = (e) => {
        if (intl.locale === "zh-CN") {
            if (e == RTLR) {
                setTitleType('总收入(万元)');
            } else if (e == CIAC) {
                setTitleType('净利润(万元)');
            } else if (e == ATOT) {
                setTitleType('总资产(万元)');
            } else if (e == LTLLLMIN) {
                setTitleType('总负债(万元)');
            } else if (e == QTLELMIN) {
                setTitleType('股东权益(万元)');
            } else if (e == SNCC) {
                setTitleType('现金净流量(万元)');
            }
        } else {
            if (e == RTLR) {
                setTitleType('Total Revenue (ten thousand yuan)');
            } else if (e == CIAC) {
                setTitleType('Net profit (ten thousand yuan)');
            } else if (e == ATOT) {
                setTitleType('Total assets (ten thousand yuan)');
            } else if (e == LTLLLMIN) {
                setTitleType('Total liabilities (ten thousand yuan)');
            } else if (e == QTLELMIN) {
                setTitleType('Shareholders equity (ten thousand yuan)');
            } else if (e == SNCC) {
                setTitleType('Net cash flow (ten thousand yuan)');
            }
        }
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            <div style={{ marginLeft: '32px' }}>
                <FormattedMessage id="pages.peerComparison.industry" defaultMessage="行业:" />
                <Select
                    showSearch
                    onSelect={(e) => getDataInfo(e)}
                    onPopupScroll={companyScroll}
                    style={{ width: 200, margin: '24px' }}
                    placeholder={intl.formatMessage({
                        id: 'pages.peerComparison.industry.placeholder',
                        defaultMessage: '请选择行业',
                    })}
                >
                    {industryState.length > 0 ? industryState.map((item) => (
                        <Option key={item.id} value={item.rcsQcode}>{intl.locale === "zh-CN" ? item.topicDescriptionZh : item.topicDescriptionEn}</Option>
                    )) : ''
                    }
                </Select>

                {
                    keyType == 801 ?
                        <span style={{ marginLeft: '32px' }}>
                            <FormattedMessage id="pages.peerComparison.indicators" defaultMessage="指标:" />
                            <Select
                                name='typeRatio'
                                defaultValue={valueTypeRatio}
                                value={valueTypeRatio}
                                onSelect={(e) => getIndicatorsRatio(e)}
                                style={{ width: 200, margin: '24px' }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.peerComparison.indicators.placeholder',
                                    defaultMessage: '请选择指标',
                                })}
                            >
                                <Option key='0' value={SALEM}>{intl.locale === "zh-CN" ? '销售毛利率GPM(%)' : 'Total revenue'}</Option>
                                <Option key='1' value={ROE}>{intl.locale === "zh-CN" ? '净资产收益率ROE(%)' : 'Net profit'}</Option>
                                <Option key='2' value={ROA}>{intl.locale === "zh-CN" ? '资产收益率ROA(%)' : 'Total assets'}</Option>
                                <Option key='3' value={OPM}>{intl.locale === "zh-CN" ? '营业利润率OPR(%)' : 'Total liabilities'}</Option>
                                <Option key='4' value={AL}>{intl.locale === "zh-CN" ? '资产负债率LOAR(%)' : 'Shareholders equity'}</Option>
                                <Option key='5' value={AASTTURN}>{intl.locale === "zh-CN" ? '总资产周转率TAT(%)' : 'Net cash flow'}</Option>
                            </Select>
                        </span> :
                        keyType == 802 ?
                            <span style={{ marginLeft: '32px' }}>
                                <FormattedMessage id="pages.peerComparison.indicators" defaultMessage="指标:" />
                                <Select
                                    name='dataRatio'
                                    defaultValue={valueType}
                                    value={valueType}
                                    onSelect={(e) => getIndicators(e)}
                                    style={{ width: 200, margin: '24px' }}
                                    placeholder={intl.formatMessage({
                                        id: 'pages.peerComparison.indicators.placeholder',
                                        defaultMessage: '请选择指标',
                                    })}
                                >
                                    <Option key='0' value={RTLR}>{intl.locale === "zh-CN" ? '总收入' : 'Total revenue'}</Option>
                                    <Option key='1' value={CIAC}>{intl.locale === "zh-CN" ? '净利润' : 'Net profit'}</Option>
                                    <Option key='2' value={ATOT}>{intl.locale === "zh-CN" ? '总资产' : 'Total assets'}</Option>
                                    <Option key='3' value={LTLLLMIN}>{intl.locale === "zh-CN" ? '总负债' : 'Total liabilities'}</Option>
                                    <Option key='4' value={QTLELMIN}>{intl.locale === "zh-CN" ? '股东权益' : 'Shareholders equity'}</Option>
                                    <Option key='5' value={SNCC}>{intl.locale === "zh-CN" ? '现金净流量' : 'Net cash flow'}</Option>
                                </Select>
                            </span> : ''
                }
            </div>

            {
                keyType == 801 ?
                    <div>
                        <div className={styles.titilePeer}>
                            <Row>
                                <Col span={4}>代码</Col>
                                <Col span={4}>证券简称</Col>
                                <Col span={16}>
                                    <span className={styles.spanPeer}>
                                        <div>{titleTypeRatio}</div>
                                        <div className={styles.titilePeerRow}>
                                            <span>
                                                {oneYear}
                                                {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                            </span>
                                            <span>
                                                {twoYear}
                                                {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                            </span>
                                            <span>
                                                {threeYear}
                                                {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                            </span>
                                            <span>
                                                {fourYear}
                                                {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                            </span>
                                        </div>
                                    </span>
                                </Col>
                            </Row>
                        </div>
                        {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs) => (
                            <div className={styles.dataPeer}>
                                <Row>
                                    <Col span={4}>
                                        {financialState[fs].map((value, index) => (
                                            index == 0 ?
                                                value.financial[0].ric : ''
                                        ))
                                        }
                                    </Col>
                                    <Col span={4}>
                                        {financialState[fs].map((value, index) => (
                                            index == 0 ?
                                                JSON.stringify(financialName) !== '{}' ? financialName[value.financial[0].ric] : '' : ''
                                        ))
                                        }
                                    </Col>
                                    <Col span={16}>
                                        <div className={styles.dataPeerRow}>
                                            <span>
                                                {financialState[fs].map((value) => (
                                                    value.financial.map((v, index) => (
                                                        valueTypeRatio == SALEM ?
                                                            value.contrastData.saleMargin && v.fiscaYear == oneYear ? (index == 0 ? value.contrastData.saleMargin : '') : '' :
                                                            valueTypeRatio == ROE ?
                                                                value.contrastData.roe && v.fiscaYear == oneYear ? index == 0 ? value.contrastData.roe : '' : '' :
                                                                valueTypeRatio == ROA ?
                                                                    value.contrastData.roa && v.fiscaYear == oneYear ? index == 0 ? value.contrastData.roa : '' : '' :
                                                                    valueTypeRatio == OPM ?
                                                                        value.contrastData.operatingProfitMargin && v.fiscaYear == oneYear ? index == 0 ? value.contrastData.operatingProfitMargin : '' : '' :
                                                                        valueTypeRatio == AL ?
                                                                            value.contrastData.assetsLiabilities && v.fiscaYear == oneYear ? index == 0 ? value.contrastData.assetsLiabilities : '' : '' :
                                                                            valueTypeRatio == AASTTURN ?
                                                                                '' : ''

                                                    ))
                                                ))}
                                            </span>
                                            <span>
                                                {financialState[fs].map((value) => (
                                                    value.financial.map((v, index) => (
                                                        valueTypeRatio == SALEM ?
                                                            value.contrastData.saleMargin && v.fiscaYear == twoYear ? index == 0 ? value.contrastData.saleMargin : '' : '' :
                                                            valueTypeRatio == ROE ?
                                                                value.contrastData.roe && v.fiscaYear == twoYear ? index == 0 ? value.contrastData.roe : '' : '' :
                                                                valueTypeRatio == ROA ?
                                                                    value.contrastData.roa && v.fiscaYear == twoYear ? index == 0 ? value.contrastData.roa : '' : '' :
                                                                    valueTypeRatio == OPM ?
                                                                        value.contrastData.operatingProfitMargin && v.fiscaYear == twoYear ? index == 0 ? value.contrastData.operatingProfitMargin : '' : '' :
                                                                        valueTypeRatio == AL ?
                                                                            value.contrastData.assetsLiabilities && v.fiscaYear == twoYear ? index == 0 ? value.contrastData.assetsLiabilities : '' : '' :
                                                                            valueTypeRatio == AASTTURN ?
                                                                                '' : ''

                                                    ))
                                                ))}
                                            </span>
                                            <span>
                                                {financialState[fs].map((value) => (
                                                    value.financial.map((v, index) => (
                                                        valueTypeRatio == SALEM ?
                                                            value.contrastData.saleMargin && v.fiscaYear == threeYear ? index == 0 ? value.contrastData.saleMargin : '' : '' :
                                                            valueTypeRatio == ROE ?
                                                                value.contrastData.roe && v.fiscaYear == threeYear ? index == 0 ? value.contrastData.roe : '' : '' :
                                                                valueTypeRatio == ROA ?
                                                                    value.contrastData.roa && v.fiscaYear == threeYear ? index == 0 ? value.contrastData.roa : '' : '' :
                                                                    valueTypeRatio == OPM ?
                                                                        value.contrastData.operatingProfitMargin && v.fiscaYear == threeYear ? index == 0 ? value.contrastData.operatingProfitMargin : '' : '' :
                                                                        valueTypeRatio == AL ?
                                                                            value.contrastData.assetsLiabilities && v.fiscaYear == threeYear ? index == 0 ? value.contrastData.assetsLiabilities : '' : '' :
                                                                            valueTypeRatio == AASTTURN ?
                                                                                '' : ''

                                                    ))
                                                ))}
                                            </span>
                                            <span>
                                                {financialState[fs].map((value) => (
                                                    value.financial.map((v, index) => (
                                                        valueTypeRatio == SALEM ?
                                                            value.contrastData.saleMargin && v.fiscaYear == fourYear ? index == 0 ? value.contrastData.saleMargin : '' : '' :
                                                            valueTypeRatio == ROE ?
                                                                value.contrastData.roe && v.fiscaYear == fourYear ? index == 0 ? value.contrastData.roe : '' : '' :
                                                                valueTypeRatio == ROA ?
                                                                    value.contrastData.roa && v.fiscaYear == fourYear ? index == 0 ? value.contrastData.roa : '' : '' :
                                                                    valueTypeRatio == OPM ?
                                                                        value.contrastData.operatingProfitMargin && v.fiscaYear == fourYear ? index == 0 ? value.contrastData.operatingProfitMargin : '' : '' :
                                                                        valueTypeRatio == AL ?
                                                                            value.contrastData.assetsLiabilities && v.fiscaYear == fourYear ? index == 0 ? value.contrastData.assetsLiabilities : '' : '' :
                                                                            valueTypeRatio == AASTTURN ?
                                                                                '' : ''

                                                    ))
                                                ))}
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )) : <Spin className={styles.spinLoading} />}
                    </div> :
                    keyType == 802 ?
                        <div>
                            <div className={styles.titilePeer}>
                                <Row>
                                    <Col span={4}>代码</Col>
                                    <Col span={4}>证券简称</Col>
                                    <Col span={16}>
                                        <span className={styles.spanPeer}>
                                            <div>{titleType}</div>
                                            <div className={styles.titilePeerRow}>
                                                <span>
                                                    {oneYear}
                                                    {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                                </span>
                                                <span>
                                                    {twoYear}
                                                    {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                                </span>
                                                <span>
                                                    {threeYear}
                                                    {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                                </span>
                                                <span>
                                                    {fourYear}
                                                    {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}
                                                </span>
                                            </div>
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                            {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs) => (
                                <div className={styles.dataPeer}>
                                    <Row>
                                        <Col span={4}>
                                            {financialState[fs].map((value, index) => (
                                                index == 0 ?
                                                    value.financial[0].ric : ''
                                            ))
                                            }
                                        </Col>
                                        <Col span={4}>
                                            {financialState[fs].map((value, index) => (
                                                index == 0 ?
                                                    JSON.stringify(financialName) !== '{}' ? financialName[value.financial[0].ric] : '' : ''
                                            ))
                                            }
                                        </Col>
                                        <Col span={16}>
                                            <div className={styles.dataPeerRow}>
                                                <span>
                                                    {financialState[fs].map((value) => (
                                                        value.financial.map((v, index) => (
                                                            v.lineItemObject && v.fiscaYear == oneYear ?
                                                                valueType == LTLLLMIN ?
                                                                    value.contrastData.ltllLmin && index === 0 ? value.contrastData.ltllLmin : '' :
                                                                    valueType == QTLELMIN ?
                                                                        value.contrastData.qtleLmin && index === 0 ? value.contrastData.qtleLmin : '' :
                                                                        valueType != QTLELMIN && valueType != LTLLLMIN ?
                                                                            v.lineItemObject.map((lo) => (
                                                                                lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                            )) : '' : ''
                                                        ))
                                                    ))}
                                                </span>
                                                <span>
                                                    {financialState[fs].map((value) => (
                                                        value.financial.map((v, index) => (
                                                            v.lineItemObject && v.fiscaYear == twoYear ?
                                                                valueType == LTLLLMIN ?
                                                                    value.contrastData.ltllLmin && index === 0 ? value.contrastData.ltllLmin : '' :
                                                                    valueType == QTLELMIN ?
                                                                        value.contrastData.qtleLmin && index === 0 ? value.contrastData.qtleLmin : '' :
                                                                        valueType != QTLELMIN && valueType != LTLLLMIN ?
                                                                            v.lineItemObject.map((lo) => (
                                                                                lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                            )) : '' : ''
                                                        ))
                                                    ))}
                                                </span>
                                                <span>
                                                    {financialState[fs].map((value) => (
                                                        value.financial.map((v, index) => (
                                                            v.lineItemObject && v.fiscaYear == twoYear ?
                                                                valueType == LTLLLMIN ?
                                                                    value.contrastData.ltllLmin && index === 0 ? value.contrastData.ltllLmin : '' :
                                                                    valueType == QTLELMIN ?
                                                                        value.contrastData.qtleLmin && index === 0 ? value.contrastData.qtleLmin : '' :
                                                                        valueType != QTLELMIN && valueType != LTLLLMIN ?
                                                                            v.lineItemObject.map((lo) => (
                                                                                lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                            )) : '' : ''
                                                        ))
                                                    ))}
                                                </span>
                                                <span>
                                                    {financialState[fs].map((value) => (
                                                        value.financial.map((v, index) => (
                                                            v.lineItemObject && v.fiscaYear == fourYear ?
                                                                valueType == LTLLLMIN ?
                                                                    value.contrastData.ltllLmin && index === 0 ? value.contrastData.ltllLmin : '' :
                                                                    valueType == QTLELMIN ?
                                                                        value.contrastData.qtleLmin && index === 0 ? value.contrastData.qtleLmin : '' :
                                                                        valueType != QTLELMIN && valueType != LTLLLMIN ?
                                                                            v.lineItemObject.map((lo) => (
                                                                                lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                            )) : '' : ''
                                                        ))
                                                    ))}
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )) : <Spin className={styles.spinLoading} />}

                        </div> :
                        keyType == 803 ?
                            <div>
                                <div className={styles.titilePeer}>
                                    <Row>
                                        <Col span={3}>代码</Col>
                                        <Col span={3}>证券简称</Col>
                                        <Col span={3}>季度收盘价</Col>
                                        <Col span={3}>每股现金流</Col>
                                        <Col span={12}>
                                            <span className={styles.spanPeer}>
                                                <div style={{ height: 36 }}></div>
                                                <div className={styles.titilePeerRow}>
                                                    <span>市盈率</span>
                                                    <span>市销率</span>
                                                    <span>市净率</span>
                                                </div>
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                                {valuation.length > 0 ? valuation.map((value) => (
                                    <div className={styles.dataPeer}>
                                        <Row>
                                            <Col span={3}>{value.ric}</Col>
                                            <Col span={3}>{JSON.stringify(valuationName) !== '{}' ? valuationName[value.ric] : ''}</Col>
                                            <Col span={3}>{value.close}</Col>
                                            <Col span={3}>{value.pcf}</Col>
                                            <Col span={12}>
                                                <div className={styles.dataPeerRow}>
                                                    <span>{value.pe && value.close ? eval(value.pe * value.close).toFixed(2) : ''}</span>
                                                    <span>{value.ps && value.close ? eval(value.ps * value.close).toFixed(2) : ''}</span>
                                                    <span>{value.pb && value.close ? eval(value.pb * value.close).toFixed(2) : ''}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                )) : <Spin className={styles.spinLoading} />}
                            </div> :
                            (keyType == 804 || keyType == 0) && marketState ?
                                <div>
                                    <div className={styles.titilePeer}>
                                        <Row>
                                            <Col span={3}>代码</Col>
                                            <Col span={3}>证券简称</Col>
                                            <Col span={3}>52周最高(前复权)</Col>
                                            <Col span={3}>52周最低(前复权)</Col>
                                            <Col span={12} className={styles.spanPeer}>
                                                <div>涨跌幅(%)</div>
                                                <div className={styles.titilePeerRow}>
                                                    <Col span={4}>最新</Col>
                                                    <Col span={4}>本周</Col>
                                                    <Col span={4}>本月</Col>
                                                    <Col span={4}>本年</Col>
                                                    <Col span={4}>近一月</Col>
                                                    <Col span={4}>近三月</Col>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    {JSON.stringify(marketState) !== '{}' ? Object.keys(marketState).map((ms, index) => (
                                        marketState[ms].map((value) => (
                                            <div className={[styles.dataPeer, index % 2 != 0 ? styles.oddBack : ''].join(' ')}>
                                                <Row>
                                                    <Col span={3}>{value.ric}</Col>
                                                    <Col span={3}>{JSON.stringify(companyName) !== '{}' ? companyName[value.ric] : ''}</Col>
                                                    <Col span={3}>
                                                        {value.lineItemObject ?
                                                            value.lineItemObject.Group ?
                                                                value.lineItemObject.Group.map((g) => (
                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                        r.FieldName == 'NHIG' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                    )) : ''
                                                                )) : '' : ''
                                                        }
                                                    </Col>
                                                    <Col span={3}>
                                                        {value.lineItemObject ?
                                                            value.lineItemObject.Group ?
                                                                value.lineItemObject.Group.map((g) => (
                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                        r.FieldName == 'NLOW' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                    )) : ''
                                                                )) : '' : ''
                                                        }
                                                    </Col>

                                                    <Col span={12}>
                                                        <div className={styles.dataPeerRow}>
                                                            <Col span={4}>
                                                                {value.lineItemObject ?
                                                                    value.lineItemObject.Group ?
                                                                        value.lineItemObject.Group.map((g) => (
                                                                            g.Ratio ? g.Ratio.map((r) => (
                                                                                r.FieldName == 'PR1DAYPRC' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                            )) : ''
                                                                        )) : '' : ''
                                                                }
                                                            </Col>
                                                            <Col span={4}>
                                                                {value.lineItemObject ?
                                                                    value.lineItemObject.Group ?
                                                                        value.lineItemObject.Group.map((g) => (
                                                                            g.Ratio ? g.Ratio.map((r) => (
                                                                                r.FieldName == 'PR5DAYPRC' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                            )) : ''
                                                                        )) : '' : ''
                                                                }
                                                            </Col>
                                                            <Col span={4}>
                                                                {value.lineItemObject ?
                                                                    value.lineItemObject.Group ?
                                                                        value.lineItemObject.Group.map((g) => (
                                                                            g.Ratio ? g.Ratio.map((r) => (
                                                                                r.FieldName == 'ChPctPriceMTD' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                            )) : ''
                                                                        )) : '' : ''
                                                                }
                                                            </Col>
                                                            <Col span={4}>
                                                                {value.lineItemObject ?
                                                                    value.lineItemObject.Group ?
                                                                        value.lineItemObject.Group.map((g) => (
                                                                            g.Ratio ? g.Ratio.map((r) => (
                                                                                r.FieldName == 'PRYTDPCT' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                            )) : ''
                                                                        )) : '' : ''
                                                                }
                                                            </Col>
                                                            <Col span={4}></Col>
                                                            <Col span={4}>
                                                                {value.lineItemObject ?
                                                                    value.lineItemObject.Group ?
                                                                        value.lineItemObject.Group.map((g) => (
                                                                            g.Ratio ? g.Ratio.map((r) => (
                                                                                r.FieldName == 'PR13WKPCT' ? r.Value ? parseFloat(r.Value).toFixed(2) : '' : ''
                                                                            )) : ''
                                                                        )) : '' : ''
                                                                }
                                                            </Col>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))
                                    )) : <Spin className={styles.spinLoading} />}
                                </div> : ''}
        </div>
    )
};

export default PeerComparison;
