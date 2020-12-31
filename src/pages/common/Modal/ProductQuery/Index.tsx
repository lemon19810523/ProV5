import { FORM_OPTIONS, PAGE, PAGINATION_OPTIONS, TABLE } from "@/constants";
import { conventSorter } from "@/utils/utils";
import { ProFormText } from "@ant-design/pro-form";
import { Alert, Button, Card, Col, Form, Modal, Row, Table } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useState } from "react";
import { ListItem, QueryParams } from "./data";
import { getList } from "./service";
import styles from './style.less';

interface ProductQueryProps {
    visible: boolean;
    onCancel: () => void;
    onSelect: (record: ListItem[]) => void;
}

const ProductQuery: React.FC<ProductQueryProps> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [paramsData, setParamsData] = useState<QueryParams>({
        pageSize: PAGE.size,
        pageIndex: PAGE.index
    });
    const [listData, setListData] = useState<{ data: ListItem[], total: number }>({ data: [], total: 0 });
    const { visible, onCancel, onSelect } = props;
    const [selectedRows, setSelectedRows] = useState<ListItem[]>([]);

    async function handleQuery(params: QueryParams) {
        try {
            setLoading(true);
            const { payload } = await getList({ ...paramsData, ...params });

            setParamsData({ ...paramsData, ...params });
            setListData({ data: payload.content, total: payload.totalElements });

        } finally {
            setLoading(false);
        }
    }

    // const handleRowClick = (record: ListItem) => {
    //     return {
    //         onDoubleClick: () => {
    //             // 双击选中
    //             onSelect(record);
    //         }
    //     };
    // }

    const handleSelect = () => {
        if (setSelectedRows.length > 0) {
            onSelect(selectedRows);
        }
        setSelectedRows([]);
    }

    const handleCancel = () => {
        setSelectedRows([]);
        onCancel();
    }


    const columns: ColumnType<ListItem>[] = [
        {
            title: '产品编号',
            dataIndex: 'productCode',
            sorter: true,
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            sorter: true,
        }
    ];


    const alertMessage = (
        <div>
            <span>
                已选中 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
            </span>
            <a className={styles.alertMessage} onClick={handleSelect}>
                确定选择
            </a>
        </div>
    );

    const modalContent = () => {
        return (
            <div>
                <Card>
                    <Form className='form-standard' form={form}
                        onFinish={async (values) => {
                            await handleQuery({
                                ...values, pageSize: PAGE.size, pageIndex: PAGE.index
                            });
                        }}
                    >
                        <Row>
                            <Col {...FORM_OPTIONS.col}>
                                <ProFormText {...FORM_OPTIONS.item}
                                    label="产品编号"
                                    name="productCode"
                                />
                            </Col>
                        </Row>
                        <Row className="operation-buttons">
                            <Col span={8}>
                                <Button key="query" type="primary" htmlType="submit" loading={loading}>查询</Button>
                                <Button key="clear" onClick={() => { form.resetFields() }}>重置</Button>
                            </Col>
                        </Row>
                    </Form >
                </Card>
                <Card>
                    {selectedRows.length > 0 && <Alert type="info" message={alertMessage} showIcon />}
                    <Table<ListItem>
                        rowKey='id'
                        columns={columns}
                        dataSource={listData.data}
                        loading={loading}
                        // onRow={handleRowClick}
                        rowSelection={{
                            onChange: (_, rows) => {
                                setSelectedRows(rows);
                            }
                        }}
                        pagination={{
                            total: listData.total,
                            pageSize: paramsData.pageSize,
                            current: paramsData.pageIndex + 1,
                            onChange: async (pageIndex: number, pageSize?: number) => {
                                await handleQuery({ pageSize, pageIndex: pageIndex - 1 });
                            },
                            ...PAGINATION_OPTIONS
                        }}
                        onChange={async (pagination, filters, sorter) => {
                            if (pagination.current && (pagination.current - 1 === paramsData.pageIndex && pagination.pageSize === paramsData.pageSize))
                                await handleQuery({ ...paramsData, pageIndex: PAGE.index, ...conventSorter(sorter) });
                        }}
                        {...TABLE}
                    />
                </Card>
            </div>
        );
    }
    return (
        <Modal
            title='产品查询'
            visible={visible}
            width='60%'
            maskClosable={false}
            footer={null}
            destroyOnClose
            onCancel={handleCancel}
        >
            {modalContent()}
        </Modal>
    );
}

export default ProductQuery;