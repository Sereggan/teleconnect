import React from "react";
import { Form } from "react-bootstrap";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { isFormInvalid } from "../../utils/isFormInvalid";
import { findInputError } from "../../utils/findInputError";

interface FormInputProps {
  name: string;
  label: string;
  type: string;
  id?: string;
  placeholder?: string;
  validation?: RegisterOptions<FieldValues, string> | undefined;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  id,
  placeholder,
  validation,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
      />
      {inputErrors && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
