import { message, Table, Pagination, DatePicker, Empty } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { querySharePrice, queryValuationAnalysis, queryValuation } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { subGroupArray, timeSpan } from '@/utils/utils';
import { dataValuation } from './DataUtil';
import moment from 'moment';
import { Chart, Line, Point, Tooltip, Legend, Axis } from 'bizcharts';

const { RangePicker } = DatePicker;
let dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const TradingValuation = (props) => {
    let pageTotal = '共';
    let pageItems = '条';
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    const [loadingState, setLoadingState] = useState(true);//loading
    const [sharePriceData, setSharePriceData] = useState({});//所有数据
    const [sharePricePage, setSharePricePage] = useState([]);//分页数据

    const columns = [
        {
            title: <FormattedMessage id="pages.tradingValuation.transactionDate" defaultMessage="交易日期" />,
            dataIndex: 'TIMESTAMP',
            render: (val, record) => {
                return <span>{record.TIMESTAMP ? moment(record.TIMESTAMP).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.tradingValuation.lowestPrice" defaultMessage="最低价" />,
            dataIndex: 'LOW',
            render: (val, record) => {
                return <span>{record.LOW ? record.LOW : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.tradingValuation.closingPrice" defaultMessage="收盘价" />,
            dataIndex: 'CLOSE',
            render: (val, record) => {
                return <span>{record.CLOSE ? record.CLOSE : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.tradingValuation.volume" defaultMessage="成交量(股)" />,
            dataIndex: 'VOLUME',
            render: (val, record) => {
                return <span>{record.VOLUME ? record.VOLUME : ''}</span>
            }
        },
    ];

    //每日行情
    let params = {
        ric: '',
        startTime: moment(timeSpan(90).startDate).format(dateFormat),
        endTime: moment(timeSpan(90).endDate).format(dateFormat),
        period: 'DAILY',
        accessToken: userInfo.accessToken
    }
    //估值分析
    let paramsValuation = {
        ric: '',
        startTime: timeSpan(90).startDate.getTime(),
        endTime: timeSpan(90).endDate.getTime(),
        accessToken: userInfo.accessToken
    }
    //估值分析折线图
    let paramsLine = {
        ric: '',
        startTime: timeSpan(90).startDate.getTime(),
        endTime: timeSpan(90).endDate.getTime(),
        period: 'DAILY',
        dimension: 'CLOSE',
        accessToken: userInfo.accessToken
    }

    /** 国际化配置 */
    const intl = useIntl();

    const getRowClassName = (record, index) => {
        let className = '';
        className = index % 2 === 0 ? styles.oddBack : "";
        return className;
    }

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            pageTotal = '共';
            pageItems = '条';
            if ((keyType && keyType == 501) || keyType == 0) {
                setOneInfoTitle('每日行情');
                querySharePriceLists(ric);
            } else if (keyType && keyType == 502) {
                setOneInfoTitle('估值分析');
                // queryValuationAnalysisData(ric);
                queryValuationData(ric)
            }
        } else {
            pageTotal = 'Total';
            pageItems = 'items';
            if ((keyType && keyType == 501) || keyType == 0) {
                setOneInfoTitle('The daily market');
                querySharePriceLists(ric);
            } else if (keyType && keyType == 502) {
                setOneInfoTitle('Valuation analysis');
                // queryValuationAnalysisData(ric);
                queryValuationData(ric)
            }
        }

    }, [ric, keyType]);

    //查询股价列表
    const querySharePriceLists = (ric) => {
        params.ric = ric;
        querySharePrice(params).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        setSharePriceData(res.data.GetInterdayTimeSeries_Response_5 ? res.data.GetInterdayTimeSeries_Response_5 : []);
                        setSharePricePage(res.data.GetInterdayTimeSeries_Response_5 ? res.data.GetInterdayTimeSeries_Response_5 ? subGroupArray(res.data.GetInterdayTimeSeries_Response_5.Row ? res.data.GetInterdayTimeSeries_Response_5.Row : [], 20)[0] : [] : []);
                    }
                } else {
                    setLoadingState(false);
                    message.error(res.message);
                }
            }
        )
    }

    const [valuation, setValuation] = useState([]);
    //查询行情分析
    const queryValuationAnalysisData = (ric) => {
        paramsValuation.ric = ric;
        queryValuationAnalysis(paramsValuation).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setValuation(res.data ? res.data : [])
                    } else {
                        setValuation([])
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [valuationLine, setValuationLine] = useState([]);

    //查询行情分析折线图
    const queryValuationData = (ric) => {
        paramsLine.ric = ric;
        queryValuation(paramsLine).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        let dataArray = []
                        res.data.map((item) => {
                            for (var i in item) {
                                let lineObj = {}
                                if (i === 'pb') {
                                    lineObj.type = i;
                                    lineObj.value = item[i] ? parseFloat(parseFloat(item[i]).toFixed(2)) : 0;
                                    lineObj.quarterTime = item.quarterTime ? moment(item.quarterTime).format('YYYY-MM-DD') : '';
                                    dataArray.push(lineObj)
                                } else if (i === 'ps') {
                                    lineObj.type = i;
                                    lineObj.value = item[i] ? parseFloat(parseFloat(item[i]).toFixed(2)) : 0;
                                    lineObj.quarterTime = item.quarterTime ? moment(item.quarterTime).format('YYYY-MM-DD') : '';
                                    dataArray.push(lineObj)
                                } else if (i === 'pcf') {
                                    lineObj.type = i;
                                    lineObj.value = item[i] ? parseFloat(parseFloat(item[i]).toFixed(2)) : 0;
                                    lineObj.quarterTime = item.quarterTime ? moment(item.quarterTime).format('YYYY-MM-DD') : '';
                                    dataArray.push(lineObj)
                                } else if (i === 'pe') {
                                    lineObj.type = i;
                                    lineObj.value = item[i] ? parseFloat(parseFloat(item[i]).toFixed(2)) : 0;
                                    lineObj.quarterTime = item.quarterTime ? moment(item.quarterTime).format('YYYY-MM-DD') : '';
                                    dataArray.push(lineObj)
                                }
                            }
                        })
                        setValuationLine(dataArray)
                    } else {
                        setValuationLine([])
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    const [cutPage, setCutPage] = useState(1);

    const onChange = (page, pageSize) => {
        setCutPage(page);
        setSharePricePage(subGroupArray(sharePriceData ? sharePriceData.Row : [], pageSize)[page - 1]);
    }

    const onShowSizeChange = (current, size) => {
        setCutPage(current);
        setSharePricePage(subGroupArray(sharePriceData ? sharePriceData.Row : [], size)[current - 1]);
    }

    //设置时间值
    const setTimeData = (e) => {
        params.startTime = moment(e[0]._d).format(dateFormat);
        params.endTime = moment(e[1]._d).format(dateFormat);
        paramsValuation.startTime = e[0]._d.getTime();
        paramsValuation.endTime = e[1]._d.getTime();
        paramsLine.startTime = e[0]._d.getTime();
        paramsLine.endTime = e[1]._d.getTime();
        if (keyType == 501) {
            querySharePriceLists(ric);
        } else if (keyType == 502) {
            // queryValuationAnalysisData(ric);
            queryValuationData(ric)
        }
    }

    //行情分析折线图
    const scale = {
        value: { min: 0, },
        type: {
            formatter: v => {
                return {
                    ps: 'ps',
                    pb: 'pb',
                    pe: 'pe',
                    pcf: 'pcf'
                }[v]
            }
        }
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            <div>
                <div className={styles.timeRange}>
                    <FormattedMessage id="pages.tradingValuation.timeRange" defaultMessage="时间范围:" />
                    <RangePicker name='timeRange'
                        className={styles.timeContentLeft}
                        defaultValue={[moment(timeSpan(90).startDate, dateFormat), moment(timeSpan(90).endDate, dateFormat)]}
                        onChange={(e) => setTimeData(e)} />
                </div>
                {keyType == 501 ?
                    <div>
                        <Table loading={loadingState}
                            scroll={{ x: '100%' }}
                            rowKey={(index, record) => index}
                            columns={columns}
                            rowClassName={getRowClassName}
                            dataSource={sharePricePage}
                            pagination={false} />
                        <div className={styles.pageBox}>
                            <Pagination
                                total={sharePriceData.Row ? sharePriceData.Row.length : 0}
                                showTotal={(total) => `${pageTotal} ${sharePriceData.Row ? sharePriceData.Row.length : 0} ${pageItems} `}
                                defaultPageSize={20}
                                current={cutPage ? cutPage : 1}
                                onChange={onChange}
                                onShowSizeChange={onShowSizeChange}
                            />
                        </div>
                    </div> :
                    keyType == 502 ?
                        // <div>
                        //     <div className={[styles.dataTitle, styles.oddBack].join(' ')}>
                        //         <span></span>
                        //         {
                        //             valuation.length > 0 ? valuation.map((item) => (
                        //                 <span>{item.quarterTime ? item.quarterTime : ''}</span>
                        //             )) : ''
                        //         }
                        //     </div>
                        //     {
                        //         valuation.length > 0 ? valuation.map((value) => (
                        //             dataValuation.length > 0 ? dataValuation.map((code, index) => (
                        //                 <div className={styles.dataContent}
                        //                     className={[styles.dataContent, index % 2 != 0 ? styles.oddBack : ''].join(' ')}>
                        //                     <span>{intl.locale === "zh-CN" ? code.nameCN : code.nameEN}</span>
                        //                     {code.type == 'pe' ?
                        //                         <span>
                        //                             {value.pe && value.close ? eval(value.pe * value.close).toFixed(2) : ''}
                        //                         </span>
                        //                         : code.type == 'pb' ?
                        //                             <span>
                        //                                 {value.pb && value.close ? eval(value.pb * value.close).toFixed(2) : ''}
                        //                             </span> : code.type == 'ps' ?
                        //                                 <span>
                        //                                     {value.ps && value.close ? eval(value.ps * value.close).toFixed(2) : ''}
                        //                                 </span> : code.type == 'pcf' ?
                        //                                     <span>
                        //                                         {value.pcf && value.close ? eval(value.pcf * value.close).toFixed(2) : ''}
                        //                                     </span> : ''}
                        //                 </div>
                        //             )) : ''
                        //         )) : ''
                        //     }
                        // </div> 
                        <div>
                            {valuationLine.length > 0 ?
                                <Chart scale={scale} padding={[30, 100, 60, 100]} autoFit height={500} data={valuationLine} interactions={['element-active']}>
                                    <Axis name="value" tickLine line grid={null} />
                                    <Point position="quarterTime*value" color="type" shape='circle' />
                                    <Line shape="smooth" position="quarterTime*value" color="type" label="value" />
                                    <Tooltip shared showCrosshairs />
                                    <Legend />
                                </Chart> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />}
                        </div>
                        : ''}
            </div>
        </div>
    )
};

export default TradingValuation;
