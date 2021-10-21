import { message, Table, Pagination } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { queryNoticeByRic, downloadkNotice, querytNewsByRic } from '../service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { fileSizeTransform, mimeType, subGroupArray, previewXHR } from '@/utils/utils';
import moment from 'moment';
import { DownloadOutlined } from '@ant-design/icons';


const NewsNotice = (props) => {
    let pageTotal = '共';
    let pageItems = '条';
    const { keyType, ric } = props;
    const userInfo = getAuthority();//获取用户相关信息
    const [oneInfoTitle, setOneInfoTitle] = useState('新闻公告');//一级名称
    const [loadingState, setLoadingState] = useState(true);//loading
    const [newsNoticeData, setNewsNoticeData] = useState({});//所有数据
    const [newsNoticePage, setNewsNoticePage] = useState([]);//分页数据

    //新闻数据
    const columnsNews = [
        {
            title: <FormattedMessage id="pages.newsNotice.sequenceNumber" defaultMessage="序号" />,
            dataIndex: 'sequenceNumber',
            width: 100,
            render: (val, record, index) => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.newsNotice.newsHeadlines" defaultMessage="新闻标题" />,
            dataIndex: 'newsHeadlines',
            render: (val, record) => {
                return <span>
                    <Link target="_blank" to={{
                        pathname: `/news/details/${record.ID}`
                    }}>
                        <span className={styles.checkInfo} style={{ color: 'white' }}>{record.HT}</span>
                    </Link>
                </span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.releaseDate" defaultMessage="发布时间" />,
            dataIndex: 'releaseDate',
            width: 200,
            render: (val, record) => {
                return <span>{record.LT ? moment(record.LT).format("YYYY-MM-DD HH:mm:ss") : ''}</span>
            }
        },

    ];

    //研究报告
    const columns = [
        {
            title: <FormattedMessage id="pages.companyNotice.noticeDate" defaultMessage="公告日期" />,
            dataIndex: 'arriveDate',
            sorter: {
                compare: (a, b) => {
                    let aTimeStr = a.submissionInfo[0].arriveDate;
                    let bTimeStr = b.submissionInfo[0].arriveDate;
                    let aTime = new Date(aTimeStr).getTime();
                    let bTime = new Date(bTimeStr).getTime();
                    return aTime - bTime;
                },
                multiple: 1,
            },
            render: (val, record) => {
                return <span>{moment(record.submissionInfo[0].arriveDatenew).format('YYYY-MM-DD')}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.documentTitle" defaultMessage="标题" />,
            dataIndex: 'documentTitle',
            width: 300,
            render: (val, record) => {
                return <span className={styles.checkInfo} onClick={() => previewNotice(record)}>{record.submissionInfo[0].documentTitle ? record.submissionInfo[0].documentTitle : 'No Title'}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.releaseDate" defaultMessage="发布时间" />,
            dataIndex: 'releaseDate',
            sorter: {
                compare: (a, b) => {
                    let aTimeString = a.submissionInfo[0].releaseDate;
                    let bTimeString = b.submissionInfo[0].releaseDate;
                    let aTime = new Date(aTimeString).getTime();
                    let bTime = new Date(bTimeString).getTime();
                    return aTime - bTime;
                },
                multiple: 2,
            },
            render: (val, record) => {
                return <span>{moment(record?.submissionInfo[0]?.releaseDate).format("HH:mm")}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.fileSize" defaultMessage="大小" />,
            dataIndex: 'size',
            render: (val, record) => {
                return <span>{fileSizeTransform(record?.submissionInfo[0]?.size)}</span>
            }
        },
        {
            title: <FormattedMessage id="pages.companyNotice.operate" defaultMessage="操作" />,
            dataIndex: 'operate',
            render: (val, record) => {
                return <a className={styles.checkInfo}><DownloadOutlined onClick={() => getFileSrc(record)} /></a>
            }
        },
    ];

    //默认ric
    let paramsNews = {
        size: 200,
        ric: '',
        accessToken: userInfo.accessToken
    }
    //研究报告    
    let noticeParams = {
        ric: "",  //可以为空
        stockTypes: [],  //股票的分类 跟公告接口传参一样。
        pageSize: 20,      //不能为空
        currentPage: 1,   //不能为空
        language: "ZH",    //不能为空
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
            noticeParams.language = 'ZH';
            pageTotal = '共';
            pageItems = '条';
            if ((keyType && keyType == 201) || keyType == 0) {
                setOneInfoTitle('新闻公告');
            } else if (keyType && keyType == 202) {
                setOneInfoTitle('研究报告');
                queryNewsNoticeLists(ric);
            }
        } else {
            noticeParams.language = 'EN';
            pageTotal = 'Total';
            pageItems = 'items';
            if ((keyType && keyType == 201) || keyType == 0) {
                setOneInfoTitle('Press Announcements');
            } else if (keyType && keyType == 202) {
                setOneInfoTitle('Research Reports');
                queryNewsNoticeLists(ric);
            }
        }
        querytNewsByRicLists(ric)

    }, [ric, keyType]);

    const [newsList, setNewsList] = useState([]);//新闻数据
    const [newsPage, setNewsPage] = useState([]);//新闻分页
    //查询新闻列表
    const querytNewsByRicLists = (ric) => {
        paramsNews.ric = ric;
        querytNewsByRic(paramsNews).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        setNewsList(res.data?.RetrieveHeadlineML_Response_1?.HeadlineMLResponse?.HEADLINEML?.HL)
                        setNewsPage(subGroupArray(res.data?.RetrieveHeadlineML_Response_1?.HeadlineMLResponse?.HEADLINEML?.HL, 20)[0]);
                    }
                } else {
                    setLoadingState(false);
                    message.error(res.message);
                }
            }
        )
    }

    //查询公告列表
    const queryNewsNoticeLists = (ric) => {
        noticeParams.ric = ric;
        queryNoticeByRic(noticeParams).then(
            res => {
                if (res.state) {
                    setLoadingState(false);
                    if (res.data) {
                        setNewsNoticeData(res?.data?.SearchSubmissions_Response_1 ? res?.data?.SearchSubmissions_Response_1 : []);
                        setNewsNoticePage(res?.data?.SearchSubmissions_Response_1?.submissionStatusAndInfo);
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
        if (keyType == 201) {
            setNewsPage(subGroupArray(newsList, pageSize)[page - 1]);
        } else if (keyType == 202) {
            noticeParams.pageSize = pageSize ? pageSize : 20;
            noticeParams.currentPage = page ? page : 1;
            queryNewsNoticeLists(ric);
        }
    }

    const onShowSizeChange = (current, size) => {
        setCutPage(current);
        if (keyType == 201) {
            setNewsPage(subGroupArray(newsList, size)[current - 1]);
        } else if (keyType == 202) {
            noticeParams.pageSize = size ? size : 20;
            noticeParams.currentPage = current ? current : 1;
            queryNewsNoticeLists(ric);
        }
    }

    //文件下载参数
    let fileParams = {
        fileType: '',
        dcn: '',
        originalFileName: '',
        size: '',
        accessToken: userInfo.accessToken
    }
    const getNoticeFile = (item, type) => {
        setLoadingState(true);
        let { fileType, DCN, originalFileName, size } = item?.submissionInfo[0];
        fileParams.fileType = fileType;
        fileParams.dcn = DCN;
        fileParams.originalFileName = DCN;
        fileParams.size = size;
        downloadkNotice(fileParams).then(
            res => {
                setLoadingState(false);
                let documentType = mimeType(fileType);
                let blob = new Blob([res], { type: documentType + ';chartset=UTF-8' });
                const blobUrl = window.URL.createObjectURL(blob);
                if (type === 'down') {
                    const aElement = document.createElement("a");
                    const filename = originalFileName ? originalFileName : DCN; // 设置文件名称
                    aElement.href = blobUrl; // 设置a标签路径
                    aElement.download = filename;
                    aElement.click();
                    window.URL.revokeObjectURL(blobUrl);
                } else {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.target = "_blank";
                    link.click();
                }

            }
        )
    }

    //公告预览
    const previewNotice = (item) => {
        let { fileType, DCN, originalFileName, size } = item?.submissionInfo[0];
        const xhrUrl = `${PATH}/news/downloadkNotice?dcn=${DCN}&size=${size}&fileName=${originalFileName}&fileType=${fileType}`;
        setLoadingState(true);
        previewXHR(xhrUrl, function (data) {
            if (data.status == 200) {
                setLoadingState(false);
                let documentType = mimeType(fileType);
                let blob = new Blob([data.response], { type: documentType + ';chartset=UTF-8' });
                let fileURL = URL.createObjectURL(blob)
                window.open(fileURL)
            }
        })
    }

    //文件下载a标签的src
    const getFileSrc = (item) => {
        let { fileType, DCN, size } = item?.submissionInfo[0];
        const oa = document.createElement('a');
        oa.href = `${PATH}/news/downloadkNotice?dcn=${DCN}&size=${size}&fileName=${DCN}&fileType=${fileType}`;
        oa.setAttribute('target', '_blank');
        document.body.appendChild(oa);
        oa.click();
    }

    return (
        <div className={styles.companyInfo}>
            <div className={styles.infoTitle}>
                <span className={styles.titleTxt}>{oneInfoTitle}</span>
            </div>
            {
                (keyType == 201 || keyType == 0) ?
                    <div>
                        <Table loading={loadingState}
                            scroll={{ x: '100%' }}
                            rowKey={(record) => record.ID}
                            columns={columnsNews}
                            rowClassName={getRowClassName}
                            dataSource={newsPage}
                            pagination={false} />
                        <div className={styles.pageBox}>
                            <Pagination
                                total={newsList.length}
                                showTotal={(total) => `${pageTotal} ${newsList.length} ${pageItems} `}
                                defaultPageSize={20}
                                current={cutPage ? cutPage : 1}
                                onChange={onChange}
                                onShowSizeChange={onShowSizeChange}
                            />
                        </div>
                    </div> :
                    keyType == 202 ?
                        <div>
                            <Table loading={loadingState}
                                scroll={{ x: '100%' }}
                                rowKey={(record) => record.commonID}
                                columns={columns}
                                rowClassName={getRowClassName}
                                dataSource={newsNoticePage}
                                pagination={false} />
                            <div className={styles.pageBox}>
                                <Pagination
                                    total={newsNoticeData.totalHit}
                                    showTotal={(total) => `${pageTotal} ${newsNoticeData.totalHit ? newsNoticeData.totalHit : 0} ${pageItems} `}
                                    defaultPageSize={20}
                                    current={cutPage ? cutPage : 1}
                                    onChange={onChange}
                                    onShowSizeChange={onShowSizeChange}
                                />
                            </div>
                        </div>
                        : ''}
        </div>
    )
};

export default NewsNotice;
