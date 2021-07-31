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
            } else if (keyType && keyType == 802) {
                setOneInfoTitle('财务数据比较');
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
            } else if (keyType && keyType == 802) {
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
        changeTitle(RTLR);
    }, [allData]);

    //802类别的类别切换
    const changeTitle = (e) => {
        if (intl.locale === "zh-CN") {
            if (e == 'RTLR') {
                setTitleType('总收入(万元)');
            } else if (e == 'CIAC') {
                setTitleType('净利润(万元)');
            }
        } else {
            if (e == 'RTLR') {
                setTitleType('Total Revenue (ten thousand yuan)');
            } else if (e == 'CIAC') {
                setTitleType('Net profit (ten thousand yuan)');
            }
        }
    }

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
                                    res.data.financialStatements[fs][v].map((y) => {
                                        y.lineItemObject.map((l) => {
                                            if (l.coaCode == 'SCOR') {
                                                SCOR = l.Value;
                                            }
                                            if (l.coaCode == 'RTLR') {
                                                RTLR = l.Value;
                                            }
                                        })
                                        let saleMargin = (SCOR - RTLR) / RTLR * 100;
                                        if (saleMargin) {
                                            y.saleMargin = saleMargin.toFixed(2);
                                        }
                                    })
                                    financialArray.push({ year: v, financial: res.data.financialStatements[fs][v] })
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

    const RTLR = 'RTLR';//总收入
    const CIAC = 'CIAC';//净利润  
    const [titleType, setTitleType] = useState('总收入(万元)')
    const [valueType, setValueType] = useState('RTLR')
    //选择类别的操作
    const getIndicators = (e) => {
        setValueType(e)
        changeTitle(e)
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
                    keyType == 802 ?
                        <span style={{ marginLeft: '32px' }}>
                            <FormattedMessage id="pages.peerComparison.indicators" defaultMessage="指标:" />
                            <Select
                                defaultValue={RTLR}
                                onSelect={(e) => getIndicators(e)}
                                style={{ width: 200, margin: '24px' }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.peerComparison.indicators.placeholder',
                                    defaultMessage: '请选择指标',
                                })}
                            >
                                <Option key='0' value={RTLR}>{intl.locale === "zh-CN" ? '总收入' : 'Total revenue'}</Option>
                                <Option key='1' value={CIAC}>{intl.locale === "zh-CN" ? '净利润' : 'Net profit'}</Option>
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
                                        <div>销售毛利率GPM(%)</div>
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
                            allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value == fs ?
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
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == oneYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                    <span>
                                                        {financialState[fs].map((value) => (
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == twoYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                    <span>
                                                        {financialState[fs].map((value) => (
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == threeYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                    <span>
                                                        {financialState[fs].map((value) => (
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == fourYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div> : ''
                                : '')) : <Spin className={styles.spinLoading} />}

                        {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs, index) => (
                            allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != fs ?
                                    <div className={[styles.dataPeer, index % 2 != 0 ? styles.oddBack : ''].join(' ')}>
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
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == oneYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                    <span>
                                                        {financialState[fs].map((value) => (
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == twoYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                    <span>
                                                        {financialState[fs].map((value) => (
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == threeYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                    <span>
                                                        {financialState[fs].map((value) => (
                                                            value.financial.map((v) => (
                                                                v.saleMargin && v.fiscaYear == fourYear ? v.saleMargin + '%' : ''
                                                            ))
                                                        ))}
                                                    </span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div> : ''
                                : '')) : <Spin className={styles.spinLoading} />}
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
                                allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                    allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value == fs ?
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
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == oneYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                        <span>
                                                            {financialState[fs].map((value) => (
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == twoYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                        <span>
                                                            {financialState[fs].map((value) => (
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == threeYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                        <span>
                                                            {financialState[fs].map((value) => (
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == fourYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div> : ''
                                    : '')) : <Spin className={styles.spinLoading} />}

                            {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs, index) => (
                                allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                    allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != fs ?
                                        <div className={[styles.dataPeer, index % 2 != 0 ? styles.oddBack : ''].join(' ')}>
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
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == oneYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                        <span>
                                                            {financialState[fs].map((value) => (
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == twoYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                        <span>
                                                            {financialState[fs].map((value) => (
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == threeYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                        <span>
                                                            {financialState[fs].map((value) => (
                                                                value.financial.map((v) => (
                                                                    v.lineItemObject && v.fiscaYear == fourYear ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == valueType ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                            ))}
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div> : ''
                                    : '')) : <Spin className={styles.spinLoading} />}
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
                                    allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                        allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value == value.ric ?
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
                                            : '' : ''
                                )) : <Spin className={styles.spinLoading} />}
                                {valuation ? valuation.map((value, index) => (
                                    allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                        allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != value.ric ?
                                            <div className={[styles.dataPeer, index % 2 != 0 ? styles.oddBack : ''].join(' ')}>
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
                                            : '' : ''
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
                                    {JSON.stringify(marketState) !== '{}' && allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol?.Value ?
                                        marketState ? marketState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value] ?
                                            marketState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value].length > 0 ?
                                                marketState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value].map((value) => (
                                                    <div className={styles.dataPeer}>
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

                                                )) : <Spin className={styles.spinLoading} /> : '' : '' : ''}

                                    {JSON.stringify(marketState) !== '{}' ? Object.keys(marketState).map((ms, index) => (
                                        allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                            allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != ms ?
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
                                                )) : ''
                                            : '')) : <Spin className={styles.spinLoading} />}
                                </div> : ''}
        </div>
    )
};

export default PeerComparison;
