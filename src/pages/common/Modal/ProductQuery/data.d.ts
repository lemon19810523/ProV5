export interface ListItem {
    id: string,
    productCode: string,
    productName: string,
}
export interface QueryParams {
    productCode?: string,
    pageIndex: number,
    pageSize?: number,
    sortField?: string;
    isDesc?: boolean;
}

export interface GetListDataType {
    message: string,
    payload: {
        content: listItem[],
        totalElements: number
    }
}

