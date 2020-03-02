import React from 'react';
// import { List, Avatar, Tag } from 'antd';
import { List, Tag } from 'antd';
// import router from 'umi/router';
import { mockImages } from '@/constants/columns';

const Description = props => (
  <>
    <span>{props.czyj}</span>
    <br />
    <span>{props.remark}</span>
  </>
);

export default ({ record, handleImagesClick, handleReportClick }) => (
  <div id="components-list-demo-basic">
    <List
      itemLayout="horizontal"
      dataSource={record}
      renderItem={item => (
        <List.Item
          actions={[
            <a onClick={() => handleReportClick(item)}>执行审批</a>,
            // <a key="list-loadmore-more">编辑</a>,
          ]}
        >
          <List.Item.Meta
            avatar={<Tag>{item.czry}</Tag>}
            // avatar={item.czry}
            title={item.czsj}
            description={<Description {...item} />}
          />

          {mockImages(item.fjs || [], handleImagesClick)}
        </List.Item>
      )}
    />
  </div>
);
