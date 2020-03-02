import React from 'react';
// import { List, Avatar, Tag } from 'antd';
import { List, Tag } from 'antd';
// import router from 'umi/router';
import { mockImages } from '@/constants/columns';
import { connect } from 'dva';

export default connect(({ feedback }) => ({ feedback }))(
  ({ record, feedback, handleImagesClick, handleReportClick }) => {
    const data = feedback?.feedbackData?.filter(r => r.tbbm === record?.tbbm);
    console.log('data :', data);
    console.log('feedback?.feedbackData :', feedback?.feedbackData);
    const Description = props => (
      <>
        <span>{props.czyj}</span>
        <br />
        <span>{props.remark}</span>
      </>
    );

    return (
      <div id="components-list-demo-basic">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item
              actions={[
                <a onClick={() => handleReportClick(item)}>反馈报告</a>,
                // <a key="list-loadmore-more">编辑</a>,
              ]}
            >
              <List.Item.Meta
                avatar={<Tag>{item.czry}</Tag>}
                // avatar={item.czry}
                title={item.czsj}
                description={<Description {...item} />}
              />

              {mockImages(item.fjs, handleImagesClick)}
            </List.Item>
          )}
        />
      </div>
    );
  },
);
