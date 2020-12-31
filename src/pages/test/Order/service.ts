import request from "umi-request";
import { QueryParams, GetDetailType, GetListDataType, ItemDetail, GetInitDataType } from "./data";


export async function getList(params?: QueryParams): Promise<GetListDataType> {
    return request('/api/order', {
        params
    });
}

export async function getDetail(id: string, params?: QueryParams): Promise<GetDetailType> {
    console.log('get detial data');
    return request(`/api/order/${id}`, {
        params
    });
}

export async function getInit(): Promise<GetInitDataType> {
    console.log('init data');
    return request('/api/order/init');
}

export async function addData(
    data: ItemDetail,
): Promise<{ data: { message: string } }> {
    return request('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function updateData(id: string,
    data: ItemDetail,
): Promise<{ data: { message: string } }> {
    return request(`/api/order/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}