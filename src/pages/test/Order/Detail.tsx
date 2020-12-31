import { DATETIME_FORMAT } from "@/constants";
import { orderStatus } from "@/enum";
import { formatDateTime } from "@/utils/utils";
import { Button, Card, Col, Descriptions, Form, message, Popconfirm, Row, Spin } from "antd";
import React from "react";
import { useRequest } from "umi";
import AddTable from "./AddTable";
import { ItemDetail } from "./data.d";
import { getDetail } from "./service";

export interface DetailParams {
    id: string;
    handleOpertion: (key: string) => void;
}

const Detail: React.FC<DetailParams> = (props) => {
    const [form] = Form.useForm();
    const { data, loading } = useRequest(() => {
        return getDetail(props.id);
    }, {
        onSuccess: (result) => {
            form.setFieldsValue(result);
        }
    });

    const handleOpertion = (key: string) => {
        props.handleOpertion(key);
    }

    const { code, status, createTime, custCode } = data || {
        code: '',
        status: '',
        createTime: '',
        custCode: ''
    }

    const operations: React.ReactNode[] = [];
    operations.push(<Button size='small' onClick={() => handleOpertion('update')}>修改</Button>);
    operations.push(<Popconfirm
        placement="topLeft"
        title="是否确认审核？"
        okText="确认"
        onConfirm={() => handleOpertion('confirm')}
        cancelText="取消">
        <Button size='small'>审核</Button>
    </Popconfirm>);
    operations.push(<Popconfirm
        placement="topLeft"
        title="是否确认作废？"
        okText="作废"
        onConfirm={() => handleOpertion('cancel')}
        cancelText="取消">
        <Button size='small'>作废</Button>
    </Popconfirm>);

    return (
        <Spin spinning={loading}>
            <Form<ItemDetail> form={form}>
                <Card title='主单信息' extra={operations}>
                    <Descriptions >
                        <Descriptions.Item label="单据编号">{code}</Descriptions.Item>
                        <Descriptions.Item label="状态">{status === '' ? '' : orderStatus[status].text}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{formatDateTime(createTime === '' ? '' : createTime.toString(), DATETIME_FORMAT)}</Descriptions.Item>
                        <Descriptions.Item label="客户编号">{custCode}</Descriptions.Item>
                    </Descriptions>
                </Card>
                <Form.Item name='details'>
                    <AddTable editType={false} />
                </Form.Item>
            </Form >
        </Spin>)
}

export default Detail;