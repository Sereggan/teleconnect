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

interface FormTextareaProps {
  name: string;
  label: string;
  id?: string;
  placeholder?: string;
  validation?: RegisterOptions<FieldValues, string> | undefined;
  disabled: boolean;
  rows?: number;
  value?: string;
}

export const FormTextArea: React.FC<FormTextareaProps> = ({
  name,
  label,
  id,
  placeholder,
  validation,
  disabled,
  rows = 4,
  value = "",
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const inputErrors: FieldErrors<FieldValues> = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  const errorMessage =
    inputErrors?.error?.message && typeof inputErrors.error.message === "string"
      ? inputErrors.error.message
      : null;

  useEffect(() => {
    setValue(name, value);
  }, [value]);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="textarea"
        id={id}
        placeholder={placeholder}
        rows={rows}
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
