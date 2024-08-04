 
import React from 'react';
import Form from 'react-bootstrap/Form';
interface Option {
    value: string;
    label: string;
  }
interface SelectFieldProps {
    label: string;
    options: Option[];
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    isInvalid?: boolean;
    error?: string;
  }
const SelectField : React.FC<SelectFieldProps>= ({ label, name, value, onChange, onBlur, options, isInvalid, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as="select"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                isInvalid={isInvalid}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Control>
            {isInvalid && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </Form.Group>
    );
};

export default SelectField;
