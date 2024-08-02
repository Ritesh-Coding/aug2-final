// InputField.js
import React from 'react';
import Form from 'react-bootstrap/Form';

const InputField = ({ label, type, name, value, onChange, onBlur, placeholder, isInvalid, error }) => {
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                isInvalid={isInvalid}
            />
            {isInvalid && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        </Form.Group>
    );
};

export default InputField;
