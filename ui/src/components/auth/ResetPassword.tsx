import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  resetPassword,
  sendResetPasswordMail,
  validateResetPasswordCode,
} from "../../clients/AuthClient";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../common/FormInput";
import {
  codeValidation,
  emailValidation,
  newPasswordValidation,
  restPasswordValidation,
  verifyPasswordValidation,
} from "../../validations/auth/authValidations";
import axios from "axios";

interface SendCodeForm {
  email: string;
}

interface ValidateCodeForm {
  code: string;
}

interface PasswordResetForm {
  newPassword: string;
  verifyPassword: string;
}

export default function ResetPassword() {
  const sendCodeMethods = useForm<SendCodeForm>();
  const validateCodeMethods = useForm<ValidateCodeForm>();
  const resetPasswordMethod = useForm<PasswordResetForm>();

  const [isSendCodeDisabled, setIsSendCodeDisabled] = useState(false);
  const [isValidateCodeDisabled, setIsValidateCodeDisabled] = useState(false);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [validateCodeError, setValidateCodeError] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  const navigate = useNavigate();

  const sendCode = sendCodeMethods.handleSubmit(
    async ({ email }: SendCodeForm) => {
      setIsSendCodeDisabled(true);
      setTimeout(() => setIsSendCodeDisabled(false), 30_000);

      const abortController = new AbortController();
      try {
        sendResetPasswordMail(email, abortController);
        setEmail(email);
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.log(err);
        }
      }

      setIsCodeSent(true);

      abortController.abort();
    }
  );

  const validateCode = validateCodeMethods.handleSubmit(
    async ({ code }: ValidateCodeForm) => {
      setIsValidateCodeDisabled(true);
      setValidateCodeError("");
      setTimeout(() => setIsValidateCodeDisabled(false), 30_000);

      const abortController = new AbortController();
      try {
        const response = await validateResetPasswordCode(
          email,
          code,
          abortController
        );
        if (response?.resetToken) {
          setToken(response.resetToken);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.log(err);
          if (axios.isAxiosError(err)) {
            if (err.response?.data.message === "Invalid code") {
              setValidateCodeError(
                "Code is invalid. Please try againa fter timeout."
              );
            }
          }
        }
      }

      abortController.abort();
    }
  );

  const handleResetPassword = resetPasswordMethod.handleSubmit(
    async ({ newPassword, verifyPassword }: PasswordResetForm) => {
      console.log("adsdas");
      console.log(newPassword, verifyPassword);
      setResetPasswordError("");
      if (newPassword !== verifyPassword) {
        resetPasswordMethod.setError("verifyPassword", {
          type: "manual",
          message: "Password must match",
        });
        return;
      }
      const abortController = new AbortController();

      try {
        await resetPassword(token, newPassword, abortController);
        navigate("/");
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.log(err);
          setResetPasswordError("Could not reset password.");
        }
      }
      abortController.abort();
    }
  );

  if (token) {
    return (
      <Container>
        <FormProvider {...resetPasswordMethod}>
          <Form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
            className="mb-4"
          >
            <Row>
              <Col md={6}>
                <FormInput {...newPasswordValidation} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput {...verifyPasswordValidation} />
              </Col>
            </Row>

            <Button
              onClick={handleResetPassword}
              variant="primary"
              className="mt-3"
            >
              Reset password
            </Button>
            {resetPasswordError && (
              <div className="alert alert-danger mt-3" role="alert">
                Could not reset password
              </div>
            )}
          </Form>
        </FormProvider>
      </Container>
    );
  } else {
    return (
      <Container>
        <FormProvider {...sendCodeMethods}>
          <Form
            onSubmit={(e) => e.preventDefault()}
            noValidate
            autoComplete="off"
            className="mb-4"
          >
            <Row>
              <Col md={6}>
                <FormInput {...emailValidation} />
              </Col>
            </Row>
            <Button
              onClick={sendCode}
              variant="primary"
              className="mt-3"
              disabled={isSendCodeDisabled}
            >
              Send code
            </Button>
          </Form>
        </FormProvider>
        {isCodeSent && (
          <p>
            Code was sent to mentioned email address. Check address again if you
            didn't receive any code and press "send code" again.
          </p>
        )}
        {isCodeSent && (
          <FormProvider {...validateCodeMethods}>
            <Form
              onSubmit={(e) => e.preventDefault()}
              noValidate
              autoComplete="off"
              className="mb-4"
            >
              <Row>
                <Col md={6}>
                  <FormInput {...codeValidation} />
                </Col>
              </Row>
              <Button
                onClick={validateCode}
                variant="primary"
                className="mt-3"
                disabled={isValidateCodeDisabled}
              >
                Validate code
              </Button>
              {validateCodeError && (
                <p className="text-danger">
                  Code is invalid. Try again after timeout.
                </p>
              )}
            </Form>
          </FormProvider>
        )}
      </Container>
    );
  }
}
