import React from 'react';
// import { List, Avatar, Tag } from 'antd';
import { List, Tag } from 'antd';
// import router from 'umi/router';
import { mockImages } from '@/constants/columns';
import { connect } from 'dva';

export default connect(({ feedback }) => ({ feedback }))(
  ({ record, feedback, handleImagesClick }) => {
    const data = feedback?.feedbackData?.filter(r => r.TBBM === record?.properties?.TBBM);
    return (
      <div id="components-list-demo-basic">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
            /* actions={[
              <a onClick={() => router.push('/feedback/details')}>反馈报告</a>,
              <a key="list-loadmore-more">编辑</a>,
            ]} */
            >
              <List.Item.Meta
                /* avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              } */
                avatar={
                  item.isIllegal ? <Tag color="red">违法</Tag> : <Tag color="green">合法</Tag>
                }
                title={item.executor.username}
                description={item.content}
              />

              {mockImages(handleImagesClick)}
            </List.Item>
          )}
        />
      </div>
    );
  },
);
