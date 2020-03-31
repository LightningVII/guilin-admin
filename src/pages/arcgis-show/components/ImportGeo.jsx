import React from 'react';
import { Form, Input, Radio, Modal } from 'antd';


class ImportGeo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleOk = () => {
        this.props.onCloseModal()
    }

    handleCancel = () => {
        this.props.onCloseModal()
    }

    render() {
        return (
            <div>
                <Modal
                    title="导入显示的坐标点位"
                    visible
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form>
                        <Form.Item label="导入类型" name="layout">
                            <Radio.Group defaultValue="horizontal">
                                <Radio.Button value="horizontal">点数据</Radio.Button>
                                <Radio.Button value="vertical">线数据</Radio.Button>
                                <Radio.Button value="inline">面数据</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="坐标点位">
                            <Input.TextArea rows={12} cols={72} placeholder="输入点位，分号隔开..." />
                        </Form.Item>

                    </Form>
                </Modal>

            </div>
        )
    }

}


export default ImportGeo;