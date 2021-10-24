import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { queryNewsInfo, collectionAdd } from '../FinancialNews/service';
import { getAuthority } from '@/utils/authority';
import styles from './index.less';
import moment from 'moment';
import { StarOutlined } from '@ant-design/icons';

const NewsDetails = (props) => {
  const userInfo = getAuthority();//获取用户相关信息
  let { newsId } = props.match.params;
  const [loadingState, setLoadingState] = useState(true);//loading
  /** 国际化配置 */
  const intl = useIntl();

  let params = {
    newsId: newsId,
    accessToken: userInfo.accessToken
  }

  //新闻详情
  const [newsInfo, setNewsInfo] = useState({});

  //parentId
  useEffect(() => {
    queryNewsInfo(params).then(
      res => {
        setLoadingState(false);
        if (res?.state) {
          if (res.data?.RetrieveStoryML_Response_1?.StoryMLResponse?.STORYML?.HL.length > 0) {
            setNewsInfo(res?.data?.RetrieveStoryML_Response_1?.StoryMLResponse?.STORYML?.HL[0]);
          }
        } else {
          setLoadingState(false);
          message.error(res?.message);
        }
      }
    );
  }, []);

  //收藏新闻
  const collectionNotice = (item) => {
    let paramsCollection = {
      ric: 'story',
      id: '',
      dcn: item?.ID,
      size: item?.TN,
      fileName: item?.HT,
      fileType: item?.TY,
      publicDate: item?.LT ? moment(item?.CT).format("yyyy-MM-DD HH:mm:ss") : '',
      noticeDate: item?.RT ? moment(item?.RT).format("yyyy-MM-DD HH:mm:ss") : '',
      type: 'news',
      userId: userInfo?.id,
      accessToken: userInfo?.accessToken,
    }
    collectionAdd(paramsCollection).then(
      res => {
        if (res?.state) {
          message.success(intl.locale === "zh-CN" ? '收藏成功' : 'collection successful');
        } else {
          message.error(res?.message)
        }
      }
    )

  }

  return (
    <PageContainer loading={loadingState}>
      <div >
        <div className={styles.infoTime}>{moment(newsInfo?.CT).format("yyyy-MM-DD HH:mm:ss")}</div>
        <div className={styles.infoTitle}>{newsInfo?.HT}</div>
        <div className={styles.infoTxtTitle}>
          <a>
            <StarOutlined className={styles.starNews} onClick={() => collectionNotice(newsInfo)} />
          </a>
        </div>
        <div className={styles.infoTxt}>
          <div dangerouslySetInnerHTML={{ __html: newsInfo?.TE }}></div>
        </div>
      </div>
    </PageContainer>
  )
};

export default connect(({ loading }) => ({
  loading: loading
}))(NewsDetails);