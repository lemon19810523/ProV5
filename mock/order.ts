import { Request, Response } from 'express';
import { parse } from 'url';
import { ListItem, QueryParams } from "@/pages/test/Order/List/data";

const getList = (current: number, pageSize: number) => {
    const tableListDataSource: ListItem[] = [];

    for (let i = 0; i < pageSize; i += 1) {
        const index = (current - 1) * 10 + i;
        tableListDataSource.push({
            id: `${index}`,
            code: `编号${index}`,
            status: 1,
            sumPrice: 200.2,
            createTime: '2020-12-05T10:00:00.309Z',
            custCode: 'lemon'
        });
    }
    // tableListDataSource.reverse();
    return tableListDataSource;
};

function getOrderList(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const { pageIndex = 0, pageSize = 10 } = req.query;
    const params = (parse(realUrl, true).query as unknown) as QueryParams;

    // if (params.code) {
    //     tableListDataSource = tableListDataSource.filter((data) => data.code.includes(params.code || ''));
    // }

    let dataSource = [...tableListDataSource].slice(
        (parseInt(pageIndex as string)) * (pageSize as number),
        (parseInt(pageIndex as string) + 1) * (pageSize as number),
    );

    // const sorter = JSON.parse(params.sorter as any);
    // if (sorter) {
    //     dataSource = dataSource.sort((prev, next) => {
    //         let sortNumber = 0;
    //         Object.keys(sorter).forEach((key) => {
    //             if (sorter[key] === 'descend') {
    //                 if (prev[key] - next[key] > 0) {
    //                     sortNumber += -1;
    //                 } else {
    //                     sortNumber += 1;
    //                 }
    //                 return;
    //             }
    //             if (prev[key] - next[key] > 0) {
    //                 sortNumber += 1;
    //             } else {
    //                 sortNumber += -1;
    //             }
    //         });
    //         return sortNumber;
    //     });
    // }
    // if (params.filter) {
    //     const filter = JSON.parse(params.filter as any) as {
    //         [key: string]: string[];
    //     };
    //     if (Object.keys(filter).length > 0) {
    //         dataSource = dataSource.filter((item) => {
    //             return Object.keys(filter).some((key) => {
    //                 if (!filter[key]) {
    //                     return true;
    //                 }
    //                 if (filter[key].includes(`${item[key]}`)) {
    //                     return true;
    //                 }
    //                 return false;
    //             });
    //         });
    //     }
    // }


    // const result = {
    //     data: dataSource,
    //     total: tableListDataSource.length,
    //     success: true,
    //     pageSize,
    //     pageIndex: parseInt(`${params.pageIndex}`, 10) || 0,
    // };
    const result = {
        message: '',
        data: {
            content: dataSource,
            totalElements: tableListDataSource.length,
        }
    }

    return res.json(result);
}

function getOrderDetail(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const order = {
        id: 1,
        code: `编号1`,
        status: '1',
        sumPrice: 200.2,
        createTime: '2020-12-05T10:00:00.309Z',
        custCode: 'lemon',
        dealerCode: '经销商编号1',
        details: [
            {
                id: 1,
                productCode: '产品编号1',
                productName: '产品名称1',
                qty: 1
            },
            {
                id: 2,
                productCode: '产品编号2',
                productName: '产品名称2',
                qty: 2
            },
            {
                id: 3,
                productCode: '产品编号3',
                productName: '产品名称3',
                qty: 3
            }
        ]
    };

    const result = {
        message: '',
        data: order
    }

    console.log(result);

    return res.json(result);
}

function getOrderInit(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const dealers = [
        {
            code: '经销商编号1',
            name: '经销商名称1',
        },
        {
            code: '经销商编号2',
            name: '经销商名称2',
        },
    ]

    const result = {
        data: {
            dealers: dealers
        }
    }
    console.log(result);
    return res.json(result);
}

function addOrder(req: Request, res: Response) {
    const { body } = req;
    console.log(body);

    return res.json({
        data: {
            message: '订单新增成功',
        }
    });
}

function updateOrder(req: Request, res: Response) {
    const { body } = req;
    console.log(body);

    return res.json({
        data: {
            message: '订单修改成功',
        }
    });
}


let tableListDataSource = getList(1, 100);

export default {
    'GET /api/order/init': getOrderInit,
    'GET /api/order': getOrderList,
    'GET /api/order/:id': getOrderDetail,
    'POST /api/order': addOrder,
    'PUT /api/order/:id': updateOrder,
};