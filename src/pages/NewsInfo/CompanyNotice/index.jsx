import { Button, message, Table, Input, Tree, Modal, Pagination, AutoComplete, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { queryClassList, queryNoticeClass, queryNoticeList, preview, downloadkNotice, queryRicLists, queryNoticeListByRic, collectionAdd, queryCollectionByUserId } from './service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { CarryOutOutlined, DownloadOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fileSizeTransform, isEmpty, mimeType, previewXHR, subGroupArray } from '@/utils/utils';

let classId = '';
let treeCHeckId = [];
let codeValue = '';//code值
const { Option } = AutoComplete;
const { TabPane } = Tabs;
let pageTotal = '共';
let pageItems = '条';

const CompanyNotice = () => {


  //公告列表
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
      title: <FormattedMessage id="pages.companyNotice.securitiesCode" defaultMessage="证券代码" />,
      dataIndex: 'mxid',
      render: (val, record) => {
        return <span>{ricData ? ricData[record.submissionInfo[0].companyInfo[0].mxid] : record.submissionInfo[0].companyInfo[0].mxid}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.documentTitle" defaultMessage="标题" />,
      dataIndex: 'documentTitle',
      width: 300,
      render: (val, record) => {
        return <span className={styles.checkInfo} onClick={() => previewNotice(record, '1')}>{record.submissionInfo[0].documentTitle ? record.submissionInfo[0].documentTitle : 'No Title'}</span>
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
        return <span>{moment(record.submissionInfo[0].releaseDate).format("HH:mm")}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.fileSize" defaultMessage="大小" />,
      dataIndex: 'size',
      render: (val, record) => {
        return <span>{fileSizeTransform(record.submissionInfo[0].size)}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.operate" defaultMessage="操作" />,
      dataIndex: 'operate',
      render: (val, record) => {
        return <a className={styles.checkInfo}>
          <DownloadOutlined onClick={() => getFileSrc(record, '1')} style={{ marginRight: 20 }} />
          <StarOutlined onClick={() => collectionNotice(record)} />
        </a>
      }
    },
  ];

  const userInfo = getAuthority();//获取用户相关信息
  let params = {
    language: 'ZH',
    accessToken: userInfo.accessToken
  }

  //一级分类
  const [twoLevel, setTwoLevel] = useState([]);//二级
  const [threeLevel, setThreeLevel] = useState([]);//三级
  const [levelTwoState, setLevelTwoState] = useState(0);
  const [levelThreeState, setLevelThreeState] = useState(0);
  const [loadingState, setLoadingState] = useState(true);//loading
  const [loadingListState, setLoadingListState] = useState(true);//list loading
  const [pageList, setPageList] = useState([]);
  /** 国际化配置 */
  const intl = useIntl();

  const [treeNotice, setTreeNotice] = useState([]);//树形菜单数据
  const [noticekey, setNoticekey] = useState({});//默认展开key
  const [noticeCheckedKey, setNoticeCheckedKey] = useState({});//默认选中节点
  const [noticeId, setNoticeId] = useState({});//默认选中节点id
  const [checkLevel, setCheckLevel] = useState('');//选中的地区码

  //查询公告列表参数
  let paramsList = {
    twoLevelNewsClassId: '', //国家分类 必填
    stockTypes: [], //股票分类  非必填（只给二级分类的id 如果用户选择一级就把当前一级下的所有二级id传递进来）
    pageSize: 20,
    currentPage: 1,
    accessToken: userInfo.accessToken,
    language: "ZH"
  };

  //parentId
  useEffect(() => {
    if (intl.locale === "zh-CN") {
      params.language = 'ZH';
      paramsList.language = 'ZH';
      pageTotal = '共';
      pageItems = '条';
    } else {
      params.language = 'EN';
      paramsList.language = 'EN';
      pageTotal = 'Total';
      pageItems = 'items';
    }
    //查询地区分类
    queryClassList(params).then(
      res => {
        if (res.state) {
          setLoadingState(false);
          if (res.data) {
            if (res.data.length > 0 && res.data[0].subClass) {
              if (res.data[0].subClass.length > 0) {
                for (let i = 0; i < res.data[0].subClass.length; i++) {
                  let item = res.data[0].subClass[i];
                  if (item.ofType === '公司公告') {
                    setTwoLevel(item.subClass);
                    if (item.subClass.length > 0) {
                      if (!levelTwoState) {
                        setLevelTwoState(item.subClass[0].id);
                      }
                      classId = item.subClass[0].id;
                      paramsList.twoLevelNewsClassId = item.subClass[0].id;
                      queryNoticeClassList();
                    }
                  }
                }
              }

            }
          }

        } else {
          setLoadingState(false);
          message.error(res.message);
        }
      }
    );

    onSetLeafIcon();

  }, []);

  //查询公告分类
  const queryNoticeClassList = () => {
    queryNoticeClass(params).then(
      res => {
        if (res?.state) {
          //处理后台数据成树形菜单格式
          if (res.data.length > 0) {
            let treeOneList = [];
            res.data.map((item, index) => {
              if (index === 0) {
                setNoticekey(item.id);
              }
              let treeOne = {
                title: item.stockName,
                key: item.id,
                icon: <CarryOutOutlined />,
              }
              let treeTwoList = [];
              if (item.subsStocks.length > 0) {
                if (index === 0) {
                  setNoticeCheckedKey(item.subsStocks[0].id);
                  setNoticeId(item.subsStocks[0].id);
                  if (paramsList.stockTypes.length > 0) {
                    paramsList.stockTypes.map((st) => {
                      if (st !== item.subsStocks[0].id) {
                        // treeCHeckId.push(item.subsStocks[0].id);
                      }
                    })
                  } else {
                    // treeCHeckId.push(item.subsStocks[0].id);
                  }
                }
                item.subsStocks.map((subItem) => {
                  let subTreeOne = {
                    title: subItem.stockName,
                    key: subItem.id,
                    icon: <CarryOutOutlined />,
                  }
                  treeTwoList.push(subTreeOne);
                })
              }
              treeOne.children = treeTwoList;
              treeOneList.push(treeOne);
            })
            setTreeNotice(treeOneList);
            queryNoticeLists();
          }
        } else {
          message.error(res.message);
        }
      })
  }

  const [newsList, setNewsList] = useState([]);
  //根据二级目录查列表
  const getNoticeList = (item) => {
    setLoadingState(false);
    //设置不同分类的状态跟数据
    if (item.classLevel === '3') {
      setLevelTwoState(item.id);
      if (item.subClass) {
        setLevelThreeState(item.subClass.length > 0 ? item.subClass[0].id : 0);
        setThreeLevel(item.subClass);
      } else {
        setThreeLevel([]);
      }
    } else if (item.classLevel === '4') {
      setLevelThreeState(item.id);
      if (item.subClass) {
        setLevelThreeState(item.subClass.length > 0 ? item.subClass[0].id : 0);
        setThreeLevel(item.subClass);
      } else {
        // setThreeLevel([]);
      }
    } else if (item.classLevel === '5') {
      setLevelThreeState(item.id);
    }

    if (!item.subClass) {
      paramsList.twoLevelNewsClassId = item.id;
      classId = item.id;
    } else {
      if (item.subClass.length > 0) {
        paramsList.twoLevelNewsClassId = item.subClass[0].id;
        classId = item.subClass[0].id;
      }
    }
    if (codeValue) {
      queryNoticeListByRicInput(checkedKeys)
    } else {
      queryNoticeLists(checkedKeys);
    }
  }

  const [showLine, setShowLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(true);

  const onSelect = (selectedKeys, info) => {
    //判断是否有子节点
    if (info.node.children) {
      let nodeList = [];
      info.node.children.map((nodeItem) => {
        nodeList.push(nodeItem.key);
      })
      paramsList.stockTypes = nodeList;
      treeCHeckId = nodeList;
    } else {
      if (paramsList.stockTypes.length > 0) {
        paramsList.stockTypes.map((st) => {
          if (st !== selectedKeys) {
            paramsList.stockTypes = selectedKeys;
            treeCHeckId = selectedKeys;
          }
        })
      } else {
        paramsList.stockTypes = selectedKeys;
        treeCHeckId = selectedKeys;
      }
    }
    queryNoticeLists();
  };
  //展示线条
  const onSetLeafIcon = () => {
    setShowLeafIcon(false);
    setShowLine({
      showLeafIcon: false,
    });
  };

  const [checkedKeys, setCheckedKeys] = useState([]);

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
    if (codeValue) {
      queryNoticeListByRicInput(checkedKeysValue)
    } else {
      queryNoticeLists(checkedKeysValue);
    }
  };

  const [noticeList, setNoticeList] = useState([]);//公告列表数据
  const [ricData, setRicData] = useState({});//RIC码集合

  //查询公告列表数据
  const queryNoticeLists = (checkList) => {
    paramsList.accessToken = userInfo.accessToken;
    paramsList.twoLevelNewsClassId = classId ? classId : '';
    if (checkList) {
      paramsList.stockTypes = checkList;
    } else {
      paramsList.stockTypes = treeCHeckId ? treeCHeckId : '';
    }
    if (isEmpty(classId)) {
      setLoadingListState(false);
      return false;
    } else {
      setLoadingListState(true);
      queryNoticeList(paramsList).then(
        res => {
          if (res.state) {
            setLoadingListState(false);
            if (res.data) {
              setNoticeList(res?.data?.SearchSubmissions_Response_1?.submissionStatusAndInfo);
              setPageList(res?.data?.SearchSubmissions_Response_1);
              setRicData(res?.data?.ricMap);
            } else {
              setNoticeList([]);
              setPageList([]);
              setRicData([]);
            }

          } else {
            setLoadingListState(false);
            message.error(res.message);
          }
        }
      );
    }

  }

  const tableWdith = window.innerWidth - 470;//表格区域宽度

  const [modelState, setModelState] = useState(false);

  //文件下载参数
  let fileParams = {
    fileType: '',
    dcn: '',
    originalFileName: '',
    size: '',
    accessToken: userInfo.accessToken
  }
  const getNoticeFile = (item, type) => {
    setLoadingListState(true);
    let { fileType, DCN, originalFileName, size } = item?.submissionInfo[0];
    fileParams.fileType = fileType;
    fileParams.dcn = DCN;
    fileParams.originalFileName = DCN;
    fileParams.size = size;
    preview(fileParams).then(
      res => {
        setLoadingListState(false);
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
          link.href = blobUrl;
          link.target = "_blank";
          link.click();
        }

      }
    )
  }

  //公告预览
  const previewNotice = (item, type) => {
    let fileType, DCN, originalFileName, size;
    if (type == '1') {
      fileType = item?.submissionInfo[0]?.fileType;
      DCN = item?.submissionInfo[0]?.DCN;
      originalFileName = item?.submissionInfo[0]?.originalFileName;
      size = item?.submissionInfo[0]?.size;
    } else if (type == '2') {
      fileType = item?.fileType;
      DCN = item?.dcn;
      originalFileName = item?.fileName;
      size = item?.size;
    }

    const xhrUrl = `${PATH}/news/downloadkNotice?dcn=${DCN}&size=${size}&fileName=${originalFileName}&fileType=${fileType}`;
    setLoadingListState(true);
    previewXHR(xhrUrl, function (data) {
      if (data.status == 200) {
        setLoadingListState(false);
        let documentType = mimeType(fileType);
        let blob = new Blob([data.response], { type: documentType + ';chartset=UTF-8' });
        let fileURL = URL.createObjectURL(blob)
        window.open(fileURL)
      }
    })
  }
  //文件下载a标签的src
  const getFileSrc = (item, type) => {
    let fileType, DCN, originalFileName, size;
    if (type == '1') {
      fileType = item?.submissionInfo[0]?.fileType;
      DCN = item?.submissionInfo[0]?.DCN;
      originalFileName = item?.submissionInfo[0]?.originalFileName;
      size = item?.submissionInfo[0]?.size;
    } else if (type == '2') {
      fileType = item?.fileType;
      DCN = item?.dcn;
      originalFileName = item?.fileName;
      size = item?.size;
    }
    const oa = document.createElement('a');
    oa.href = `${PATH}/news/downloadkNotice?dcn=${DCN}&size=${size}&fileName=${originalFileName}&fileType=${fileType}`;
    oa.setAttribute('target', '_blank');
    document.body.appendChild(oa);
    oa.click();
  }
  //关闭弹框
  const handleCancel = () => {
    setModelState(false);
  }

  //赋值参数
  const setInputValue = (e) => {
    codeValue = e.target.defaultValue;
  }

  const [cutPage, setCutPage] = useState(1);

  const onChange = (page, pageSize) => {
    paramsList.pageSize = pageSize ? pageSize : '20';
    paramsList.currentPage = page ? page : '1';
    paramsRicList.pageSize = pageSize ? pageSize : '20';
    paramsRicList.currentPage = page ? page : '1';
    setCutPage(page);
    if (codeValue) {
      queryNoticeListByRicInput(checkedKeys)
    } else {
      queryNoticeLists(checkedKeys);
    }
  }

  const onShowSizeChange = (current, size) => {
    paramsList.pageSize = size ? size : '20';
    paramsList.currentPage = current ? current : '1';
    paramsRicList.pageSize = size ? size : '20';
    paramsRicList.currentPage = current ? current : '1';
    setCutPage(current);
    if (codeValue) {
      queryNoticeListByRicInput(checkedKeys)
    } else {
      queryNoticeLists(checkedKeys);
    }
  }

  //ric码查询结果
  const [ricList, setRicList] = useState([]);
  let ricParams = {
    ric: '',
    pageSize: 10,
    page: 1,
    accessToken: userInfo.accessToken,
  }

  //模糊查询ric集合
  const queryRicListData = (e) => {
    ricParams.ric = e;
    codeValue = e;
    queryRicLists(ricParams).then(
      res => {
        if (res.state) {
          if (res?.data?.result?.length > 0) {
            setRicList(res.data.result)
          }
        } else {
          message.error(res.message);
        }
      }
    );
  }

  //查询公告列表参数通过ric
  let paramsRicList = {
    ric: '', //ric 必填
    stockTypes: [], //股票分类  非必填（只给二级分类的id 如果用户选择一级就把当前一级下的所有二级id传递进来）
    pageSize: 20,
    currentPage: 1,
    accessToken: userInfo.accessToken,
    language: "ZH"
  };

  const queryNoticeListByRicInput = (checkList) => {
    paramsRicList.ric = codeValue ? codeValue : '';
    if (checkList) {
      paramsRicList.stockTypes = checkList;
    } else {
      paramsRicList.stockTypes = treeCHeckId ? treeCHeckId : '';
    }
    setLoadingListState(true);
    queryNoticeListByRic(paramsRicList).then(
      res => {
        if (res.state) {
          setLoadingListState(false);
          if (res.data) {
            setNoticeList(res?.data?.SearchSubmissions_Response_1?.submissionStatusAndInfo);
            setPageList(res?.data?.SearchSubmissions_Response_1);
            setRicData(res.data.ricMap);
          } else {
            setNoticeList([]);
            setPageList([]);
            setRicData([]);
          }

        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }

  //收藏公告
  const collectionNotice = (item) => {
    let paramsCollection = {
      ric: ricData[item?.submissionInfo[0]?.companyInfo[0]?.mxid],
      id: '',
      dcn: item?.submissionInfo[0]?.DCN,
      size: item?.submissionInfo[0]?.size,
      fileName: item?.submissionInfo[0]?.originalFileName ? item?.submissionInfo[0]?.originalFileName : item?.submissionInfo[0]?.formName,
      fileType: item?.submissionInfo[0]?.fileType,
      publicDate: item?.submissionInfo[0]?.arriveDate ? moment(item?.submissionInfo[0]?.arriveDate).format("yyyy-MM-DD HH:mm:ss") : '',
      noticeDate: item?.submissionInfo[0]?.releaseDate ? moment(item?.submissionInfo[0]?.releaseDate).format("yyyy-MM-DD HH:mm:ss") : '',
      type: 'notice',
      userId: userInfo?.id,
      accessToken: userInfo?.accessToken,
    }
    setLoadingListState(true);
    collectionAdd(paramsCollection).then(
      res => {
        if (res?.state) {
          message.success(intl.locale === "zh-CN" ? '收藏成功' : 'collection successful');
          setLoadingListState(false);
        } else {
          message.error(res?.message)
          setLoadingListState(false);
        }
      }
    )
  }
  //查询收藏
  let paramsCollectionQuery = {
    userId: userInfo?.id,
    type: 'notice',
    accessToken: userInfo.accessToken,
  };
  const [myList, setMyList] = useState([])
  const [myListPage, setMyListPage] = useState([])

  const getCollectionList = () => {
    queryCollectionByUserId(paramsCollectionQuery).then(
      res => {
        if (res?.state) {
          setMyList(res?.data)
          setMyListPage(subGroupArray(res?.data, 20)[0]);
          setLoadingListState(false);
        } else {
          message.error(res?.message)
          setLoadingListState(false);
        }
      }
    )
  }

  const [cutPageMy, setCutPageMy] = useState(1);
  const onChangeMy = (page, pageSize) => {
    setCutPageMy(page);
    setMyListPage(subGroupArray(myList, pageSize)[page - 1]);
  }

  const onShowSizeChangeMy = (current, size) => {
    setCutPageMy(current);
    setMyListPage(subGroupArray(myList, size)[current - 1]);
  }

  //切换页面选项卡
  const callback = (key) => {
    if (key == '2') {
      getCollectionList()
    }
  }

  const columnsMy = [
    {
      title: <FormattedMessage id="pages.companyNotice.noticeDate" defaultMessage="公告日期" />,
      dataIndex: 'publicDate',
      sorter: {
        compare: (a, b) => {
          let aTimeStr = a.publicDate;
          let bTimeStr = b.publicDate;
          let aTime = new Date(aTimeStr).getTime();
          let bTime = new Date(bTimeStr).getTime();
          return aTime - bTime;
        },
        multiple: 1,
      },
      render: (val, record) => {
        return <span>{moment(record.publicDate).format('YYYY-MM-DD')}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.securitiesCode" defaultMessage="证券代码" />,
      dataIndex: 'ric',
    },
    {
      title: <FormattedMessage id="pages.companyNotice.documentTitle" defaultMessage="标题" />,
      dataIndex: 'fileName',
      width: 300,
      render: (val, record) => {
        return <span className={styles.checkInfo} onClick={() => previewNotice(record, '2')}>{record?.fileName ? record?.fileName : 'No Title'}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.releaseDate" defaultMessage="发布时间" />,
      dataIndex: 'noticeDate',
      sorter: {
        compare: (a, b) => {
          let aTimeString = a.noticeDate;
          let bTimeString = b.noticeDate;
          let aTime = new Date(aTimeString).getTime();
          let bTime = new Date(bTimeString).getTime();
          return aTime - bTime;
        },
        multiple: 2,
      },
      render: (val, record) => {
        return <span>{moment(record.noticeDate).format("HH:mm")}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.fileSize" defaultMessage="大小" />,
      dataIndex: 'size',
      render: (val, record) => {
        return <span>{fileSizeTransform(record.size)}</span>
      }
    },
    {
      title: <FormattedMessage id="pages.companyNotice.operate" defaultMessage="操作" />,
      dataIndex: 'operate',
      render: (val, record) => {
        return <a className={styles.checkInfo}>
          <DownloadOutlined onClick={() => getFileSrc(record, '2')} />
        </a>
      }
    },
  ];


  return (
    <PageContainer loading={loadingState} className={styles.notcieContent}>
      <Tabs defaultActiveKey="1" onChange={callback} style={{ margin: '0px 20px' }}>
        <TabPane tab={intl.locale === "zh-CN" ? '公司公告' : 'company announcement'} key="1">
          <div className={styles.twoLevelTitle}>
            {twoLevel ? twoLevel.map((item, index) => (
              <span key={index} value={item.className}
                onClick={() => getNoticeList(item)}
                className={[styles.twoLevel, item.id === levelTwoState ? styles.twoLevelActive : ''].join(' ')}>
                {item.className}
              </span>
            )) : ''
            }
          </div>
          <div className={[styles.twoLevelTitle, twoLevel.length > 0 ? styles.threeLevelTitle : ''].join(' ')}>
            {threeLevel ? threeLevel.map((item, index) => (
              <span key={index} value={item.className}
                onClick={() => getNoticeList(item)}
                className={[styles.threeLevel, item.id === levelThreeState ? styles.threeLevelActive : styles.txtCoWh].join(' ')}>
                {item.className}
              </span>
            )) : ''
            }
          </div>
          <div style={{ 'width': '100%' }}>
            <div className={styles.treeNotice}>
              <Tree
                showLine={showLine}
                showIcon={false}
                defaultExpandedKeys={[noticekey]}
                defaultSelectedKeys={[noticeCheckedKey]}
                treeData={treeNotice}
                onSelect={onSelect}
                checkable={true}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
              />
            </div>
            <div className={styles.tableNotice}>
              <AutoComplete className={styles.searchInput}
                onChange={(e) => queryRicListData(e)}
                // open={true}
                name='code'
                style={{ marginTop: '-2px' }}
                placeholder={intl.formatMessage({
                  id: 'pages.companyNotice.code',
                  defaultMessage: '输入代码',
                })} >
                {ricList.map((ric, index) => (
                  <Option key={index} value={ric.ric}>
                    {ric.ric}
                  </Option>
                ))}
              </AutoComplete>
              <Button onClick={() => queryNoticeListByRicInput()}>
                <FormattedMessage id="pages.companyNotice.search" defaultMessage="搜索" />
              </Button>
              <Table loading={loadingListState}
                scroll={{ x: '100%' }}
                rowKey={(record) => record.commonID}
                columns={columns}
                dataSource={noticeList}
                pagination={false} />
              <Pagination
                total={pageList.totalHit}
                showTotal={(total) => `${pageTotal} ${pageList.totalHit ? pageList.totalHit : 0} ${pageItems} `}
                defaultPageSize={20}
                // defaultCurrent={1}
                current={cutPage ? cutPage : 1}
                onChange={onChange}
                onShowSizeChange={onShowSizeChange}
              />

            </div>
          </div>
        </TabPane>
        <TabPane tab={intl.locale === "zh-CN" ? '我的收藏' : 'My collection'} key="2">
          <Table loading={loadingListState}
            scroll={{ x: '100%' }}
            rowKey={(record) => record.id}
            columns={columnsMy}
            dataSource={myListPage}
            pagination={false} />
          <Pagination
            total={myList.length}
            showTotal={(total) => `${pageTotal} ${myList.length ? myList.length : 0} ${pageItems} `}
            defaultPageSize={20}
            current={cutPageMy ? cutPageMy : 1}
            onChange={onChangeMy}
            onShowSizeChange={onShowSizeChangeMy}
          />
        </TabPane>
      </Tabs>

      <div>
        <Modal title='文件预览'
          footer={null}
          onCancel={handleCancel}
          visible={modelState}
        >
        </Modal>
      </div>
    </PageContainer>
  )
};

export default CompanyNotice;
