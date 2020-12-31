/* eslint-disable import/no-unresolved */
import { DATETIME_FORMAT, FORM_OPTIONS } from "@/constants";
import { orderStatus } from "@/enum";
import { formatDateTime } from "@/utils/utils";
import { ProFormDateTimePicker, ProFormSelect, ProFormText } from "@ant-design/pro-form";
import { FooterToolbar } from "@ant-design/pro-layout";
import { Button, Col, Row, Form, Spin, Card, message } from "antd";
import moment from "moment";
import React from "react";
import { useRequest } from "umi";
import { isEqual, uniqWith } from "lodash";
import { addData, getDetail, getInit, updateData } from "./service";
import AddTable from "./AddTable";
import { Dealer, ItemDetail } from "./data.d";

export interface OptionData {
    value: string;
    label: string;
}

export interface AddParams {
    id?: string;
    onSubmit: () => void;
}

const Add: React.FC<AddParams> = (props) => {
    const [form] = Form.useForm();
    const initialValues = {
        createTime: null,
        status: '0',
        details: []
    }
    const { data, loading } = useRequest(() => {
        return props.id ? getDetail(props.id) : Promise.resolve({
            data: initialValues,
        });
    }, {
        onSuccess: (result) => {
            const { createTime, ...formData } = result;
            form.setFieldsValue({
                createTime: (createTime ? formatDateTime(createTime?.toString(), DATETIME_FORMAT) : null),
                ...formData
            });
        }
    });

    const { data: initData, loading: initLoading } = useRequest(getInit);

    const { loading: submitting, run: postRun } = useRequest((method, params) => {
        if (method === 'update') {
            return props.id ? updateData(props.id, params) : Promise.resolve({
                data: {
                    message: ''
                }
            });
        }
        return addData(params);
    }, {
        manual: true,
        onSuccess: (result) => {
            props.onSubmit();
            message.success(result.message);
        },
    });

    const handleSubmit = (values: ItemDetail) => {
        console.log(values);
        const { createTime, ...formData } = values;
        const postData = {
            createTime: moment(createTime).toDate(),
            ...formData
        };

        const { details } = formData;
        if (details.length === 0) {
            message.warn('清单不能为空!');
            return;
        };

        const list: string[] = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < details.length; i++) {
            const { productCode, qty } = details[i];
            if (qty === 0) {
                message.warn('清单计划量必须大于0!');
                return;
            }
            list.push(
                productCode
            );
        }
        if(uniqWith(list, isEqual).length !== list.length){
            message.warn('产品代码不能重复!');
            return;           
        }

        postRun(props.id ? 'update' : 'add', postData);

    }

    // const onValuesChange = (changedValues: { [key: string]: any }) => {
    //     const { details } = changedValues;

    //     console.log(details);
    //   };

    const { dealers } = initData || { dealers: [] };
    const selectOptions: OptionData[] = dealers.map((dealer: Dealer) => {
        return {
            value: dealer.code,
            label: dealer.name,
        };
    });

    return (
        <Spin spinning={loading || initLoading}>
            <Form<ItemDetail> form={form} initialValues={initialValues}
                onFinish={handleSubmit}>
                <Card title='主单信息'>
                    <Row>
                        <Col {...FORM_OPTIONS.col}>
                            <ProFormText {...FORM_OPTIONS.item}
                                name="code"
                                label="单据编号"
                                rules={[{ required: true, message: '请输入单据编号' }]}
                            />
                        </Col>
                        <Col {...FORM_OPTIONS.col}>
                            <ProFormText {...FORM_OPTIONS.item}
                                name="custCode"
                                label="客户编号"
                            />
                        </Col>
                        <Col {...FORM_OPTIONS.col}>
                            <ProFormDateTimePicker {...FORM_OPTIONS.item}
                                name="createTime"
                                label="创建时间"
                                rules={[{ required: true, message: '请选择时间' }]}
                            />
                        </Col>
                        <Col {...FORM_OPTIONS.col}>
                            <ProFormSelect {...FORM_OPTIONS.item}
                                name="status"
                                label="状态"
                                valueEnum={orderStatus}
                                rules={[{ required: true, message: '请选择状态' }]}
                            />
                        </Col>
                        <Col {...FORM_OPTIONS.col}>
                            <ProFormSelect {...FORM_OPTIONS.item}
                                name="dealerCode"
                                label="经销商"
                                // valueEnum={orderStatus}
                                options={selectOptions}
                                rules={[{ required: true, message: '请选择经销商' }]}
                            />
                        </Col>
                    </Row>
                </Card>
                {/* <Card title='清单信息'> */}
                <Form.Item name='details'>
                    <AddTable editType />
                </Form.Item>
                {/* </Card> */}
                <FooterToolbar>
                    <Button key="clear" onClick={() => { form.resetFields() }}>重置</Button>
                    <Button type="primary" onClick={() => { form?.submit() }} loading={submitting}>提交</Button>
                </FooterToolbar>
            </Form >
        </Spin>);
}

export default Add;