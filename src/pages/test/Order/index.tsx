/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { orderStatus } from '@/enum';
import { Button, Card, Col, Form, message, Popconfirm, Row, Table } from 'antd';
import { conventSorter, formatAmount, formatDateTime } from '@/utils/utils';
import { DATETIME_FORMAT, FORM_OPTIONS, PAGE, PAGINATION_OPTIONS, TABLE } from '@/constants';
import { ColumnType } from 'antd/lib/table';
import moment from 'moment';
import { ProFormDateRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import Icon from '@ant-design/icons';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { useAccess } from 'umi';
import CustomDropdownMenu from '@/components/CustomDropdownMenu';
import { getList } from './service';
import { ListItem, QueryParams } from './data';
import Detail from './Detail';
import Add from './Add';
import { PAGE_CODE, PERMISSION } from './constants';
import Import from './Import';
import ButtonGroup from 'antd/lib/button/button-group';

export type CurrentType = 'index' | 'add' | 'update' | 'detail' | 'import'

const Order: React.FC<{}> = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [listData, setListData] = useState<{ data: ListItem[], total: number }>({ data: [], total: 0 });
    const [paramsData, setParamsData] = useState<QueryParams>({
        pageSize: PAGE.size,
        pageIndex: PAGE.index
    });
    const [simpleMode, setSimpleMode] = useState<boolean>(true);
    const [form] = Form.useForm();
    const [selectedRows, setSelectedRows] = useState<ListItem[]>([]);
    const [currentRow, setCurrentRow] = useState<ListItem>();
    const [currentType, setCurrentType] = useState<CurrentType>('index');
    const access = useAccess();

    useEffect(() => {
        if (currentType === 'index') {
            setSelectedRows([]);
        }
    }, [currentType]);

    async function handleQuery(params: QueryParams) {
        try {
            setLoading(true);
            const { createTime, ...filters } = params;
            if (createTime && createTime.length > 0) {
                const [beginTime, endTime] = createTime;
                filters.beginTime = moment(beginTime).toDate();
                filters.endTime = moment(endTime).toDate();
            }
            const { data } = await getList({ ...paramsData, ...filters });

            setParamsData({ ...paramsData, ...filters });
            setListData({ data: data.content, total: data.totalElements });

        } finally {
            setLoading(false);
        }
    }

    const handleOpertion = (key: string, item: ListItem) => {
        if (key === 'update') {
            setCurrentRow(item);
            setCurrentType('update');
        } else if (key === 'cancel') {
            message.success('作废成功');
        } else if (key === 'confirm') {
            message.success('审核成功');
        }
    }

    const handleDetailOpertion = (key: string) => {
        if (key === 'update') {
            setCurrentType('update');
        } else if (key === 'cancel') {
            message.success('作废成功');
            setCurrentType('index');
        } else if (key === 'confirm') {
            message.success('审核成功');
            setCurrentType('index');
        }
    }

    const handleSubmit = async () => {
        setCurrentType('index');
        await handleQuery({ pageIndex: PAGE.index, pageSize: PAGE.size });
    }

    const operations = [];
    const btns = [];
    if (access.hasPermission(PAGE_CODE, PERMISSION.add)) {
        operations.push(<Button key="add" type="primary" loading={loading} onClick={() => {
            setCurrentType('add');
        }}> 新增</Button >);
    }
    if (access.hasPermission(PAGE_CODE, PERMISSION.add)) {
        btns.push(<Button key="import" loading={loading} onClick={() => {
            setCurrentType('import');
        }}> 导入</Button >);
    }


    const columns: ColumnType<ListItem>[] = [
        {
            title: '编号',
            dataIndex: 'code',
            sorter: true,
            render: (text, record) => <a onClick={(e) => {
                e.preventDefault();
                setCurrentRow(record);
                setCurrentType("detail");
            }}>{text}</a>
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (value: number) => {
                return orderStatus[value].text;
            }
        },
        {
            title: '客户编号',
            dataIndex: 'custCode',
            sorter: true,
        },
        {
            title: '金额',
            dataIndex: 'sumPrice',
            render: (value: string) => formatAmount(value)
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            render: (value: string) => formatDateTime(value, DATETIME_FORMAT)
        },
        {
            title: '操作',
            dataIndex: 'option',
            render: (r, item) => {

                const menus: {
                    id: string,
                    children: React.ReactNode,
                    hidden: boolean
                }[] = [
                        {
                            id: 'update',
                            children: <a key="update" onClick={() => {
                                handleOpertion('update', item);
                            }}>修改</a>,
                            hidden: false
                        },
                        {
                            id: 'confirm',
                            children: <Popconfirm
                                placement="topLeft"
                                title="是否确认审核？"
                                okText="确认"
                                onConfirm={() => handleOpertion('confirm', item)}
                                cancelText="取消">
                                <a>审核</a>
                            </Popconfirm>,
                            hidden: false
                        },
                        {
                            id: 'cancel',
                            children: <Popconfirm
                                placement="topLeft"
                                title="是否确认作废？"
                                okText="确认"
                                onConfirm={() => handleOpertion('cancel', item)}
                                cancelText="取消">
                                <a>作废</a>
                            </Popconfirm>,
                            hidden: false
                        }
                    ];
                return <CustomDropdownMenu key='menu' primaryLength={1} menus={menus} />;

            }
        }
    ];

    const titles = {
        index: '查询订单',
        add: '新增订单',
        update: '修改订单',
        detail: '订单详情',
        import: '订单导入'
    };

    return (
        <PageContainer title={titles[currentType]} extra={currentType !== 'index' && <Button key="cancel" type="primary" onClick={() => {
            setCurrentType('index');
        }}> 返回</Button >}>
            {currentType === 'index' &&
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
                                        label="单据编号"
                                        name="code"
                                    />
                                </Col>
                                <Col {...FORM_OPTIONS.col}>
                                    <ProFormSelect {...FORM_OPTIONS.item}
                                        name="status"
                                        label="状态"
                                        valueEnum={orderStatus}
                                    />
                                </Col>
                                <Col {...FORM_OPTIONS.col}>
                                    <ProFormText {...FORM_OPTIONS.item}
                                        name="custCode"
                                        label="客户编号"
                                    />
                                </Col>
                                {!simpleMode &&
                                    <Col {...FORM_OPTIONS.col}>
                                        <ProFormDateRangePicker {...FORM_OPTIONS.item}
                                            name="createTime"
                                            label="创建时间"
                                        />
                                    </Col>
                                }
                            </Row>
                            <Row className="operation-buttons">
                                <Col span={8}>
                                    <Button key="query" type="primary" htmlType="submit" loading={loading}>查询</Button>
                                    <Button key="clear" onClick={() => { form.resetFields() }}>重置</Button>
                                    <a onClick={() => { setSimpleMode(!simpleMode); }}>
                                        {simpleMode ? <span>展开<Icon type="down" /></span> : <span>收起<Icon type="up" /></span>}
                                    </a>
                                </Col>
                                <Col span={16} className="col-align-right">
                                    <ButtonGroup>{btns}</ButtonGroup>
                                    {operations}
                                </Col>
                            </Row>
                        </Form >
                    </Card>
                    <Card>
                        <Table<ListItem>
                            rowKey='id'
                            columns={columns}
                            dataSource={listData.data}
                            loading={loading}
                            rowSelection={{
                                onChange: (keys, rows) => {
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
                        {selectedRows?.length > 0 && (
                            <FooterToolbar
                                extra={
                                    <div>
                                        已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
                                    </div>
                                }
                            >
                                <Button onClick={async () => { }}>
                                    批量删除
                                </Button>
                                <Button type="primary">批量审批</Button>
                            </FooterToolbar>
                        )}
                    </Card>
                </div>}

            {currentType === 'add' &&
                <Add onSubmit={handleSubmit} />}
            {currentType === 'update' && currentRow &&
                <Add id={currentRow?.id} onSubmit={handleSubmit} />}
            {currentType === 'detail' && currentRow &&
                <Detail id={currentRow?.id} handleOpertion={handleDetailOpertion} />}
            {currentType === 'import' &&
                <Import />}
        </PageContainer>
    );
};

export default Order;