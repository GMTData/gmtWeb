import { Spin, Table, message, Select } from 'antd';
import React, { useState, useEffect, useMemo } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryRatiosReport, queryValueData, getIndustryType, queryFinancialReport } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { sortArray } from '@/utils/utils';

const { Option } = Select;
const titleYearCn = '(年报)';
const titleYearEn = '(annual report)';
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

    useMemo(() => {
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

    }, [keyType, allData]);

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
    //市场表现
    const getRatiosReport = (industryType) => {
        marketParams.industryType = industryType;
        queryRatiosReport(marketParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setMarketState(res.data ? res.data : {})
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [financialState, setFinancialState] = useState({});
    //财务比率和财务数据比较
    const getFinancialReport = (industryType) => {
        reportParams.industryType = industryType;
        queryFinancialReport(reportParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        Object.keys(res.data).map((fs) => {
                            let financialArray = [];
                            Object.keys(res.data[fs]).map((v) => {
                                let RTLR = 0;
                                let SCOR = 0;
                                res.data[fs][v].map((y) => {
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
                                financialArray.push({ year: v, financial: res.data[fs][v] })
                            })
                            res.data[fs] = financialArray.sort(sortArray('year')).reverse();
                        })
                        setFinancialState(res.data ? res.data : {})
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [valuation, setValuation] = useState([]);//估值分析数据
    //估值分析
    const getValueData = (industryType) => {
        params.industryType = industryType;
        queryValueData(params).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setValuation(res.data ? res.data : [])
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
            </div>
            {
                keyType == 801 ?
                    <div>
                        <div className={styles.titilePeer}>
                            <div>
                                <span>排名</span>
                                <span>代码</span>
                                <span>证券简称</span>
                            </div>
                            <div>
                                <span className={styles.spanPeer}>
                                    <div>销售毛利率GPM(%)</div>
                                    <div className={styles.titilePeerRow}>
                                        {JSON.stringify(financialState) !== '{}' && allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol?.Value ?
                                            financialState ? financialState[allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol?.Value].map((value) => (
                                                <div>
                                                    {value.financial[0].fiscaYear}
                                                    {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}</div>
                                            )) : '' : ''}
                                    </div>
                                </span>
                            </div>
                        </div>
                        {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs) => (
                            allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value == fs ?
                                    <div className={styles.dataPeer}>
                                        <div>
                                            <span></span>
                                            <span>
                                                {financialState[fs].map((value, index) => (
                                                    index == 0 ?
                                                        value.financial[0].ric : ''
                                                ))
                                                }
                                            </span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span>
                                                <div className={styles.dataPeerRow}>
                                                    {financialState[fs].map((value) => (
                                                        <div>
                                                            {value.financial.map((v) => (
                                                                v.saleMargin ? v.saleMargin + '%' : ''
                                                            ))
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            </span>
                                        </div>
                                    </div> : ''
                                : '')) : <Spin className={styles.spinLoading} />}
                        <div className={styles.dataPeer}>
                            <div>
                                <span>美股20</span>
                                <span></span>
                                <span></span>
                            </div>
                            <div>
                                <span>
                                    <div className={styles.dataPeerRow}>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </span>
                            </div>
                        </div>

                        {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs) => (
                            allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != fs ?
                                    <div className={styles.dataPeer}>
                                        <div>
                                            <span></span>
                                            <span>
                                                {financialState[fs].map((value, index) => (
                                                    index == 0 ?
                                                        value.financial[0].ric : ''
                                                ))
                                                }
                                            </span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span>
                                                <div className={styles.dataPeerRow}>
                                                    {financialState[fs].map((value) => (
                                                        <div>
                                                            {value.financial.map((v) => (
                                                                v.saleMargin ? v.saleMargin + '%' : ''
                                                            ))
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            </span>
                                        </div>
                                    </div> : ''
                                : '')) : <Spin className={styles.spinLoading} />}
                    </div> :
                    keyType == 802 ?
                        <div>
                            <div className={styles.titilePeer}>
                                <div>
                                    <span>排名</span>
                                    <span>代码</span>
                                    <span>证券简称</span>
                                </div>
                                <div>
                                    <span className={styles.spanPeer}>
                                        <div>总收入(万元)</div>
                                        <div className={styles.titilePeerRow}>
                                            {JSON.stringify(financialState) !== '{}' && allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol?.Value ?
                                                financialState ? financialState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value].map((value) => (
                                                    <div>
                                                        {value.financial[0].fiscaYear}
                                                        {intl.locale === "zh-CN" ? titleYearCn : titleYearEn}</div>
                                                )) : '' : ''}
                                        </div>
                                    </span>
                                </div>
                            </div>
                            {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs) => (
                                allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                    allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value == fs ?
                                        <div className={styles.dataPeer}>
                                            <div>
                                                <span></span>
                                                <span>
                                                    {financialState[fs].map((value, index) => (
                                                        index == 0 ?
                                                            value.financial[0].ric : ''
                                                    ))
                                                    }
                                                </span>
                                                <span></span>
                                            </div>
                                            <div>
                                                <span>
                                                    <div className={styles.dataPeerRow}>
                                                        {financialState[fs].map((value) => (
                                                            <div>
                                                                {value.financial.map((v) => (
                                                                    v.lineItemObject ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == 'RTLR' ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                                }
                                                            </div>
                                                        ))}
                                                    </div>
                                                </span>
                                            </div>
                                        </div> : ''
                                    : '')) : <Spin className={styles.spinLoading} />}
                            <div className={styles.dataPeer}>
                                <div>
                                    <span>美股20</span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div>
                                    <span>
                                        <div className={styles.dataPeerRow}>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </span>
                                </div>
                            </div>

                            {JSON.stringify(financialState) !== '{}' ? Object.keys(financialState).map((fs) => (
                                allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                    allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != fs ?
                                        <div className={styles.dataPeer}>
                                            <div>
                                                <span></span>
                                                <span>
                                                    {financialState[fs].map((value, index) => (
                                                        index == 0 ?
                                                            value.financial[0].ric : ''
                                                    ))
                                                    }
                                                </span>
                                                <span></span>
                                            </div>
                                            <div>
                                                <span>
                                                    <div className={styles.dataPeerRow}>
                                                        {financialState[fs].map((value) => (
                                                            <div>
                                                                {value.financial.map((v) => (
                                                                    v.lineItemObject ?
                                                                        v.lineItemObject.map((lo) => (
                                                                            lo.coaCode == 'RTLR' ? parseInt(lo.Value) : ''
                                                                        )) : ''
                                                                ))
                                                                }
                                                            </div>
                                                        ))}
                                                    </div>
                                                </span>
                                            </div>
                                        </div> : ''
                                    : '')) : <Spin className={styles.spinLoading} />}
                        </div> :
                        keyType == 803 ?
                            <div>
                                <div className={styles.titilePeer}>
                                    <div>
                                        <span>排名</span>
                                        <span>代码</span>
                                        <span>证券简称</span>
                                    </div>
                                    <div>
                                        <span>季度收盘价</span>
                                        <span>每股现金流</span>
                                    </div>
                                    <div>
                                        <span className={styles.spanPeer}>
                                            <div style={{ height: 36 }}></div>
                                            <div className={styles.titilePeerRow}>
                                                <div>市盈率</div>
                                                <div>市销率</div>
                                                <div>市净率</div>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                {valuation ? valuation.map((value) => (
                                    allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                        allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value == value.ric ?
                                            <div className={styles.dataPeer}>
                                                <div>
                                                    <span></span>
                                                    <span>{value.ric}</span>
                                                    <span></span>
                                                </div>
                                                <div>
                                                    <span>{value.close}</span>
                                                    <span>{value.pcf}</span>
                                                </div>
                                                <div>
                                                    <span>
                                                        <div className={styles.dataPeerRow}>
                                                            <div>{value.pe}</div>
                                                            <div>{value.ps}</div>
                                                            <div>{value.pb}</div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            : '' : ''
                                )) : <Spin className={styles.spinLoading} />}
                                <div className={styles.dataPeer}>
                                    <div>
                                        <span>美股20</span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <div>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <div>
                                        <span>
                                            <div className={styles.dataPeerRow}>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                {valuation ? valuation.map((value) => (
                                    allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                        allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != value.ric ?
                                            <div className={styles.dataPeer}>
                                                <div>
                                                    <span></span>
                                                    <span>{value.ric}</span>
                                                    <span></span>
                                                </div>
                                                <div>
                                                    <span>{value.close}</span>
                                                    <span>{value.pcf}</span>
                                                </div>
                                                <div>
                                                    <span>
                                                        <div className={styles.dataPeerRow}>
                                                            <div>{value.pe}</div>
                                                            <div>{value.ps}</div>
                                                            <div>{value.pb}</div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            : '' : ''
                                )) : ''}
                            </div> :
                            (keyType == 804 || keyType == 0) && marketState ?
                                <div>
                                    <div className={styles.titilePeer}>
                                        <div>
                                            <span>排名</span>
                                            <span>代码</span>
                                            <span>证券简称</span>
                                        </div>
                                        <div>
                                            <span className={styles.spanPeer}>
                                                <div style={{ height: 36 }}></div>
                                                <div className={styles.titilePeerRow}>
                                                    <div>最新</div>
                                                    <div>本周</div>
                                                    <div>本月</div>
                                                    <div>本年</div>
                                                    <div>近一月</div>
                                                    <div>近三月</div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    {JSON.stringify(marketState) !== '{}' && allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol?.Value ?
                                        marketState ? marketState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value] ?
                                            marketState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value].length > 0 ?
                                                marketState[allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value].map((value) => (
                                                    <div className={styles.dataPeer}>
                                                        <div>
                                                            <span></span>
                                                            <span>{value.ric}</span>
                                                            <span></span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                <div className={styles.dataPeerRow}>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PR1DAYPRC' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PR5DAYPRC' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'ChPctPriceMTD' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PRYTDPCT' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>

                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PR13WKPCT' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>

                                                )) : <Spin className={styles.spinLoading} /> : '' : '' : ''}
                                    <div className={styles.dataPeer}>
                                        <div>
                                            <span>美股20</span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div>
                                            <span>
                                                <div className={styles.dataPeerRow}>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </span>
                                        </div>
                                    </div>

                                    {JSON.stringify(marketState) !== '{}' ? Object.keys(marketState).map((ms) => (
                                        allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol ?
                                            allData.GetShareholdersReport_Response_1.SymbolReport.Symbol.Value != ms ?
                                                marketState[ms].map((value) => (
                                                    <div className={styles.dataPeer}>
                                                        <div>
                                                            <span></span>
                                                            <span>{value.ric}</span>
                                                            <span></span>
                                                        </div>
                                                        <div>
                                                            <span>
                                                                <div className={styles.dataPeerRow}>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PR1DAYPRC' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PR5DAYPRC' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'ChPctPriceMTD' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PRYTDPCT' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                    <div>

                                                                    </div>
                                                                    <div>
                                                                        {value.lineItemObject ?
                                                                            value.lineItemObject.Group ?
                                                                                value.lineItemObject.Group.map((g) => (
                                                                                    g.Ratio ? g.Ratio.map((r) => (
                                                                                        r.FieldName == 'PR13WKPCT' ? r.Value : ''
                                                                                    )) : ''
                                                                                )) : '' : ''
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )) : ''
                                            : '')) : <Spin className={styles.spinLoading} />}
                                </div> : ''}
        </div>
    )
};

export default PeerComparison;
