import React from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, DatePicker, Tooltip, Menu, Dropdown, Alert } from 'antd';
import { UploadOutlined, DownOutlined, ExclamationCircleOutlined, FolderAddOutlined, FileAddOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'dva';

// import { treeData } from '../../../arcgis-show/components/json/treeData';

// const statusActions = info => ({
//     done: message.success(`${info.file.name} 上传成功`),
//     error: message.error(`${info.file.name} 上传失败.`),
//     defaultStatus: console.log(info.file, info.fileList)
// })

const props = user => ({
    name: 'jsonFile',
    action: `/strapi/changespot/add?userid=${user.userid}`,
    accept: '.json,.txt',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        // statusActions(info)[info.file.status]()
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
    },
});

// @connect(({ layer }) => ({
//     layerTree: layer.layerTree,
//     layerUrl: layer.layerUrl,
// }))
class DatasourceView extends React.Component {

    formUpdateRef = React.createRef();

    formAddRef = React.createRef();

    formAddParentRef = React.createRef();


    constructor() {
        super();

        this.state = {
            updateVisible: false,
            addVisble: false,
            addParentVisble: false,
            deleteUploadVisible: false,
            showBHTBDate: false,
            showImgeLayerDate: false,
            treeJson: [],
            columns: [
                {
                    title: '图层名',
                    dataIndex: 'title',
                    key: 'title'
                },
                {
                    title: '加载方式',
                    dataIndex: 'loadType',
                    key: 'loadType'
                },
                {
                    title: '图层地址',
                    dataIndex: 'layerUrl',
                    key: 'layerUrl',
                    width: '40%',
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    render: record => (
                        (record.loadType === 'parent' ? <span>
                            <a onClick={() => this.add(record)} style={{ marginRight: 16 }}><Tooltip placement="top" title="添加"><FileAddOutlined /></Tooltip></a>
                            <a style={{ color: 'red' }} onClick={() => this.del(record)} ><Tooltip placement="top" title='删除'><DeleteOutlined /></Tooltip></a>
                        </span> : <span>
                                <a onClick={() => this.update(record)} style={{ marginRight: 16 }}><Tooltip placement="top" title='修改'><EditOutlined /></Tooltip></a>
                                <a style={{ color: 'red' }} onClick={() => this.del(record)} ><Tooltip placement="top" title='删除'><DeleteOutlined /></Tooltip></a>
                            </span>)
                    ),
                }
            ]
        }
    };

    componentDidMount() {
        this.initTreeJson();
    }

    renderDate = value => {

        switch (value) {
            case "tile":
                this.setState({
                    showBHTBDate: false,
                    showImgeLayerDate: true
                })
                break;
            case "feature":
                this.setState({
                    showBHTBDate: true,
                    showImgeLayerDate: false
                })
                break;
            default:
                this.setState({
                    showBHTBDate: false,
                    showImgeLayerDate: false
                })
                break;
        }
    }

    initTreeJson = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'layer/fetchLayerTree',
        }).then(res => {
            this.setState({
                treeJson: res,
            });

        });
    }

    del = record => {
        const { dispatch } = this.props;
        const that = this;
        Modal.confirm({
            title: '是否删除这条数据?',
            icon: <ExclamationCircleOutlined />,
            content: `图层名称:${record.title}`,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'layer/fetchLayerDelete',
                    payload: {
                        layermenuid: record.key
                    },
                }).then(res => {
                    if (res.code === 200) {
                        message.success(res.message)
                        setTimeout(() => {
                            that.initTreeJson();
                        }, 1000)

                    }
                    else
                        message.error(res.message)
                });



            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }



    update = record => {
        this.setState({
            updateVisible: true
        }, () => {
            setTimeout(() => {
                this.formUpdateRef.current.setFieldsValue({
                    layermenuid: record.key,
                    url: record.layerUrl,
                    layermenuname: record.title,
                    datatype: record.loadType,
                    qsx: record.QSX ? moment(record.QSX, 'YYYYMM') : moment(),
                    hsx: record.HSX ? moment(record.HSX, 'YYYYMM') : moment(),
                    layerdate: record.LAYERDATE ? moment(record.LAYERDATE, 'YYYYMM') : moment()
                });
                this.renderDate(record.loadType)
            }, 800)
        })
    }

    onUpdateOK = () => {
        const updateObj = this.formUpdateRef.current.getFieldsValue();
        updateObj.qsx = moment(updateObj.qsx).format('YYYYMM')
        updateObj.hsx = moment(updateObj.hsx).format('YYYYMM')
        updateObj.layerdate = moment(updateObj.layerdate).format('YYYYMM')

        // if (parseInt(updateObj.qsx, 10) >= parseInt(updateObj.hsx, 10)) {
        //     message.warning('后时相必须大于前时相')
        //     return
        // }


        this.setState({
            updateVisible: false
        })



        const { dispatch } = this.props;
        dispatch({
            type: 'layer/fetchLayerUpdate',
            payload: updateObj,
        }).then(res => {
            if (res.code === 200) {
                message.success(res.message)
                setTimeout(() => {
                    this.initTreeJson();
                }, 1000)
            }
            else
                message.error(res.message)
        });

    }

    add = record => {
        this.setState({
            addVisble: true
        }, () => {
            setTimeout(() => {
                this.formAddRef.current.setFieldsValue({
                    pid: record.key,
                    qsx: moment(),
                    hsx: moment(),
                    layerdate: moment()
                });
                this.renderDate(record.loadType)
            }, 800)
        })
    }

    addOnOk = () => {
        const addObj = this.formAddRef.current.getFieldsValue();

        addObj.qsx = moment(addObj.qsx).format('YYYYMM')
        addObj.hsx = moment(addObj.hsx).format('YYYYMM')
        addObj.layerdate = moment(addObj.layerdate).format('YYYYMM')

        // if (parseInt(addObj.qsx, 10) >= parseInt(addObj.hsx, 10)) {
        //     message.warning('后时相必须大于前时相')
        //     return
        // }

        this.setState({
            addVisble: false
        })


        const { dispatch } = this.props;
        dispatch({
            type: 'layer/fetchLayerAdd',
            payload: addObj,
        }).then(res => {
            if (res.code === 200) {
                message.success(res.message)
                setTimeout(() => {
                    this.initTreeJson();
                }, 1000)
            }
            else
                message.error(res.message)
        });
    }

    uploadJson = () => {

    }

    deleteUploadData = () => {
        this.setState({
            deleteUploadVisible: true
        }, () => {

        })
    }

    addParent = () => {
        this.setState({
            addParentVisble: true
        }, () => {
            setTimeout(() => {
                this.formAddParentRef.current.setFieldsValue({
                    pid: 0,
                    datatype: 'parent',
                    remark: '无'
                });
            }, 800)
        })
    }

    addParentOK = () => {
        this.setState({
            addParentVisble: false
        })

        const { dispatch } = this.props;

        const obj = this.formAddParentRef.current.getFieldsValue()

        dispatch({
            type: 'layer/fetchLayerAdd',
            payload: obj,
        }).then(res => {
            if (res.code === 200) {
                message.success(res.message)
                this.initTreeJson();
            }
            else
                message.error(res.message)
        });
    }

    render() {
        return (
            <>
                <Button type="primary" onClick={
                    () => this.addParent()
                }><FolderAddOutlined />添加父级图层</Button>

                {/* <Upload {...props(this.props.currentUser)}>
                    <Button style={{ marginLeft: 20 }}>
                        <UploadOutlined /> 上传变化图斑Json
                    </Button>
                </Upload> */}

                <Dropdown overlay={
                    <Menu >
                        <Menu.Item key="1">
                            <Upload {...props(this.props.currentUser)}>
                                <div><UploadOutlined /> 上传JSON文件</div>
                            </Upload>
                        </Menu.Item>
                        <Menu.Item key="2" onClick={() => {
                            this.deleteUploadData()
                        }}><DeleteOutlined />
                        删除已上传
                        </Menu.Item>
                    </Menu>
                }>
                    <Button style={{ marginLeft: 20 }}>
                        变化图斑 <DownOutlined />
                    </Button>
                </Dropdown>

                <Table
                    style={{ marginTop: 20 }}
                    scroll={{ y: "auto" }}
                    columns={this.state.columns} dataSource={this.state.treeJson} />

                <Modal
                    title='更新数据'
                    visible={this.state.updateVisible}
                    onOk={() => this.onUpdateOK()}
                    onCancel={
                        () => this.setState({
                            updateVisible: false
                        })}
                    okText='更新'
                    cancelText="关闭"
                    destroyOnClose
                >
                    <Form
                        layout="horizontal"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        ref={this.formUpdateRef}
                        name="control-ref"
                    >

                        <Form.Item name="layermenuname" label="图层名称" rules={[{ required: true }]}>
                            <Input placeholder="输入图层名" />
                        </Form.Item>

                        <Form.Item name="datatype" label="图层类型" rules={[{ required: true }]}>
                            <Select onChange={value => {
                                this.renderDate(value);
                            }}>
                                <Select.Option value="tile">tile(切片)</Select.Option>
                                <Select.Option value="feature">feature(矢量)</Select.Option>
                            </Select>
                        </Form.Item>

                        {this.state.showBHTBDate ? <Form.Item name="qsx" label="前时相" >
                            <DatePicker picker="month" format='YYYYMM' />
                        </Form.Item> : null}

                        {this.state.showBHTBDate ? <Form.Item name="hsx" label="后时相" >
                            <DatePicker picker="month" format='YYYYMM' />
                        </Form.Item> : null}

                        {this.state.showImgeLayerDate ? <Form.Item name="layerdate" label="影像日期" >
                            <DatePicker picker="month" format='YYYYMM' />
                        </Form.Item> : null}

                        <Form.Item name="url" label="图层地址" rules={[{ required: true }]}>
                            <Input placeholder="输入图层地址" />
                        </Form.Item>

                        <Form.Item name="layermenuid" label="图层key" rules={[{ required: true }]}>
                            <Input placeholder="输入layermenuid" disabled />
                        </Form.Item>

                    </Form>

                </Modal>

                <Modal
                    title='添加一条数据'
                    visible={this.state.addVisble}
                    onOk={() => {
                        this.addOnOk();
                    }}
                    onCancel={() => {
                        this.setState({
                            addVisble: false
                        })
                    }}
                    okText='添加'
                    cancelText="关闭"
                    destroyOnClose
                >
                    <Form layout="horizontal"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        name="control-ref"
                        ref={this.formAddRef}
                    >
                        <Form.Item name="layermenuname" label="图层名称" rules={[{ required: true }]}>
                            <Input placeholder="输入图层名" />
                        </Form.Item>

                        <Form.Item name="datatype" label="加载类型" rules={[{ required: true }]}>
                            <Select onChange={value => {
                                this.renderDate(value);
                            }}>
                                <Select.Option value="tile">tile(切片)</Select.Option>
                                <Select.Option value="feature">feature(矢量)</Select.Option>
                            </Select>
                        </Form.Item>

                        {this.state.showBHTBDate ? <Form.Item name="qsx" label="前时相" rules={[{ required: true }]}>
                            <DatePicker picker="month" format='YYYYMM' />
                        </Form.Item> : null}

                        {this.state.showBHTBDate ? <Form.Item name="hsx" label="后时相" rules={[{ required: true }]}>
                            <DatePicker picker="month" format='YYYYMM' />
                        </Form.Item> : null}

                        {this.state.showImgeLayerDate ? <Form.Item name="layerdate" label="影像日期" rules={[{ required: true }]}>
                            <DatePicker picker="month" format='YYYYMM' />
                        </Form.Item> : null}

                        <Form.Item name="url" label="图层地址" rules={[{ required: true }]}>
                            <Input placeholder="输入图层地址" />
                        </Form.Item>

                        <Form.Item name="pid" label="父节点id" rules={[{ required: true }]}>
                            <Input placeholder="父节点id" disabled />
                        </Form.Item>
                    </Form>
                </Modal>


                <Modal
                    title='添加父级图层'
                    visible={this.state.addParentVisble}
                    onOk={() => {
                        this.addParentOK();
                    }}
                    onCancel={() => {
                        this.setState({
                            addParentVisble: false
                        })
                    }}
                    okText='添加'
                    cancelText="关闭"
                    destroyOnClose
                >
                    <Form layout="vertical"
                        name="control-ref"
                        ref={this.formAddParentRef}
                    >
                        <Form.Item name="layermenuname" label="图层名称" rules={[{ required: true }]}>
                            <Input placeholder="输入图层名" />
                        </Form.Item>

                        <Form.Item name="datatype" label="数据类型" rules={[{ required: true }]}>
                            <Input placeholder="输入数据类型" disabled />
                        </Form.Item>

                        <Form.Item name="pid" label="pid" rules={[{ required: true }]}>
                            <Input placeholder="输入pid" disabled />
                        </Form.Item>

                        <Form.Item name="remark" label="数据备注">
                            <Input placeholder="输入备注" />
                        </Form.Item>

                    </Form>

                </Modal>

                <Modal
                    title='删除已上传数据'
                    visible={this.state.deleteUploadVisible}
                    onOk={() => {

                    }}
                    onCancel={() => {
                        this.setState({
                            deleteUploadVisible: false
                        })
                    }}
                    okText='删除'
                    okType='danger'
                    cancelText="关闭"
                    destroyOnClose
                >
                    <Form
                        name="control-ref"
                        ref={this.formAddRef}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <Form.Item name="datatype" label="时间范围" rules={[{ required: true }]}>
                            <DatePicker.RangePicker
                                picker="month"
                                format="YYYYMM"
                            />
                        </Form.Item>
                    </Form>
                    <Alert message="会删除已上传任务，请谨慎操作" type="warning" style={{ marginTop: 20 }} />
                </Modal>
            </>
        );
    }
}

export default connect(({ layer, user }) => ({
    layerTree: layer.layerTree,
    layerUrl: layer.layerUrl,
    currentUser: user.currentUser,
}))(DatasourceView);