import { DownOutlined } from "@ant-design/icons";
import { Divider, Dropdown, Menu } from "antd";
import React from "react";

interface CustomDropdownMenuProps {
    key: string;
    primaryLength: number;
    menus: {
        id: string,
        children: React.ReactNode,
        hidden: boolean
    }[]
}

const CustomDropdownMenu: React.FC<CustomDropdownMenuProps> = ({ key, primaryLength, menus }) => {

    const items = menus.filter(item => !item.hidden);

    console.log(items);
    const showAll = primaryLength + 1 >= items.length;
    const primary: React.ReactNode[] = [];
    const menu: React.ReactNode[] = [];

    items.forEach((item, index) => {
        if (showAll || primaryLength > index) {
            if (primary.length > 0)
                // eslint-disable-next-line react/no-array-index-key
                primary.push(<Divider key={index} type="vertical" />);
            primary.push(item.children)
        } else {
            menu.push(<Menu.Item key={item.id}>{item.children}</Menu.Item>);
        }
    });

    const handleMenuClick = () => {

    }

    return (
        <span>
            {primary}
            {primary.length > 0 && menu.length > 0 && <Divider key='divider' type="vertical" />}
            {menu.length > 0 &&
                <Dropdown
                    key={key}
                    overlay={<Menu onClick={handleMenuClick}>{menu}</Menu>}
                >
                    <a> 更多<DownOutlined /></a>
                </Dropdown>}
        </span>
    )
}

export default CustomDropdownMenu;