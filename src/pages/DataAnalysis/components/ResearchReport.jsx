import { message, Table, Pagination, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryResearchReport } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { subGroupArray, timeSpan } from '@/utils/utils';
import moment from 'moment';

const { RangePicker } = DatePicker;
let dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const ResearchReport = (props) => {
    let pageTotal = '共';
    let pageItems = '条';
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('');//一级名称
    const [loadingState, setLoadingState] = useState(true);//loading
    const [reportData, setReportData] = useState({});//所有数据
    const [reportPage, setReportPage] = useState([]);//分页数据

    const columns = [
        {
            title: <FormattedMessage id="pages.researchReport.researchDate" defaultMessage="研报日期" />,
            dataIndex: 'researchDate',
            render: (val, record) => {
                return <span>{record.TIMESTAMP ? moment(record.TIMESTAMP).format('YYYY-MM-DD') : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.researchReport.reportId" defaultMessage="报告ID" />,
            dataIndex: 'reportId',
            render: (val, record) => {
                return <span>{record.LOW ? record.LOW : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.researchReport.releaseTime" defaultMessage="发布时间" />,
            dataIndex: 'releaseTime',
            render: (val, record) => {
                return <span>{record.CLOSE ? record.CLOSE : ''}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.researchReport.size" defaultMessage="大小" />,
            dataIndex: 'size',
            render: (val, record) => {
                return <span>{record.VOLUME ? record.VOLUME : ''}</span>
            }
        },
    ];

    //研究报告
    let params = {
        ric: '',
        startTime: moment(timeSpan(7).startDate).format(dateFormat),
        endTime: moment(timeSpan(7).endDate).format(dateFormat),
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
            if ((keyType && keyType == 405) || keyType == 0) {
                setOneInfoTitle('研究报告');
            }
        } else {
            pageTotal = 'Total';
            pageItems = 'items';
            if ((keyType && keyType == 405) || keyType == 0) {
                setOneInfoTitle('The research report');
            }
        }
        queryResearchReportLists(ric);

    }, [ric, keyType]);

    //查询股价列表
    const queryResearchReportLists = (ric) => {
        params.ric = ric;
        queryResearchReport(params).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        setReportData(res.data);
                        setReportPage(subGroupArray(res.data, 20)[0]);
                    }
                } else {
                    setLoadingState(false);
                    message.error(res.message);
                }
            }
        )
    }


    const [cutPage, setCutPage] = useState(1);

    const onChange = (page, pageSize) => {
        setCutPage(page);
        setReportPage(subGroupArray(reportData ? reportData : [], pageSize)[page - 1]);
    }

    const onShowSizeChange = (current, size) => {
        setCutPage(current);
        setReportPage(subGroupArray(reportData ? reportData.Row : [], size)[current - 1]);
    }

    //设置时间值
    const setTimeData = (e) => {
        params.startTime = moment(e[0]._d).format(dateFormat);
        params.endTime = moment(e[1]._d).format(dateFormat);
        queryResearchReportLists(ric);
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
                        defaultValue={[moment(timeSpan(7).startDate, dateFormat), moment(timeSpan(7).endDate, dateFormat)]}
                        onChange={(e) => setTimeData(e)} />
                </div>
                <div>
                    <Table loading={loadingState}
                        scroll={{ x: '100%' }}
                        rowKey={(index, record) => index}
                        columns={columns}
                        rowClassName={getRowClassName}
                        dataSource={reportPage}
                        pagination={false} />
                    <div className={styles.pageBox}>
                        <Pagination
                            total={reportData ? reportData.length : 0}
                            showTotal={(total) => `${pageTotal} ${reportData ? reportData.length : 0} ${pageItems} `}
                            defaultPageSize={20}
                            current={cutPage ? cutPage : 1}
                            onChange={onChange}
                            onShowSizeChange={onShowSizeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ResearchReport;
