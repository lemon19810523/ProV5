import { SorterResult } from "antd/lib/table/interface";
import moment from "moment";
import { stringify } from "qs";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/**
 * 格式化日期
 * @param {string} value
 * @param {string} format
 */
export const formatDateTime = (value: string, format: string) => {
  if (value && moment(value).isValid())
    return moment(value).format(format);
  return null;
};

/**
 * 格式化金额
 * @param  {number | string} value
 * @return {string}
 */
export const formatAmount = (value: string) => {
  if (value === undefined || value === null)
    return '';
  return `￥ ${Number(value).toFixed(2)}`
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


/**
 * 根据value获取指定枚举值对应的文本
 * @param {Object} enumData 枚举对象
 * @param {number} value 枚举值
 */
export const conventEnumValueToString = (enumData: any, value: number) => {
  if (typeof value === 'undefined' || value === null)
    return null;
  return enumData.properties[value];
};

/**
 *  转换ant table的sorter对象转换成分页的查询的排序字段
 * @param {object} sorter
 */
export const conventSorter = (sorter: any) => {
  const option: { sortField?: string, isDesc?: boolean } = {};

  if (sorter)
    // 点击排序
    if (sorter.order && sorter.field) {
      option.sortField = sorter.field;
      if (sorter.order === 'descend')
        option.isDesc = true;
      else
        option.isDesc = false;
    } else { // 取消排序
      option.sortField = undefined;
      option.isDesc = undefined;
    }
  return option;
};