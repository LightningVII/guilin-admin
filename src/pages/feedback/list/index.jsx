import { Button, Card, Col, Form, Icon, List, Row, Select } from 'antd';
import React, { Component } from 'react';

import { connect } from 'dva';
import ArticleListContent from './components/ArticleListContent';
import StandardFormRow from './components/StandardFormRow';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;
const FormItem = Form.Item;

const pageSize = 5;

class FeedbackList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedbackAndlist/fetch',
      payload: {
        count: 5,
      },
    });
  }

  setOwner = () => {
    const { form } = this.props;
    form.setFieldsValue({
      owner: ['wzj'],
    });
  };

  fetchMore = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'feedbackAndlist/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  render() {
    const {
      form,
      feedbackAndlist: { list },
      loading,
    } = this.props;
    const { getFieldDecorator } = form;

    const IconText = ({ type, text, onClick }) => (
      <span onClick={onClick}>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };

    const loadMore = list.length > 0 && (
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
          {loading ? (
            <span>
              <Icon type="loading" /> 加载中...
            </span>
          ) : (
            '加载更多'
          )}
        </Button>
      </div>
    );

    return (
      <>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="活跃用户">
                    {getFieldDecorator(
                      'user',
                      {},
                    )(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="lisa">李三</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col xl={8} lg={10} md={12} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="好评度">
                    {getFieldDecorator(
                      'rate',
                      {},
                    )(
                      <Select placeholder="不限" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="good">优秀</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="id"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={[
                  <IconText
                    onClick={() => router.push('/feedback/details')}
                    key="read"
                    type="read"
                    text="详情"
                  />,
                  <IconText
                    onClick={() => router.push('/feedback/create')}
                    type="edit"
                    key="edit"
                    text="重新编辑"
                  />,
                ]}
                extra={<div className={styles.listItemExtra} />}
              >
                <List.Item.Meta
                  title={
                    <a className={styles.listItemMetaTitle} href={item.href}>
                      {item.title}
                    </a>
                  }
                />
                <ArticleListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </>
    );
  }
}

const WarpForm = Form.create({
  onValuesChange({ dispatch }) {
    // 表单项变化时请求数据
    // 模拟查询表单生效
    dispatch({
      type: 'feedbackAndlist/fetch',
      payload: {
        count: 8,
      },
    });
  },
})(FeedbackList);

export default connect(({ feedbackAndlist, loading }) => ({
  feedbackAndlist,
  loading: loading.models.feedbackAndlist,
}))(WarpForm);
