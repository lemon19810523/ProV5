import CustomInputNumber from "@/components/CustomInputNumber";
import { TABLE } from "@/constants";
import ProductQuery from "@/pages/common/Modal/ProductQuery/Index";
import { Button, Card, Popconfirm, Table } from "antd";
import { ColumnType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { DetailsItem } from "./data";


interface AddTableProps {
    value?: DetailsItem[],
    onChange?: (value: DetailsItem[]) => void;
    editType: boolean;
}

const AddTable: React.FC<AddTableProps> = ({ value, onChange, editType }) => {

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [data, setData] = useState(value);

    const getRowByKey = (id: string, newData?: DetailsItem[]) =>
        (newData || data)?.filter((item) => item.id === id)[0];

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.persist();
        const newData = data?.filter((item) => item.id !== id) as DetailsItem[];
        setData(newData);
        if (onChange) {
            onChange(newData);
        }
    }

    const handleDeleteAll = () => {
        if (data && data.length > 0) {
            const newData: DetailsItem[] = [];
            setData(newData);
            if (onChange) {
                onChange(newData);
            }
        }
    }

    const handleAddDetail = () => {
        setModalVisible(true);
    }

    const handleSelect = (selectData: DetailsItem[]) => {
        const newData = data?.map((item) => ({ ...item })) || [];

        selectData.forEach((item) => {
            const index = newData.findIndex(d => d.id === item.id);
            if (index === -1) {
                newData?.push({
                    id: item.id,
                    productCode: item.productCode,
                    productName: item.productName,
                    qty: 0
                });
            }
        })
        setData(newData);
        if (onChange)
            onChange(newData);

        setModalVisible(false);
    }

    useEffect(() => {
        // console.log(value);
        setData(value);
    }, [value]);

    const handleChange = (
        text: number,
        id: string) => {
        const newData = [...(data as DetailsItem[])];
        const target = getRowByKey(id, newData);
        if (target) {
            // eslint-disable-next-line radix
            target.qty = text;
            setData(newData);
        }

    }

    const clearAllBtn = data && data.length > 0 ? (<Popconfirm
        placement="topLeft"
        title="是否确认清空？"
        okText="确认"
        onConfirm={handleDeleteAll}
        cancelText="取消">
        <a>清空</a>
    </Popconfirm>)
        : <a>清空</a>;

    const columns: ColumnType<DetailsItem>[] = [
        {
            title: '产品编号',
            dataIndex: 'productCode',
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
        },
        {
            title: '数量',
            dataIndex: 'qty',
            render: (text: string, record: DetailsItem) => {
                return (
                    editType ? <CustomInputNumber
                        recordId={record.id}
                        value={Number(text)}
                        placeholder='请输入订货数量'
                        onChange={handleChange}
                    /> : text
                )
            }
        },
        // {
        //     title: clearAllBtn,
        //     dataIndex: 'options',
        //     width: 60,
        //     className: 'align-center',
        //     render: (text: string, record: ListItemDetail) =>
        //         <a data-record-id={record.id} onClick={(e) => handleDelete(e, record.id)}>删除</a>
        // }
    ];

    if (editType) {
        columns.push({
            title: clearAllBtn,
            dataIndex: 'options',
            width: 60,
            className: 'align-center',
            render: (text: string, record: DetailsItem) =>
                <a data-record-id={record.id} onClick={(e) => handleDelete(e, record.id)}>删除</a>
        });
    }

    return (
        <Card title='清单信息' extra={editType && <div>
            <Button size="small" onClick={handleAddDetail}> 新增 </Button>
        </div>}>
            <Table<DetailsItem>
                rowKey='id'
                columns={columns}
                dataSource={data}
                pagination={false}
                {...TABLE}
            />
            <ProductQuery
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                }}
                onSelect={handleSelect}
            />
        </Card>
    );

}

export default AddTable;