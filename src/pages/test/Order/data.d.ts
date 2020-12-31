export interface ListItem {
    id: string,
    code: string,
    sumPrice: number,
    createTime: Date,
    status: string,
    custCode: string
}

export interface DetailsItem {
    id: string,
    productCode: string,
    productName: string,
    qty?: number
}

export interface ItemDetail {
    id: string,
    code?: string,
    sumPrice?: number,
    createTime: Date,
    status: number,
    custCode?: string,
    dealerCode:string,
    details: DetailsItem[]
}

export interface QueryParams {
    code?: string,
    createTime?: Date[],
    beginTime?: Date,
    endTime?: Date,
    status?: number,
    pageIndex: number,
    pageSize?: number,
    sortField?: string;
    isDesc?: boolean;
    custCode?: string;
}

export interface GetDetailType {
    data: ItemDetail
}

export interface GetListDataType {
    message: string,
    data: {
        content: listItem[],
        totalElements: number
    }
}

export interface GetInitDataType {
    data: {
        dealers: Dealer[],
    }
}

export interface Dealer {
    code: string,
    name: string
}