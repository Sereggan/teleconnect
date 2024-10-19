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
  passwordValidation,
} from "../../validations/auth/authValidations";

interface SendCodeForm {
  email: string;
}

interface ValidateCodeForm {
  code: string;
}

interface PasswordResetForm {
  password: string;
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
  const [resetPasswordError, setResetPasswordError] = useState("");

  const navigate = useNavigate();

  const sendCode = sendCodeMethods.handleSubmit(
    async ({ email }: SendCodeForm) => {
      setIsSendCodeDisabled(true);
      setTimeout(() => setIsSendCodeDisabled(false), 30_000);
      const abortController = new AbortController();
      try {
        await sendResetPasswordMail(email, abortController);
        setEmail(email);
      } catch (err) {
        console.log(err);
      }

      setIsCodeSent(true);

      abortController.abort();
    }
  );

  const validateCode = validateCodeMethods.handleSubmit(
    async ({ code }: ValidateCodeForm) => {
      setIsValidateCodeDisabled(true);
      setTimeout(() => setIsValidateCodeDisabled(false), 30_000);

      const abortController = new AbortController();

      validateResetPasswordCode(email, code, abortController).then((val) => {
        if (val) {
          setToken(val?.resetToken);
        }
      });
      abortController.abort();
    }
  );

  const handleResetPassword = resetPasswordMethod.handleSubmit(
    async ({ password, verifyPassword }: PasswordResetForm) => {
      setResetPasswordError("");
      if (password !== verifyPassword) {
        resetPasswordMethod.setError("verifyPassword", {
          type: "manual",
          message: "Password must match",
        });
        resetPasswordMethod.resetField("verifyPassword");
        return;
      }
      const abortController = new AbortController();

      resetPassword(token, password, abortController)
        .then(() => {
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          setResetPasswordError("Could not reset password.");
        });

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
                <FormInput {...passwordValidation} />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormInput
                  {...{
                    ...passwordValidation,
                    label: "Verify password",
                  }}
                />
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
              Send verification code
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
            </Form>
          </FormProvider>
        )}
      </Container>
    );
  }
}
