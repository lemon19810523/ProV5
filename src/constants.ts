import { SizeType } from "antd/lib/config-provider/SizeContext";

/* 日期、时间格式化 */
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = { format: 'HH:mm' };


/* Form 响应式布局 */
const FORM_ITEM_LAYOUT_OPTIONS = {
    labelCol: {
        xxl: { span: 6 },
        xl: { span: 9 },
        md: { span: 8 }
    },
    wrapperCol: {
        xxl: { span: 18 },
        xl: { span: 15 },
        md: { span: 16 }
    }
};

export const FORM_ITEM_COLON = true;

export const FORM_OPTIONS = {
    /* Col 参数 */
    col: {
        xxl: 6,
        xl: 8,
        md: 12
    },
    /* Form 参数 */
    item: {
        ...FORM_ITEM_LAYOUT_OPTIONS,
        colon: FORM_ITEM_COLON
    }
}

/* TABLE 默认设置 */
export const TABLE: { size: SizeType, bordered: boolean } = {
    size: 'small',
    bordered: true
};

/* Pagination 默认设置 */
export const PAGINATION_OPTIONS = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40', '100'],
    showTotal: (total: number) => `共 ${total} 条记录`,
};

/* 分页属性 */
export const PAGE = {
    // 默认每页显示条数
    size: 20,
    // 默认显示第一页
    index: 0,
    // 常用于 Model 展示 Table
    smallSize: 10
};



