import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useIntl, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { getAuthority } from '@/utils/authority';
import { TVChartContainer } from '../../components/TVChartContainer/index';

const ChartingLibrary = () => {
  const userInfo = getAuthority();//获取用户相关信息
  /** 国际化配置 */
  const intl = useIntl();

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