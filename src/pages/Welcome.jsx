import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, FormattedMessage, Link, history } from 'umi';
import styles from './Welcome.less';
import { Row, Col, message, Spin, Carousel, Avatar, AutoComplete,Empty } from 'antd';
import { getAuthority } from '@/utils/authority';
import { queryHotStock, queryHotNews, queryBanner, queryRicLists } from './service';
import moment from 'moment';
import { RightOutlined, UserOutlined } from '@ant-design/icons';
import image01 from '../assets/image01@2x.png';
import image02 from '../assets/image02@2x.png';
import image03 from '../assets/image03@2x.png';
import image04 from '../assets/image04@2x.png';
import ic_exchange from '../assets/ic_exchange_slices/ic_exchange.png';
import ic_forward from '../assets/ic_forward_slices/ic_forward.png';
import ic_futures from '../assets/ic_futures_slices/ic_futures.png';
import ic_level from '../assets/ic_level_slices/ic_level.png';
import ic_member from '../assets/ic_member_slices/ic_member.png';
import ic_news from '../assets/ic_news_slices/ic_news.png';
import ic_phone from '../assets/ic_phone_slices/ic_phone.png';
import ic_quotation from '../assets/ic_quotation_slices/ic_quotation.png';
import ic_shares from '../assets/ic_shares_slices/ic_shares.png';
import { gradeZN } from '@/utils/utils';


const { Option } = AutoComplete;

const WelcomeHome = () => {

  const userInfo = getAuthority();//获取用户相关信息
  const [loadingState, setLoadingState] = useState(true);//loading
  /** 国际化配置 */
  const intl = useIntl();
  //热门股票
  let paramsHotStock = {
    stockType: 'stock',
    accessToken: userInfo.accessToken
  }

  const contentWdith = window.innerWidth - 40;//内容区域宽度
  //轮播图宽度
  const bannerWidth = eval(contentWdith / 100 * 75);
  // const bannerWidth = 1024;
  //会员中心宽度
  const personWidth = eval(contentWdith - bannerWidth - 16);
  //头像居中的左右margin
  const avatorMargin = eval(eval(personWidth - 72) / 2)
  const avatorStyle = {
    marginLeft: avatorMargin,
    marginTop: 24,
    marginRight: avatorMargin,
    marginBottom: 8
  }
  //资讯宽度
  const infoWidth = eval(contentWdith / 100 * 20);
  //搜索框宽度
  const searchWidth = eval(infoWidth - 40);
  //热门股票
  const stockWidth = eval(eval(contentWdith / 100 * 40) - 16);
  //热门新闻
  const newsWidth = eval(eval(contentWdith / 100 * 40) - 16);

  const sixteen = '16px';

  const [stockState, setStockState] = useState([]);
  const getHotStock = () => {
    queryHotStock(paramsHotStock).then(
      res => {
        setLoadingState(false);
        if (res?.state) {
          if (res?.data) {
            let stockList = []
            Object.keys(res?.data).forEach((key, index) => {
              if (index <= 14) {
                let valueList = res?.data[key] ? res?.data[key].split('_') : [];
                if (valueList.length > 0) {
                  stockList.push({ code: key, name: valueList[0], price: valueList[1], applies: valueList[2] })
                }
              }
            })
            setStockState(stockList)
          }
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  //热门新闻
  let paramsHotNews = {
    size: 16,
    accessToken: userInfo.accessToken
  }

  const [newsState, setNewsState] = useState([]);
  const getHotNews = () => {
    queryHotNews(paramsHotNews).then(
      res => {
        setLoadingState(false);
        if (res?.state) {
          if (res?.data) {
            setNewsState(res?.data?.RetrieveHeadlineML_Response_1?.HeadlineMLResponse?.HEADLINEML?.HL)
          } else {
            setNewsState([])
          }
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  //轮播图
  let paramsBanner = {
    position: '首页',
    accessToken: userInfo.accessToken
  }

  const getBanner = () => {
    queryBanner(paramsBanner).then(
      res => {
        setLoadingState(false);
        if (res?.state) {
          if (res?.data) {

          }
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  //
  useEffect(() => {
    getBanner();
    getHotNews()
    getHotStock()
  }, []);

  //轮播图
  const contentStyle = {
    height: '320px',
    color: '#fff',
    lineHeight: '320px',
    textAlign: 'center',
    background: '#364d79',
    width: '100%'
  };



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
    queryRicLists(ricParams).then(
      res => {
        if (res?.state) {
          if (res?.data && res?.data?.result && res?.data?.result.length > 0) {
            setRicList(res?.data?.result)
          }
        } else {
          message.error(res?.message);
        }
      }
    );
  }

  const toCenter = () => {
    history.push(`/personCenter`)
  }

  //to F10页面
  const toF10Page = () => {
    history.push(`/dataAnalysis`)
  }

  return (
    <PageContainer loading={loadingState}>
      <div className={styles.homeContent} style={{ width: contentWdith }}>
        <div>
          <div className={styles.onelevel} style={{ width: bannerWidth }}>
            <div>
              <Carousel autoplay>
                <div>
                  <img style={contentStyle} src={image01} />
                </div>
                <div>
                  <img style={contentStyle} src={image02} />
                </div>
                {/* <div>
                  <img style={contentStyle} src={image03} />
                </div> */}
                <div>
                  <img style={contentStyle} src={image04} />
                </div>
              </Carousel>
            </div>
          </div>
          <div className={styles.onelevel} style={{ width: personWidth, marginLeft: sixteen, position: 'absolute' }}>
            <div>
              <div>
                <Avatar size={72} icon={<UserOutlined />} style={avatorStyle} />
                <span className={styles.useName}>{userInfo.userName ? userInfo.userName : userInfo.emailAdress ? userInfo.emailAdress : ''}</span>
                <span style={{ marginTop: 8, textAlign: 'center', display: 'block' }}>ID：GMT{userInfo?.recommendationCode}</span>
                <div className={styles.useInfoSpace}></div>
                <div className={styles.textLeft}><img src={ic_phone} className={styles.iconRight8} />{intl.locale === "zh-CN" ? '联系方式：' : 'Contact information:'}{userInfo.iphoneNumber ? userInfo.iphoneNumber : userInfo.emailAdress ? userInfo.emailAdress : ''}</div>
                <div className={styles.textLeft}><img src={ic_level} className={styles.iconRight8} />{intl.locale === "zh-CN" ? '会员等级：' : 'Membership level:'}<img src={ic_member} />{intl.locale === "zh-CN" ? gradeZN(userInfo?.agent) : userInfo?.agent}</div>
                <div className={styles.vipBg} onClick={toCenter}>
                  <span className={styles.forwardVip} ><img src={ic_member} className={styles.iconVip} />{intl.locale === "zh-CN" ? '前往会员中心' : 'Go to the Member Centre'}</span>
                  <img src={ic_forward} className={styles.iconForward} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: sixteen }}>
          <div style={{ width: infoWidth, float: 'left' }} >
            <div className={styles.searchContent}>
              <AutoComplete
                onChange={(e) => queryRicListData(e)}
                name='code'
                style={{ margin: '20px', width: searchWidth }}
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
            </div>
            <div style={{ width: '100%' }} className={styles.twoLevel}>
              <div className={styles.infoLine}>
                <div><img src={ic_shares} className={styles.iconRight} />{intl.locale === "zh-CN" ? '股票' : 'stock'}</div>
                <div className={styles.infoLineTwo}>
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '深度资料' : 'The depth of the data'}</span>
                  {intl.locale === "zh-CN" ? '' : <br />}
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '自选股' : 'free'}</span>
                </div>
              </div>
              <div className={styles.infoSpace}></div>
              <div className={styles.infoLine}>
                <div><img src={ic_news} className={styles.iconRight} />{intl.locale === "zh-CN" ? '资讯' : 'information'}</div>
                <div className={styles.infoLineTwo}>
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '财经新闻' : 'Financial news'}</span>
                  {intl.locale === "zh-CN" ? '' : <br />}
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '公司公告' : 'The company announcement'}</span>
                </div>
              </div>
              <div className={styles.infoSpace}></div>
              <div className={styles.infoLine}>
                <div><img src={ic_quotation} className={styles.iconRight} />{intl.locale === "zh-CN" ? '行情' : 'The market'}</div>
                <div className={styles.infoLineTwo}>
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '沪深市场' : 'Shanghai and shenzhen markets'}</span>
                  {intl.locale === "zh-CN" ? '' : <br />}
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '全球市场' : 'The global market'}</span>
                </div>
              </div>
              <div className={styles.infoSpace}></div>
              <div className={styles.infoLine}>
                <div><img src={ic_exchange} className={styles.iconRight} />{intl.locale === "zh-CN" ? '外汇' : 'Foreign currency'}</div>
                <div className={styles.infoLineTwo}>
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '外汇概括' : 'Foreign exchange summary'}</span>
                </div>
              </div>
              <div className={styles.infoSpace}></div>
              <div className={styles.infoLine}>
                <div><img src={ic_futures} className={styles.iconRight} />{intl.locale === "zh-CN" ? '期货' : 'futures'}</div>
                <div className={styles.infoLineTwo}>
                  <span onClick={toF10Page}>{intl.locale === "zh-CN" ? '期货概括' : 'Futures generalization'}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: stockWidth, marginLeft: sixteen }} className={styles.twoLevel}>
            <div className={styles.titleLine}>
              <span className={styles.titleTxt}>{intl.locale === "zh-CN" ? '热门股票' : 'Hot stocks'}</span>
              {/* <span className={styles.more}>更多<RightOutlined /></span> */}
            </div>
            <div>
              <Row className={styles.listLine}>
                <Col span={6}>{intl.locale === "zh-CN" ? '代码' : 'code'}</Col>
                <Col span={6}>{intl.locale === "zh-CN" ? '简称' : 'Referred to as'}</Col>
                <Col span={6}>{intl.locale === "zh-CN" ? '最新价' : 'The latest price'}</Col>
                <Col span={6}>{intl.locale === "zh-CN" ? '涨跌幅' : 'applies'}</Col>
              </Row>
              {
                stockState.length > 0 ? stockState.map((item) => (
                  <Row className={styles.listLine}>
                    <Col span={6}>{item.code}</Col>
                    <Col span={6}>{item.name}</Col>
                    <Col span={6}>{item.price}</Col>
                    <Col span={6} className={item.applies ? item.applies < 0 ? styles.shareRed : styles.shareGreen : ''}>{item.applies ? item.applies > 0 ? '+' + parseFloat(item.applies).toFixed(2) + '%' : parseFloat(item.applies).toFixed(2) + '%' : ''}</Col>
                  </Row>
                ))
                  : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
              }
            </div>
          </div>
          <div style={{ width: newsWidth, marginLeft: sixteen }} className={styles.twoLevel}>
            <div className={styles.titleLine}>
              <span className={styles.titleTxt}>{intl.locale === "zh-CN" ? '热门新闻' : 'Hot news'}</span>
              {/* <span className={styles.more}>更多<RightOutlined /></span> */}
            </div>
            <div>
              {
                newsState.length > 0 ? newsState.map((item, index) => (
                  <Row className={styles.listLine}>
                    <Col span={2}>{index + 1}</Col>
                    <Col span={19}><Link target="_blank" to={{
                      pathname: `/news/details/${item.ID}`
                    }}>
                      <span className={styles.textOverflow} style={{ color: 'white' }} title={item.HT ? item.HT : ''}>{item.HT ? item.HT : ''}</span>
                    </Link></Col>
                    <Col span={2}>{item.LT ? moment(item.LT).format(" HH:mm") : ''}</Col>
                  </Row>
                ))
                  : <Spin className={styles.spinLoading} />
              }
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
};

export default WelcomeHome;
