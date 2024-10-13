import React from "react";
import { Form } from "react-bootstrap";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { isFormInvalid } from "../../validations/isFormInvalid";
import { findInputError } from "../../validations/findInputError";

interface FormSelectProps {
  name: string;
  label: string;
  id?: string;
  validation?: RegisterOptions<FieldValues, string> | undefined;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  id,
  validation,
  options,
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
    <Form.Group controlId={id} className="mt-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select {...register(name, validation)} isInvalid={isInvalid}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {inputErrors && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
