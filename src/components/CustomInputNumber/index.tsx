import { InputNumber } from "antd";
import React, { useEffect, useState } from "react";

interface CustomInputNumberProps {
    recordId: string,
    value: number,
    placeholder: string,
    onChange: (text: number, id: string) => void;
}

const CustomInputNumber: React.FC<CustomInputNumberProps> = (props) => {
    const [value, setValue] = useState<number>();
    const { recordId, onChange, ...others } = props;

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    const handleChange = (text: string | number | undefined) => {
        onChange(Number(text) || 0, recordId);
    }
    return (
        <InputNumber {...others} min={0} value={value} style={{ width: '100%' }} onChange={handleChange}
        />
    );
}

export default CustomInputNumber;