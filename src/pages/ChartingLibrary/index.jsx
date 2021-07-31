import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { getAuthority } from '@/utils/authority';
import { TVChartContainer } from '../../components/TVChartContainer/index';

const ChartingLibrary = (props) => {
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

  }, []);

  return (
    <PageContainer>
      <div >
        <TVChartContainer />
      </div>
    </PageContainer>
  )
};

export default connect(({ loading }) => ({
  loading: loading
}))(ChartingLibrary);