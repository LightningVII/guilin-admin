import React from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload ,message} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { treeData } from './treeData.js';

const props = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  accept:'.json,.txt',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default class TreeSet extends React.Component {

  formRef = React.createRef();

  constructor() {
    super();



    this.state = {
      visible: false,
      addVisble: false,
      title: '对话框',
      columns: [
        {
          title: 'key',
          dataIndex: 'key',
          key: 'key',
          width: '12%'
        },
        {
          title: '图层名',
          dataIndex: 'title',
          key: 'title',
          width: '12%'
        },
        {
          title: '加载方式',
          dataIndex: 'loadType',
          key: 'loadType',
          width: '12%'
        },
        {
          title: '图层地址',
          dataIndex: 'layerUrl',
          width: '30%',
          key: 'layerUrl'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: '20%',
          render: record => (
            (record.loadType ? <span>
              <a onClick={() => this.modify(record)} style={{ marginRight: 16 }}>修改</a>
              <a onClick={() => this.del(record)} >删除</a>
            </span> : null)
          ),
        }
      ]
    }
  };



  showModal = record => {
    setTimeout(() => {
      if (record) {
        this.formRef.current.setFieldsValue({
          layerTitle: record.title,
          layerKey: record.key,
          layerLoadtype: record.loadType,
          layerUrl: record.layerUrl
        });
      } else {
        this.formRef.current.setFieldsValue({
          layerTitle: '',
          layerKey: '',
          layerLoadtype: '',
          layerUrl: ''
        });
      }
    }, 800)
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  modify = record => {
    this.setState({
      visible: true,
      title: '修改'
    }, () => this.showModal(record))


  }

  del = record => {
    this.setState({
      visible: true,
      title: '删除'
    }, () => this.showModal(record))
  }


  add = () => {
    this.setState({
      addVisble: true
    })
  }

  uploadJson = () => {

  }

  render() {
    return (
      <>
        <Button type="primary" onClick={() => this.add()}>添加一条</Button>

        <Upload {...props}>
          <Button  style={{ marginLeft: 20 }}>
            <UploadOutlined /> 上传Json
        </Button>
        </Upload>
        <Table
          style={{ marginTop: 20 }}
          columns={this.state.columns} dataSource={treeData} />

        <Modal
          title={this.state.title}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText={this.state.title}
          cancelText="关闭"
        >

          <Form layout="vertical"
            ref={this.formRef}
            name="control-ref"
          >

            <Form.Item name="layerTitle" label="图层名称" rules={[{ required: true }]}>
              <Input placeholder="输入图层名" />

            </Form.Item>

            <Form.Item name="layerLoadtype" label="加载方式" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="tile">tile</Select.Option>
                <Select.Option value="feature">feature</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="layerUrl" label="图层地址" rules={[{ required: true }]}>
              <Input placeholder="输入图层地址" />
            </Form.Item>

          </Form>

        </Modal>
        <Modal
          title='添加一条数据'
          visible={this.state.addVisble}
          onOk={() => {
            this.setState({
              addVisble: false
            })
          }}
          onCancel={() => {
            this.setState({
              addVisble: false
            })
          }}
          okText='添加'
          cancelText="关闭"
        >
          <Form layout="vertical"
            name="control-ref"
          >
            <Form.Item name="layerTitle" label="图层名称" rules={[{ required: true }]}>
              <Input placeholder="输入图层名" />
            </Form.Item>
            <Form.Item name="parentNode" label="所属父节点" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="bhtb">变化图斑</Select.Option>
                <Select.Option value="rsLayer">影像数据</Select.Option>
                <Select.Option value="baseLayer">基础地理图层</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="loadType" label="加载类型" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="tile">tile</Select.Option>
                <Select.Option value="feature">feature</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="layerUrl" label="图层地址" rules={[{ required: true }]}>
              <Input placeholder="输入图层地址" />
            </Form.Item>
          </Form>

        </Modal>
      </>
    );
  }
}