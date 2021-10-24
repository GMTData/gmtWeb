import { message, Timeline, Spin, Empty, Checkbox, Pagination, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, Link } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { queryClassList, queryByParentId, queryNewsList, queryCollectionByUserId } from './service';
import styles from './index.less';
import { getAuthority } from '@/utils/authority';
import { weeksCN, weeksEN, subGroupArray } from '../../../utils/utils'
import moment from 'moment';
import { ReloadOutlined } from '@ant-design/icons';

let countsId = '';//初始化定时器class值
const localTIme = new Date();
let isRefresh = true;
let pageTotal = '共';
let pageItems = '条';
const { TabPane } = Tabs;

const FinancialNews = () => {
  const userInfo = getAuthority();//获取用户相关信息
  let params = {
    language: 'ZH',
    accessToken: userInfo.accessToken
  }

  //一级分类
  const [oneLevel, setOneLevel] = useState([]);//一级
  const [twoLevel, setTwoLevel] = useState([]);//二级
  const [threeLevel, setThreeLevel] = useState([]);//三级
  const [levelState, setLevelState] = useState(0);
  const [levelTwoState, setLevelTwoState] = useState(0);
  const [levelThreeState, setLevelThreeState] = useState(0);
  const [loadingState, setLoadingState] = useState(true);//loading
  const [loadingListState, setLoadingListState] = useState(true);//list loading
  const [lastId, setLastId] = useState({});//上次请求的classid
  const [timeCount, setTimeCount] = useState(59);
  const [checkState, setCheckState] = useState(true);
  /** 国际化配置 */
  const intl = useIntl();

  //parentId
  useEffect(() => {
    if (intl.locale === "zh-CN") {
      params.language = 'ZH';
      pageTotal = '共';
      pageItems = '条';
    } else {
      params.language = 'EN';
      pageTotal = 'Total';
      pageItems = 'items';
    }
    queryClassList(params).then(
      res => {
        if (res.state) {
          setLoadingState(false);
          if (res.state) {
            if (res.data) {
              if (res.data.length > 0 && res.data[0].subClass) {
                if (res.data[0].subClass.length > 0) {
                  for (let i = 0; i < res.data[0].subClass.length; i++) {
                    let item = res.data[0].subClass[i];
                    if (item.ofType === '财经新闻') {
                      if (item.subClass.length > 0) {
                        setOneLevel(item.subClass);
                        setLevelState(item.subClass.length > 0 ? item.subClass[0].id : 0);
                        getNewsList(item.subClass[0]);
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
      }
    );

    //定时刷新页面列表
    const timer = setInterval(() => {
      if (isRefresh) {
        if (timeCount <= 0) {
          setTimeCount(59);
        } else {
          setTimeCount((timeCount) => {
            if (timeCount == 0) {
              getNewsList();
              return timeCount + 59;
            }
            return timeCount - 1
          })
        }
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  //是否定时刷新checkbox
  const onChangeCheck = (e) => {
    isRefresh = e.target.checked;
    setCheckState(!e.target.checked);
  }

  let listParams = {
    classId: '',
    size: 200,
    accessToken: userInfo.accessToken
  }

  const [newsList, setNewsList] = useState([]);
  const [newsPageList, setNewsPageList] = useState([]);//分割后的数组
  //根据二级目录查列表
  const getNewsList = (item) => {
    setNewsList([]);
    setLoadingListState(true);
    if (item) {
      //设置不同分类的状态跟数据
      if (item.classLevel === '3') {
        setLevelState(item.id);
        if (item.subClass) {
          setTwoLevel(item.subClass);
          setLevelTwoState(item.subClass.length > 0 ? item.subClass[0].id : 0);
        } else {
          setTwoLevel([]);
          setThreeLevel([]);
        }
      } else if (item.classLevel === '4') {
        setLevelTwoState(item.id);
        if (item.subClass) {
          setLevelThreeState(item.subClass.length > 0 ? item.subClass[0].id : 0);
          setThreeLevel(item.subClass);
        } else {
          setThreeLevel([]);
        }
      } else if (item.classLevel === '5') {
        setLevelThreeState(item.id);
      }

      if (!item.subClass) {
        listParams.classId = item.id;
      } else {
        if (item.subClass.length > 0) {
          listParams.classId = item.subClass[0].id;
        }
      }
      setLastId(listParams.classId);
      countsId = listParams.classId;
    } else {
      listParams.classId = countsId;
    }

    queryNewsList(listParams).then(
      res => {
        if (res.state) {
          countsId = listParams.classId;
          setLoadingListState(false);
          if (res.data) {
            setNewsList(res.data?.RetrieveHeadlineML_Response_1?.HeadlineMLResponse?.HEADLINEML?.HL);
            setNewsPageList(subGroupArray(res.data?.RetrieveHeadlineML_Response_1?.HeadlineMLResponse?.HEADLINEML?.HL, 20)[0]);
          } else {
            setNewsList([]);
          }
        } else {
          setLoadingListState(false);
          message.error(res.message);
        }
      }
    );
  }

  const [cutPage, setCutPage] = useState(1);
  const onChange = (page, pageSize) => {
    setCutPage(page);
    setNewsPageList(subGroupArray(newsList, pageSize)[page - 1]);
  }

  const onShowSizeChange = (current, size) => {
    setCutPage(current);
    setNewsPageList(subGroupArray(newsList, size)[current - 1]);
  }

  //查询收藏
  let paramsCollectionQuery = {
    userId: userInfo?.id,
    type: 'news',
    accessToken: userInfo.accessToken,
  };

  const [newsMyList, setNewsMyList] = useState([])
  const [newsMyPageList, setNewsMyPageList] = useState([])

  const getCollectionList = () => {
    queryCollectionByUserId(paramsCollectionQuery).then(
      res => {
        if (res?.state) {
          setNewsMyList(res?.data)
          setNewsMyPageList(subGroupArray(res?.data, 20)[0]);
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
    setNewsMyPageList(subGroupArray(newsMyList, pageSize)[page - 1]);
  }

  const onShowSizeChangeMy = (current, size) => {
    setCutPageMy(current);
    setNewsMyPageList(subGroupArray(newsMyList, size)[current - 1]);
  }
  //切换页面选项卡
  const callback = (key) => {
    if (key == '2') {
      getCollectionList()
    }
  }

  return (
    <PageContainer loading={loadingState} className={styles.newContent}>
      <Tabs defaultActiveKey="1" onChange={callback} style={{ margin: '0px 20px' }}>
        <TabPane tab={intl.locale === "zh-CN" ? '财经新闻' : 'Financial news'} key="1">
          <div className={styles.oneLevelTitle}>
            {oneLevel ? oneLevel.map((item, index) => (
              <span key={index} value={item.className}
                onClick={() => getNewsList(item)}
                className={[styles.oneLevel, item.id === levelState ? styles.oneLevelActive : ''].join(' ')}>
                {item.className}
              </span>
            )) : ''
            }
          </div>

          <div className={[styles.oneLevelTitle, twoLevel.length > 0 ? styles.twoLevelTitle : ''].join(' ')}>
            {twoLevel ? twoLevel.map((item, index) => (
              <span key={index} value={item.className}
                onClick={() => getNewsList(item)}
                className={[styles.twoLevel, item.id === levelTwoState ? styles.twoLevelActive : ''].join(' ')}>
                {item.className}
              </span>
            )) : ''
            }
          </div>
          <div className={[styles.oneLevelTitle, twoLevel.length > 0 ? styles.threeLevelTitle : ''].join(' ')}>
            {threeLevel ? threeLevel.map((item, index) => (
              <span key={index} value={item.className}
                onClick={() => getNewsList(item)}
                className={[styles.threeLevel, item.id === levelThreeState ? styles.threeLevelActive : styles.txtCoWh].join(' ')}>
                {item.className}
              </span>
            )) : ''
            }
          </div>
          <div>
            <span className={styles.dayTtile}>{moment(new Date()).format('YYYY-MM-DD')},{new Date().toTimeString()}</span>
            {/* <span className={styles.dayTtile}>
          {moment(new Date()).format('YYYY-MM-DD')},{intl.locale === "zh-CN" ? weeksCN(moment().format('d')) : weeksEN(moment().format('d'))}</span> */}
            <span>
              <span style={{ 'marginLeft': '400px' }}>
                <Checkbox className={styles.checkInfo} defaultChecked={checkState} onChange={(e) => onChangeCheck(e)} />
                <span>{timeCount}</span>
                <FormattedMessage id="pages.financialNews.seconds" defaultMessage="秒" />
                <FormattedMessage id="pages.financialNews.refresh" defaultMessage="后刷新" />
              </span>
              <ReloadOutlined onClick={() => getNewsList()} className={styles.refresh} />
            </span>
          </div>
          {loadingListState ? <Spin className={styles.loadingSpin} size='large' /> :
            <div className={styles.timelineTop}>
              <Timeline mode={'left'}>
                {newsPageList && newsPageList.length > 0 ? newsPageList.map((item, index) => (
                  <Timeline.Item label={moment(item.LT).format("HH:mm")} key={item.ID}>
                    <Link target="_blank" to={{
                      pathname: `/news/details/${item.ID}`

                    }}>
                      <span className={styles.checkInfo}>{item.HT}</span>
                    </Link>
                  </Timeline.Item>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No result' />}
              </Timeline>
            </div>
          }
          <Pagination
            total={newsList ? newsList.length : 0}
            showTotal={(total) => `${pageTotal} ${newsList ? newsList.length : 0} ${pageItems} `}
            defaultPageSize={20}
            current={cutPage ? cutPage : 1}
            onChange={onChange}
            onShowSizeChange={onShowSizeChange}
          />
        </TabPane>
        <TabPane tab={intl.locale === "zh-CN" ? '我的收藏' : 'My collection'} key="2">
          {loadingListState ? <Spin className={styles.loadingSpin} size='large' /> :
            <div className={styles.timelineTop}>
              <Timeline mode={'left'}>
                {newsMyPageList && newsMyPageList.length > 0 ? newsMyPageList.map((item, index) => (
                  <Timeline.Item label={moment(item.publicDate).format("HH:mm")} key={item.dcn}>
                    <Link target="_blank" to={{
                      pathname: `/news/details/${item.dcn}`

                    }}>
                      <span className={styles.checkInfo}>{item.fileName}</span>
                    </Link>
                  </Timeline.Item>
                )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No result' />}
              </Timeline>
            </div>
          }
          <Pagination
            total={newsMyList ? newsMyList.length : 0}
            showTotal={(total) => `${pageTotal} ${newsMyList ? newsMyList.length : 0} ${pageItems} `}
            defaultPageSize={20}
            current={cutPageMy ? cutPageMy : 1}
            onChange={onChangeMy}
            onShowSizeChange={onShowSizeChangeMy}
          />
        </TabPane>
      </Tabs>
    </PageContainer>
  )
};

export default FinancialNews;
