import { DownloadOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Card, Steps } from "antd";
import React from "react";

const { Step } = Steps;

const Import: React.FC<{}> = () => {
    return (
        <div>
            <Card>
                <Steps direction="vertical" size="small" status="process" className="hiddenTail">
                    <Step
                        title="下载模板"
                        status="process"
                        className="stepMargin"
                        icon={<DownloadOutlined />}
                        description={<span>点击
                                <a key="export">下载模板
                                </a>链接，下载订单导入模板
                            </span>} />
                    <Step
                        title="填写数据"
                        status="process"
                        className="stepMargin"
                        icon={<EditOutlined />}
                        description={<div>
                            <p>供应商编号、年份、月份，产品编号不能为空
                                </p>
                            <p>只能导入 xlsx 格式文件，文件最大支持 5MB;
                                </p>
                        </div>} />
                    <Step
                        title="上传文件"
                        status="process"
                        className="stepMargin"
                        icon={<UploadOutlined />}
                        description={<div>点击
                                {/* {importButton}，上传数据 */}
                        </div>} />
                </Steps>
            </Card>
        </div>
    );
}

export default Import;