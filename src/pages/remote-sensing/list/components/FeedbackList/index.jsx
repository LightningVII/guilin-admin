import React from 'react';
import { List, Avatar } from 'antd';
import router from 'umi/router';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
];
export default ({ record }) => (
  <div id="components-list-demo-basic">
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => (
        <List.Item
          actions={[
            <a onClick={() => router.push('/feedback/details')}>反馈报告</a>,
            <a key="list-loadmore-more">编辑</a>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
            title={<a href="https://ant.design">{item.title}</a>}
            description={record.desc}
          />
        </List.Item>
      )}
    />
  </div>
);
