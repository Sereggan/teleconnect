import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { isFormInvalid } from "../../validations/isFormInvalid";
import { findInputError } from "../../validations/findInputError";

interface FormInputProps {
  name: string;
  label: string;
  type: string;
  id?: string;
  placeholder?: string;
  validation?: RegisterOptions<FieldValues, string> | undefined;
  value?: string | number;
  disabled: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  id,
  placeholder,
  validation,
  value,
  disabled,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  useEffect(() => {
    setValue(name, value);
  }, [value]);

  const inputErrors: FieldErrors<FieldValues> = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  const errorMessage =
    inputErrors?.error?.message && typeof inputErrors.error.message === "string"
      ? inputErrors.error.message
      : null;

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(name, validation)}
        isInvalid={isInvalid}
        disabled={disabled}
      />
      {inputErrors && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
