import { Spin, Table, message, DatePicker, Empty } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryForecast } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { yearScope, sortArray } from '@/utils/utils';
import { dataForecast } from './DataUtil';
import moment from 'moment';
import { Chart, Line, Point, Tooltip, Legend, Axis } from 'bizcharts';

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
        // ric: 'AAPL.O',
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

    const [casState, setCasState] = useState({});//现金流量表
    const [balState, setBalState] = useState({});//资产负债表
    const [incState, setIncState] = useState({});//损益表
    const [valState, setValState] = useState({});//估值

    const cashType = ['cpx', 'cps'];
    const balType = ['bps', 'nav', 'ndt'];
    const incType = ['net', 'grm', 'pre', 'ebt', 'dps', 'eps', 'sal', 'gps', 'ebi'];
    const valType = ['roe', 'roa'];

    const cashIncreaseType = ['cpxIncrease', 'cpsIncrease'];
    const balIncreaseType = ['bpsIncrease', 'navIncrease', 'ndtIncrease'];
    const incIncreaseType = ['netIncrease', 'grmIncrease', 'preIncrease', 'ebtIncrease', 'dpsIncrease', 'epsIncrease', 'salIncrease', 'gpsIncrease', 'ebiIncrease'];
    const valIncreaseType = ['roeIncrease', 'roaIncrease'];

    const [years, setYears] = useState([]);//年度集合
    //预测数据
    const getForecastData = () => {
        queryForecast(forecastParams).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        let cashDataArray = []
                        let balDataArray = []
                        let incDataArray = []
                        let valDataArray = []
                        let yearList = []
                        if (res.data.length > 0) {
                            let cashObj = {}
                            let balObj = {}
                            let incObj = {}
                            let valObj = {}
                            res.data.map((item) => {
                                yearList.push(item.yearOf);
                                Object.keys(item).forEach((key) => {
                                    if (cashType.includes(key) || cashIncreaseType.includes(key)) {
                                        cashObj = {}
                                        cashObj.year = item.yearOf;
                                        cashIncreaseType.map((cit) => {
                                            if (cit == key) {
                                                cashObj.type = key;
                                                cashObj.increaseFlag = true;
                                                cashObj.increase = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                cashDataArray.push(cashObj)
                                            }
                                        })
                                        cashType.map((ct) => {
                                            if (ct == key) {
                                                cashObj.type = key;
                                                cashObj.increaseFlag = false;
                                                cashObj.value = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                cashDataArray.push(cashObj)
                                            }
                                        })
                                    }
                                    if (balType.includes(key) || balIncreaseType.includes(key)) {
                                        balObj = {}
                                        balObj.year = item.yearOf;
                                        balIncreaseType.map((bat) => {
                                            if (bat == key) {
                                                balObj.type = key;
                                                balObj.increaseFlag = true;
                                                balObj.increase = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                balDataArray.push(balObj)
                                            }
                                        })
                                        balType.map((bt) => {
                                            if (bt == key) {
                                                balObj.type = key;
                                                balObj.increaseFlag = false;
                                                balObj.value = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                balDataArray.push(balObj)
                                            }
                                        })
                                    }
                                    if (incType.includes(key) || incIncreaseType.includes(key)) {
                                        incObj = {}
                                        incObj.year = item.yearOf;
                                        incIncreaseType.map((ict) => {
                                            if (ict == key) {
                                                incObj.type = key;
                                                incObj.increaseFlag = true;
                                                incObj.increase = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                incDataArray.push(incObj)
                                            }
                                        })
                                        incType.map((it) => {
                                            if (it == key) {
                                                incObj.type = key;
                                                incObj.increaseFlag = false;
                                                incObj.value = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                incDataArray.push(incObj)
                                            }
                                        })
                                    }
                                    if (valType.includes(key) || valIncreaseType.includes(key)) {
                                        valObj = {}
                                        valObj.year = item.yearOf;
                                        valIncreaseType.map((vlt) => {
                                            if (vlt == key) {
                                                valObj.type = key;
                                                valObj.increaseFlag = true;
                                                valObj.increase = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                valDataArray.push(valObj)
                                            }
                                        })
                                        valType.map((vt) => {
                                            if (vt == key) {
                                                valObj.type = key;
                                                valObj.increaseFlag = false;
                                                valObj.value = item[key] && !isNaN(item[key]) ? parseFloat(parseFloat(item[key]).toFixed(2)) : item[key];
                                                valDataArray.push(valObj)
                                            }
                                        })
                                    }
                                })
                            })
                        }
                        setYears([...new Set(yearList)])
                        // setCasState(cashDataArray.sort(sortArray('year')).reverse())
                        // setBalState(balDataArray.sort(sortArray('year')).reverse())
                        // setIncState(incDataArray.sort(sortArray('year')).reverse())
                        // setValState(valDataArray.sort(sortArray('year')).reverse())
                        setCasState(cashDataArray)
                        setBalState(balDataArray)
                        setIncState(incDataArray)
                        setValState(valDataArray)
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
            {years.length > 0 ?
                <div>
                    <div className={styles.dataTitle}>
                        <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                        {years.map((y) => (
                            <span>{intl.locale === "zh-CN" ? titleNameCn : titleNameEn}{y ? y : ''}</span>
                        ))}

                    </div>
                    {keyType == 401 ?
                        years ? cashType.map((c, index) => (
                            <div>
                                <div className={styles.dataContent}
                                    className={[styles.dataContent, styles.oddBack].join(' ')}>
                                    <span>{c}</span>
                                    {years && casState.length > 0 ? years.map((y) => (
                                        <span>
                                            {casState.map((cas) => (
                                                (y == cas.year) && c == cas.type ? cas.value : ''
                                            ))}
                                        </span>
                                    )) : ''}
                                </div>
                                {cashIncreaseType.map((ci) => (
                                    ci.includes(c) ?
                                        <div className={styles.dataContent}
                                            className={[styles.dataContent, styles.oddBack].join(' ')}>
                                            <span>{ci}</span>
                                            {years && casState.length > 0 ? years.map((y) => (
                                                <span>
                                                    {casState.map((cas) => (
                                                        (y == cas.year) && ci == cas.type ? cas.increase : ''
                                                    ))}
                                                </span>
                                            )) : ''}
                                        </div> : ''
                                ))
                                }
                                <div>
                                    {casState.length > 0 ?
                                        <Chart padding={[30, 100, 60, 100]} autoFit height={300} data={casState} interactions={['element-active']}>
                                            <Axis name="value" tickLine line grid={null} />
                                            <Point position="year*value" color="type" shape='circle' />
                                            <Line shape="smooth" position="year*value" color="type" label="value" />
                                            <Tooltip shared showCrosshairs />
                                            <Legend name='type'
                                                filter={type => {
                                                    // return type.indexOf('cp') !== -1
                                                    return type === c
                                                }}
                                                visible={false}
                                            />
                                        </Chart> : <Empty />}
                                </div>
                            </div>
                        )) : ''
                        : keyType == 402 ?
                            years ? balType.map((b, index) => (
                                <div>
                                    <div className={styles.dataContent}
                                        className={[styles.dataContent, styles.oddBack].join(' ')}>
                                        <span>{b}</span>
                                        {years && balState.length > 0 ? years.map((y) => (
                                            <span>
                                                {balState.map((bal) => (
                                                    (y == bal.year) && b == bal.type ? bal.value : ''
                                                ))}
                                            </span>
                                        )) : ''}
                                    </div>
                                    {balIncreaseType.map((bi) => (
                                        bi.includes(b) ?
                                            <div className={styles.dataContent}
                                                className={[styles.dataContent, styles.oddBack].join(' ')}>
                                                <span>{bi}</span>
                                                {years && balState.length > 0 ? years.map((y) => (
                                                    <span>
                                                        {balState.map((bal) => (
                                                            (y == bal.year) && bi == bal.type ? bal.increase : ''
                                                        ))}
                                                    </span>
                                                )) : ''}
                                            </div> : ''
                                    ))
                                    }
                                    <div>
                                        {balState.length > 0 ?
                                            <Chart padding={[30, 100, 60, 100]} autoFit height={300} data={balState} interactions={['element-active']}>
                                                <Axis name="value" tickLine line grid={null} />
                                                <Point position="year*value" color="type" shape='circle' />
                                                <Line shape="smooth" position="year*value" color="type" label="value" />
                                                <Tooltip shared showCrosshairs />
                                                <Legend name='type'
                                                    filter={type => {
                                                        return type === b
                                                    }}
                                                    visible={false} />
                                            </Chart> : <Empty />}
                                    </div>
                                </div>
                            )) : ''
                            : keyType == 403 ?
                                years ? incType.map((i, index) => (
                                    <div>
                                        <div className={styles.dataContent}
                                            className={[styles.dataContent, styles.oddBack].join(' ')}>
                                            <span>{i}</span>
                                            {years && incState.length > 0 ? years.map((y) => (
                                                <span>
                                                    {incState.map((inc) => (
                                                        (y == inc.year) && i == inc.type ? inc.value : ''
                                                    ))}
                                                </span>
                                            )) : ''}
                                        </div>
                                        {incIncreaseType.map((ic) => (
                                            ic.includes(i) ?
                                                <div className={styles.dataContent}
                                                    className={[styles.dataContent, styles.oddBack].join(' ')}>
                                                    <span>{ic}</span>
                                                    {years && incState.length > 0 ? years.map((y) => (
                                                        <span>
                                                            {incState.map((inc) => (
                                                                (y == inc.year) && ic == inc.type ? inc.increase : ''
                                                            ))}
                                                        </span>
                                                    )) : ''}
                                                </div> : ''
                                        ))
                                        }
                                        <div>
                                            {incState.length > 0 ?
                                                <Chart padding={[30, 100, 60, 100]} autoFit height={300} data={incState} interactions={['element-active']}>
                                                    <Axis name="value" tickLine line grid={null} />
                                                    <Point position="year*value" color="type" shape='circle' />
                                                    <Line shape="smooth" position="year*value" color="type" label="value" />
                                                    <Tooltip shared showCrosshairs />
                                                    <Legend name='type'
                                                        filter={type => {
                                                            return type === i
                                                        }}
                                                        visible={false} />
                                                </Chart> : <Empty />}
                                        </div>
                                    </div>
                                )) : ''
                                : keyType == 404 ?
                                    years ? valType.map((v, index) => (
                                        <div>
                                            <div className={styles.dataContent}
                                                className={[styles.dataContent, styles.oddBack].join(' ')}>
                                                <span>{v}</span>
                                                {years && valState.length > 0 ? years.map((y) => (
                                                    <span>
                                                        {valState.map((val) => (
                                                            (y == val.year) && v == val.type ? val.value : ''
                                                        ))}
                                                    </span>
                                                )) : ''}
                                            </div>
                                            {valIncreaseType.map((vi) => (
                                                vi.includes(v) ?
                                                    <div className={styles.dataContent}
                                                        className={[styles.dataContent, styles.oddBack].join(' ')}>
                                                        <span>{vi}</span>
                                                        {years && valState.length > 0 ? years.map((y) => (
                                                            <span>
                                                                {valState.map((val) => (
                                                                    (y == val.year) && vi == val.type ? val.increase : ''
                                                                ))}
                                                            </span>
                                                        )) : ''}
                                                    </div> : ''
                                            ))
                                            }
                                            <div>
                                                {valState.length > 0 ?
                                                    <Chart padding={[30, 100, 60, 100]} autoFit height={300} data={valState} interactions={['element-active']}>
                                                        <Axis name="value" tickLine line grid={null} />
                                                        <Point position="year*value" color="type" shape='circle' />
                                                        <Line shape="smooth" position="year*value" color="type" label="value" />
                                                        <Tooltip shared showCrosshairs />
                                                        <Legend name='type'
                                                            filter={type => {
                                                                return type === v
                                                            }}
                                                            visible={false} />
                                                    </Chart> : <Empty />}
                                            </div>
                                        </div>
                                    )) : '' : ''
                    }
                </div>
                : < Spin className={styles.spinLoading} />}
        </div>
    )
};

export default ProfitForecast;
