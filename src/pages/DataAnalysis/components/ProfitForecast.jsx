import { Spin, Table, message, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryForecast } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { yearScope } from '@/utils/utils';
import { dataForecast } from './DataUtil';
import moment from 'moment';

const titleNameCn = '(财年)';
const titleNameEn = '(fiscal year)';
const casType = 'Cash Flow Statement';
const incType = 'Income Statement';
const balType = 'Balance Sheet';
const { RangePicker } = DatePicker;
let dateFormat = 'YYYY';

const ProfitForecast = (props) => {
    const { keyType, ric, allData } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    //资产负债表、损益表、现金流量预测数据    
    let forecastParams = {
        ric: allData?.GetShareholdersReport_Response_1?.SymbolReport?.Symbol?.Value,
        startYear: yearScope(5).startYear,
        endYear: yearScope(5).endYear,
        accessToken: userInfo.accessToken
    }
    /** 国际化配置 */
    const intl = useIntl();

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 401) {
                setOneInfoTitle('现金流量表');
            } else if (keyType && keyType == 402) {
                setOneInfoTitle('资产负债表预测');
            } else if (keyType && keyType == 403) {
                setOneInfoTitle('损益表预测');
            } else if (keyType && keyType == 404) {
                setOneInfoTitle('估值预测');
            }
        } else {
            if (keyType && keyType == 401) {
                setOneInfoTitle('Cash flow statement forecast');
            } else if (keyType && keyType == 402) {
                setOneInfoTitle('Balance sheet forecast');
            } else if (keyType && keyType == 403) {
                setOneInfoTitle('Income statement forecast');
            } else if (keyType && keyType == 404) {
                setOneInfoTitle('Valuation forecast');
            }
        }

    }, [keyType]);

    useEffect(() => {
        //查询预测数据
        getForecastData();
    }, [allData]);

    const [dataState, setDataState] = useState({});
    const [casState, setCasState] = useState({});//现金流量表
    const [balState, setBalState] = useState({});//资产负债表
    const [incState, setIncState] = useState({});//损益表
    const [valState, setValState] = useState({});//估值

    const cashType = ['cpx', 'cps'];
    const balType = ['bps', 'nav', 'ndt'];
    const incType = ['net', 'grm', 'pre', 'ebt', 'dps', 'eps', 'sal', 'gps', 'ebi'];
    const valType = ['roe', 'roa'];

    //预测数据
    const getForecastData = () => {
        queryForecast(forecastParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        if (res.data.length > 0) {
                            res.data.map((item) => {
                                Object.keys(item).forEach((key, index) => {
                                    let lineObj = {}
                                    if (cashType.includes(key)) {
                                        console.log('cas')
                                    }
                                    if (balType.includes(key)) {
                                        console.log('bal')
                                    }
                                    if (incType.includes(key)) {
                                        console.log('inc')
                                    }
                                    if (valType.includes(key)) {
                                        console.log('val')
                                    }

                                    lineObj.year = item.yearOf;
                                    lineObj.type = key;
                                    lineObj.value = item[key];
                                    console.log(lineObj)
                                })
                            })
                        }
                    }
                } else {
                    message.error(res.message);
                }
            }
        )
    }

    //设置时间值
    const setTimeData = (e) => {
        forecastParams.startTime = e[0]._d.getFullYear();
        forecastParams.endTime = e[1]._d.getFullYear();
        getForecastData();
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span> <span className={styles.levelTitleExt}>（单位：美元，USD）</span>
            </div>
            <div className={styles.timeRange}>
                <FormattedMessage id="pages.tradingValuation.timeRange" defaultMessage="时间范围:" />
                <RangePicker name='timeRange'
                    className={styles.timeContentLeft}
                    picker="year"
                    defaultValue={[moment(yearScope(5).startYear, dateFormat), moment(yearScope(5).endYear, dateFormat)]}
                    onChange={(e) => setTimeData(e)} />
            </div>
            {/* {oneForecastData.length > 0 ?
                <div>
                    <div className={styles.dataTitle}>
                        <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{oneForecastData ? oneForecastData[0] ? oneForecastData[0].Periods.Period[0].CalendarYear : '' : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{twoForecastData ? twoForecastData[0] ? twoForecastData[0].Periods.Period[0].CalendarYear : '' : ''}</span>
                        <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{threeForecastData ? threeForecastData[0] ? threeForecastData[0].Periods.Period[0].CalendarYear : '' : ''}</span>
                    </div>
                    {
                        dataForecast.map((df, index) => (
                            <div className={styles.dataContent}
                                className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                <span>{intl.locale === "zh-CN" ? df.nameCN : df.nameEN}</span>
                                <span>
                                    {oneForecastData && oneForecastData.length > 0 ? oneForecastData.map((one) => (
                                        (one.Abbreviation == df.type) ? one.Periods ? one.Periods.Period ? toDecimal(one.Periods.Period[0].Estimates.Estimate[0].Mean) : '' : '' : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {twoForecastData && twoForecastData.length > 0 ? twoForecastData.map((two) => (
                                        (two.Abbreviation == df.type) ? two.Periods ? two.Periods.Period ? toDecimal(two.Periods.Period[0].Estimates.Estimate[0].Mean) : '' : '' : ''
                                    )) : ''}
                                </span>
                                <span>
                                    {threeForecastData && threeForecastData.length > 0 ? threeForecastData.map((three) => (
                                        (three.Abbreviation == df.type) ? three.Periods ? three.Periods.Period ? toDecimal(three.Periods.Period[0].Estimates.Estimate[0].Mean) : '' : '' : ''
                                    )) : ''}
                                </span>
                            </div>
                        ))
                    }
                </div>
                : < Spin className={styles.spinLoading} />} */}
        </div>
    )
};

export default ProfitForecast;
