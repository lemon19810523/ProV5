import request from "umi-request";
import { QueryParams, GetListDataType } from "./data";


export async function getList(params?: QueryParams): Promise<GetListDataType> {
    return request('/api/product', {
        params
    });
}
