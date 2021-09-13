import React, { useState, useEffect } from 'react';
import { Spin, Table, message, Radio, Empty } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import { queryReportInfo, queryFinancialAnalysis } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { sortArray } from '@/utils/utils';

const titleYearCn = '(年报)';
const titleYearEn = '(Annual report)';
const interimYearCn = '(季报)';
const interimYearEn = '(Quarterly results)'
const FinancialData = (props) => {
    const { keyType, ric } = props;

    //"Type": "CAS" 是现金流量表 "Type": "BAL" 资产负债表 "Type": "INC" 损益表
    const userInfo = getAuthority();//获取用户相关信息

    //默认ric
    let params = {
        ric: '',
        accessToken: userInfo.accessToken
    }
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    const [dataYearState, setDataYearState] = useState([]);
    const [dataInterimState, setDataInterimState] = useState([]);
    const [financial, setFinancial] = useState([]);//财务数据
    const [codeMap, setCodeMap] = useState([]);
    const [casState, setCasState] = useState({ year: [], interim: [] });//现金流量表
    const [balState, setBalState] = useState({ year: [], interim: [] });//资产负债表
    const [incState, setIncState] = useState({ year: [], interim: [] });//损益表
    /** 国际化配置 */
    const intl = useIntl();

    useEffect(() => {
        if (intl.locale === "zh-CN") {
            if (keyType && keyType == 601) {
                setOneInfoTitle('成长能力');
            } else if (keyType && keyType == 602) {
                setOneInfoTitle('现金流量');
            } else if (keyType && keyType == 603) {
                setOneInfoTitle('损益表');
            } else if (keyType && keyType == 604) {
                setOneInfoTitle('资产负债表');
            } else if (keyType && keyType == 605) {
                setOneInfoTitle('盈利能力与收益质量');
            } else if (keyType && keyType == 606) {
                setOneInfoTitle('营运能力');
            } else if (keyType && keyType == 607) {
                setOneInfoTitle('主营构成');
            } else if (keyType && keyType == 608) {
                setOneInfoTitle('资本结构与偿债能力');
            }

        } else {
            if (keyType && keyType == 601) {
                setOneInfoTitle('Growth ability');
            } else if (keyType && keyType == 602) {
                setOneInfoTitle('CASH FLOW STATEMENT');
            } else if (keyType && keyType == 603) {
                setOneInfoTitle('INCOME STATEMENT');
            } else if (keyType && keyType == 604) {
                setOneInfoTitle('BALANCE SHEET');
            } else if (keyType && keyType == 605) {
                setOneInfoTitle('Profitability and earnings quality');
            } else if (keyType && keyType == 606) {
                setOneInfoTitle('Operation ability');
            } else if (keyType && keyType == 607) {
                setOneInfoTitle('The main composition');
            } else if (keyType && keyType == 608) {
                setOneInfoTitle('Capital structure and solvency');
            }
        }

    }, [keyType])

    const [currencyCode, setCurrencyCode] = useState('');//货币单位

    const [nameState, setNameState] = useState({})   //中英文
    useEffect(() => {
        params.ric = ric;
        //查询财务数据
        queryFinancialAnalysis(params).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setFinancial(res?.data?.result)
                        if (intl.locale === "zh-CN") {
                            setNameState(res?.data?.zh)
                        } else {
                            setNameState(res?.data?.en)
                        }
                    } else {
                        setFinancial([])
                    }
                } else {
                    message.error(res.message)
                }
            }
        )
        //查询现金流量表数据
        queryReportInfo(params).then(
            res => {
                if (res.state) {
                    if (res.data) {
                        setDataYearState(res.data.yearReport ? res.data.yearReport : [])
                        setDataInterimState(res.data.interimReport ? res.data.interimReport : [])
                        setCodeMap(res.data.coaMap ? res.data.coaMap : [])
                        //年报
                        if (res.data.yearReport.length > 0) {
                            let item = res.data.yearReport;
                            if (item.length > 0) {
                                const casData = { ...casState };
                                const balData = { ...balState };
                                const incData = { ...incState };
                                item.map((subItem) => {
                                    setCurrencyCode(subItem.currencyCode);
                                    if (subItem.reportType == 'CAS') {
                                        casData.year.push({ lineitem: subItem.lineItemObject, fiscaYear: subItem.fiscaYear, reportYearTime: subItem.reportYearTime });
                                        casData.year.sort(sortArray('fiscaYear')).reverse()
                                    } else if (subItem.reportType == 'BAL') {
                                        balData.year.push({ lineitem: subItem.lineItemObject, fiscaYear: subItem.fiscaYear, reportYearTime: subItem.reportYearTime });
                                        balData.year.sort(sortArray('fiscaYear')).reverse()
                                    } else if (subItem.reportType == 'INC') {
                                        incData.year.push({ lineitem: subItem.lineItemObject, fiscaYear: subItem.fiscaYear, reportYearTime: subItem.reportYearTime });
                                        incData.year.sort(sortArray('fiscaYear')).reverse()
                                    }
                                })

                                setCasState(casData);
                                setBalState(balData);
                                setIncState(incData);
                            }
                        }
                        //季报
                        if (res.data.interimReport.length > 0) {
                            let item = res.data.interimReport;
                            if (item.length > 0) {
                                const casData = { ...casState };
                                const balData = { ...balState };
                                const incData = { ...incState };
                                item.map((subItem) => {
                                    if (subItem.reportType == 'CAS') {
                                        casData.interim.push({ lineitem: subItem.lineItemObject, fiscaYear: subItem.fiscaYear, reportYearTime: subItem.reportYearTime });
                                        casData.interim.sort(sortArray('reportYearTime')).reverse()
                                    } else if (subItem.reportType == 'BAL') {
                                        balData.interim.push({ lineitem: subItem.lineItemObject, fiscaYear: subItem.fiscaYear, reportYearTime: subItem.reportYearTime });
                                        balData.interim.sort(sortArray('reportYearTime')).reverse()
                                    } else if (subItem.reportType == 'INC') {
                                        incData.interim.push({ lineitem: subItem.lineItemObject, fiscaYear: subItem.fiscaYear, reportYearTime: subItem.reportYearTime });
                                        incData.interim.sort(sortArray('reportYearTime')).reverse()
                                    }
                                })

                                setCasState(casData);
                                setBalState(balData);
                                setIncState(incData);
                            }
                        }

                    }
                } else {
                    message.error(res.message);
                }
            }
        );
    }, [ric])

    //切换数据维度   年报，季报，全部   默认年报
    const [dataType, setDataType] = useState('1');

    const onchange = (e) => {
        setDataType(e.target.value)
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
                {(keyType == 602 || keyType == 603 || keyType == 604) ? <span className={styles.dataRadio}>
                    <Radio.Group defaultValue={dataType} onChange={onchange} buttonStyle="solid" style={{ height: '30px' }}>
                        <Radio.Button value="0">{intl.locale === "zh-CN" ? '全部' : 'All'}</Radio.Button>
                        <Radio.Button value="1">{intl.locale === "zh-CN" ? '年报' : 'Annual report'}</Radio.Button>
                        <Radio.Button value="2">{intl.locale === "zh-CN" ? '季报' : 'Quarterly results'}</Radio.Button>
                    </Radio.Group>
                </span> : ''}
            </div>

            {
                casState.year.length > 0 && keyType == 602 ?
                    <div>
                        <div className={styles.dataTitle}>
                            <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                            {
                                (dataType === '0' || dataType === '1') && casState ? casState.year.map((item) => (
                                    <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item.reportYearTime ? item.reportYearTime : ''}</span>
                                )) : ''
                            }
                            {
                                (dataType === '0' || dataType === '2') && casState ? casState.interim.map((item) => (
                                    <span>{intl.locale === "zh-CN" ? interimYearCn : interimYearEn}{item.reportYearTime ? item.reportYearTime : ''}</span>
                                )) : ''
                            }
                        </div>
                        <div>
                            <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '现金流量' : 'The cash flow'}</span>
                            <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，' + currencyCode + '）' : '(Unit: TEN thousand Yuan, ' + currencyCode + ')'}</span>
                        </div>
                        {
                            casState.year.length > 0 ? casState.year[0].lineitem.map((cas, index) => (
                                codeMap ? codeMap.map((code) => (
                                    code.coaItem == cas.coaCode ?
                                        <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                            <span>
                                                {code.coaValueEn}
                                            </span>
                                            {(dataType === '0' || dataType === '1') && casState.year.length > 0 ? casState.year.map((yearItem) => (
                                                <span>
                                                    {yearItem.lineitem ? yearItem.lineitem.map((item) => (
                                                        <span>{code.coaItem == item.coaCode ? item.Value ? parseInt(item.Value) : '' : ''}</span>
                                                    )) : ''}
                                                </span>
                                            )) : ''}
                                            {(dataType === '0' || dataType === '2') && casState.interim.length > 0 ? casState.interim.map((interimItem) => (
                                                <span>
                                                    {interimItem.lineitem ? interimItem.lineitem.map((item) => (
                                                        <span>{code.coaItem == item.coaCode ? item.Value ? parseInt(item.Value) : '' : ''}</span>
                                                    )) : ''}
                                                </span>
                                            )) : ''}
                                        </div> : ''
                                )) : ''
                            )) : ''
                        }
                    </div> :
                    incState.year.length > 0 && keyType == 603 ?
                        <div>
                            <div className={styles.dataTitle}>
                                <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                                {
                                    (dataType === '0' || dataType === '1') && incState ? incState.year.map((item) => (
                                        <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item.reportYearTime ? item.reportYearTime : ''}</span>
                                    )) : ''
                                }
                                {
                                    (dataType === '0' || dataType === '2') && incState ? incState.interim.map((item) => (
                                        <span>{intl.locale === "zh-CN" ? interimYearCn : interimYearEn}{item.reportYearTime ? item.reportYearTime : ''}</span>
                                    )) : ''
                                }
                            </div>
                            <div>
                                <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '营业总收入' : 'Gross revenue'}</span>
                                <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，CNY）' : '(Unit: TEN thousand Yuan, CNY)'}</span>
                            </div>
                            {
                                incState.year.length > 0 ? incState.year[0].lineitem.map((cas, index) => (
                                    codeMap ? codeMap.map((code) => (
                                        code.coaItem == cas.coaCode ?
                                            <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                                <span>
                                                    {code.coaValueEn}
                                                </span>
                                                {(dataType === '0' || dataType === '1') && incState.year.length > 0 ? incState.year.map((yearItem) => (
                                                    <span>
                                                        {yearItem.lineitem ? yearItem.lineitem.map((item) => (
                                                            <span>{code.coaItem == item.coaCode ? item.Value ? parseInt(item.Value) : '' : ''}</span>
                                                        )) : ''}
                                                    </span>
                                                )) : ''}
                                                {(dataType === '0' || dataType === '2') && incState.interim.length > 0 ? incState.interim.map((interimItem) => (
                                                    <span>
                                                        {interimItem.lineitem ? interimItem.lineitem.map((item) => (
                                                            <span>{code.coaItem == item.coaCode ? item.Value ? parseInt(item.Value) : '' : ''}</span>
                                                        )) : ''}
                                                    </span>
                                                )) : ''}
                                            </div> : ''
                                    )) : ''
                                )) : ''
                            }
                        </div> :
                        balState.year.length > 0 && keyType == 604 ?
                            <div>
                                <div className={styles.dataTitle}>
                                    <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                                    {
                                        (dataType === '0' || dataType === '1') && balState ? balState.year.map((item) => (
                                            <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item.reportYearTime ? item.reportYearTime : ''}</span>
                                        )) : ''
                                    } {
                                        (dataType === '0' || dataType === '2') && balState ? balState.interim.map((item) => (
                                            <span>{intl.locale === "zh-CN" ? interimYearCn : interimYearEn}{item.reportYearTime ? item.reportYearTime : ''}</span>
                                        )) : ''
                                    }
                                </div>
                                <div>
                                    <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '资产' : 'assets'}</span>
                                    <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，CNY）' : '(Unit: TEN thousand Yuan, CNY)'}</span>
                                </div>
                                {
                                    balState.year.length > 0 ? balState.year[0].lineitem.map((cas, index) => (
                                        codeMap ? codeMap.map((code) => (
                                            code.coaItem == cas.coaCode ?
                                                <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                                    <span>
                                                        {code.coaValueEn}
                                                    </span>
                                                    {(dataType === '0' || dataType === '1') && balState.year.length > 0 ? balState.year.map((yearItem) => (
                                                        <span>
                                                            {yearItem.lineitem ? yearItem.lineitem.map((item) => (
                                                                <span>{code.coaItem == item.coaCode ? item.Value ? parseInt(item.Value) : '' : ''}</span>
                                                            )) : ''}
                                                        </span>
                                                    )) : ''}
                                                    {(dataType === '0' || dataType === '2') && balState.interim.length > 0 ? balState.interim.map((interimItem) => (
                                                        <span>
                                                            {interimItem.lineitem ? interimItem.lineitem.map((item) => (
                                                                <span>{code.coaItem == item.coaCode ? item.Value ? parseInt(item.Value) : '' : ''}</span>
                                                            )) : ''}
                                                        </span>
                                                    )) : ''}˝
                                                </div> : ''
                                        )) : ''
                                    )) : ''
                                }
                            </div> :
                            financial && keyType == 601 ?
                                <div>
                                    <div className={styles.dataTitle}>
                                        <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                                        {
                                            financial ? Object.keys(financial).map((item) => (
                                                <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item ? item : ''}</span>
                                            )) : ''
                                        }
                                    </div>
                                    <div>
                                        <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '现金流量' : 'The cash flow'}</span>
                                        <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，CNY）' : '(Unit: TEN thousand Yuan, CNY)'}</span>
                                    </div>
                                    {
                                        financial ? Object.keys(financial).map((item, index) => (
                                            financial[item] ?
                                                financial[item].Annual ?
                                                    financial[item].Annual[0] ?
                                                        financial[item].Annual[0].dataContentObject ?
                                                            financial[item].Annual[0].dataContentObject.growthAbility ?
                                                                Object.keys(financial[item].Annual[0].dataContentObject.growthAbility).map((grow, index) => (
                                                                    <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                                                        <span>
                                                                            {nameState && nameState[grow] ? nameState[grow] : grow}
                                                                        </span>
                                                                        {financial ? Object.keys(financial).map((itemValue) => (
                                                                            <span>{financial[item].Annual[0].dataContentObject.growthAbility[grow] ? parseInt(financial[item].Annual[0].dataContentObject.growthAbility[grow]) : ''}</span>
                                                                        )) : ''}
                                                                    </div>
                                                                ))
                                                                : '' : '' : '' : '' : '')) : ''
                                    }
                                </div> :
                                financial && keyType == 605 ?
                                    <div>
                                        <div className={styles.dataTitle}>
                                            <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                                            {
                                                financial ? Object.keys(financial).map((item) => (
                                                    <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item ? item : ''}</span>
                                                )) : ''
                                            }
                                        </div>
                                        <div>
                                            <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '现金流量' : 'The cash flow'}</span>
                                            <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，CNY）' : '(Unit: TEN thousand Yuan, CNY)'}</span>
                                        </div>
                                        {
                                            financial ? Object.keys(financial).map((item, index) => (
                                                financial[item] ?
                                                    financial[item].Annual ?
                                                        financial[item].Annual[0] ?
                                                            financial[item].Annual[0].dataContentObject ?
                                                                financial[item].Annual[0].dataContentObject.profitabilityAndIncomeQuality ?
                                                                    Object.keys(financial[item].Annual[0].dataContentObject.profitabilityAndIncomeQuality).map((profit, index) => (
                                                                        <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                                                            <span>
                                                                                {nameState && nameState[profit] ? nameState[profit] : profit}
                                                                            </span>
                                                                            {financial ? Object.keys(financial).map((itemValue) => (
                                                                                <span>{financial[item].Annual[0].dataContentObject.profitabilityAndIncomeQuality[profit] ? parseInt(financial[item].Annual[0].dataContentObject.profitabilityAndIncomeQuality[profit]) : ''}</span>
                                                                            )) : ''}
                                                                        </div>
                                                                    ))
                                                                    : '' : '' : '' : '' : '')) : ''
                                        }
                                    </div> :
                                    financial && keyType == 606 ?
                                        <div>
                                            <div className={styles.dataTitle}>
                                                <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                                                {
                                                    financial ? Object.keys(financial).map((item) => (
                                                        <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item ? item : ''}</span>
                                                    )) : ''
                                                }
                                            </div>
                                            <div>
                                                <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '现金流量' : 'The cash flow'}</span>
                                                <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，CNY）' : '(Unit: TEN thousand Yuan, CNY)'}</span>
                                            </div>
                                            {
                                                financial ? Object.keys(financial).map((item, index) => (
                                                    financial[item] ?
                                                        financial[item].Annual ?
                                                            financial[item].Annual[0] ?
                                                                financial[item].Annual[0].dataContentObject ?
                                                                    financial[item].Annual[0].dataContentObject.operatingCapacity ?
                                                                        Object.keys(financial[item].Annual[0].dataContentObject.operatingCapacity).map((oper, index) => (
                                                                            <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                                                                <span>
                                                                                    {nameState && nameState[oper] ? nameState[oper] : oper}
                                                                                </span>
                                                                                {financial ? Object.keys(financial).map((itemValue) => (
                                                                                    <span>{financial[item].Annual[0].dataContentObject.operatingCapacity[oper] ? parseInt(financial[item].Annual[0].dataContentObject.operatingCapacity[oper]) : ''}</span>
                                                                                )) : ''}
                                                                            </div>
                                                                        ))
                                                                        : '' : '' : '' : '' : '')) : ''
                                            }
                                        </div> :
                                        financial && keyType == 608 ?
                                            <div>
                                                <div className={styles.dataTitle}>
                                                    <span>{intl.locale === "zh-CN" ? '报告期' : 'During the reporting period'}</span>
                                                    {
                                                        financial ? Object.keys(financial).map((item) => (
                                                            <span>{intl.locale === "zh-CN" ? titleYearCn : titleYearEn}{item ? item : ''}</span>
                                                        )) : ''
                                                    }
                                                </div>
                                                <div>
                                                    <span className={styles.levelTitle}>{intl.locale === "zh-CN" ? '现金流量' : 'The cash flow'}</span>
                                                    <span className={styles.levelTitleExt}>{intl.locale === "zh-CN" ? '（单位：万元，CNY）' : '(Unit: TEN thousand Yuan, CNY)'}</span>
                                                </div>
                                                {
                                                    financial ? Object.keys(financial).map((item, index) => (
                                                        financial[item] ?
                                                            financial[item].Annual ?
                                                                financial[item].Annual[0] ?
                                                                    financial[item].Annual[0].dataContentObject ?
                                                                        financial[item].Annual[0].dataContentObject.capitalStructureAndSolvency ?
                                                                            Object.keys(financial[item].Annual[0].dataContentObject.capitalStructureAndSolvency).map((capital, index) => (
                                                                                <div className={[styles.dataContent, index % 2 == 0 ? styles.oddBack : ''].join(' ')}>
                                                                                    <span>
                                                                                        {nameState && nameState[capital] ? nameState[capital] : capital}
                                                                                    </span>
                                                                                    {financial ? Object.keys(financial).map((itemValue) => (
                                                                                        <span>{financial[item].Annual[0].dataContentObject.capitalStructureAndSolvency[capital] ? parseInt(financial[item].Annual[0].dataContentObject.capitalStructureAndSolvency[capital]) : ''}</span>
                                                                                    )) : ''}
                                                                                </div>
                                                                            ))
                                                                            : '' : '' : '' : '' : '')) : ''
                                                }
                                            </div> :
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false}  />}
        </div>
    )
};

export default FinancialData;
