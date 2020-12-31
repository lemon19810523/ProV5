import { QueryParams, ListItem } from '@/pages/common/Modal/ProductQuery/data';
import { Request, Response } from 'express';
import { parse } from 'url';


const getList = (current: number, pageSize: number) => {
    const tableListDataSource: ListItem[] = [];

    for (let i = 0; i < pageSize; i += 1) {
        const index = (current - 1) * 10 + i;
        tableListDataSource.push({
            id: `${index}`,
            productCode: `产品编号${index}`,
            productName: `产品名称${index}`,
        });
    }
    return tableListDataSource;
};

function getProductList(req: Request, res: Response, u: string) {
    let realUrl = u;
    if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
        realUrl = req.url;
    }
    const { pageIndex = 0, pageSize = 10 } = req.query;
    const params = (parse(realUrl, true).query as unknown) as QueryParams;

    let dataSource = [...tableListDataSource].slice(
        (parseInt(pageIndex as string)) * (pageSize as number),
        (parseInt(pageIndex as string) + 1) * (pageSize as number),
    );

    const result = {
        message: '',
        payload: {
            content: dataSource,
            totalElements: tableListDataSource.length,
        }
    }

    return res.json(result);
}

let tableListDataSource = getList(1, 100);

export default {
    'GET /api/product': getProductList,
};