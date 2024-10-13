import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import {
  resetPassword,
  sendResetPasswordMail,
  validateResetPasswordCode,
} from "../../clients/AuthClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [codeValidationError, setCodeValidationError] = useState("");
  const [sendCodeError, setSendCodeError] = useState("");

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPaswordVerify] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [passwordValidationError, setPasswordValidationError] = useState("");

  const navigate = useNavigate();

  const sendCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.length < 3) {
      setEmailValidationError("Email is too short");
      return;
    }
    const abortController = new AbortController();
    try {
      sendResetPasswordMail(email, abortController);
    } catch (err) {
      console.log(err);
    }

    setIsCodeSent(true);

    return () => abortController.abort();
  };

  const validateCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length != 6 || isNaN(Number(code))) {
      setCodeValidationError("Code must be 6 digits long");
      return;
    } else {
      setCodeValidationError("");
    }
    const abortController = new AbortController();

    validateResetPasswordCode(email, code, abortController)
      .then((val) => {
        if (val) {
          setToken(val?.resetToken);
        }
        setSendCodeError("");
      })
      .catch(() => {
        setSendCodeError("Could not validate code.");
      });
    setToken("fake token");

    return () => abortController.abort();
  };

  const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordVerify) {
      setPasswordValidationError("Passwords should be the same!");
      return;
    } else if (password.length < 6) {
      setPasswordValidationError(
        "Password should be contain at least 6 symbols!"
      );
      return;
    }
    setPasswordValidationError("");

    const abortController = new AbortController();

    resetPassword(token, password, abortController)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setResetPasswordError("Could not reset password.");
      });

    return () => abortController.abort();
  };

  if (token) {
    return (
      <Container>
        <Form noValidate onSubmit={handleResetPassword}>
          <Form.Group controlId="passwordGroup">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-danger mt-2">{emailValidationError}</div>
          </Form.Group>
          <Form.Group controlId="passwordVerifyGroup">
            <Form.Label>Verify password</Form.Label>
            <Form.Control
              type="password"
              value={passwordVerify}
              onChange={(e) => setPaswordVerify(e.target.value)}
            />
            <div className="text-danger mt-2">{passwordValidationError}</div>
          </Form.Group>
          <Button className="mt-3" variant="light" type="submit">
            Reset password
          </Button>
          <div className="text-danger mt-2">{resetPasswordError}</div>
        </Form>
      </Container>
    );
  }

  return (
    <Container>
      <Form noValidate onSubmit={sendCode}>
        <Form.Group controlId="emailGroup">
          <Form.Label>Email address </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="text-danger mt-2">{emailValidationError}</div>
        </Form.Group>

        <Button className="mt-3" variant="light" type="submit">
          Send code
        </Button>
        {isCodeSent && (
          <p>
            Code was sent to mentioned email address. Check address again if you
            didn't receive any code and press "send code" again.
          </p>
        )}
      </Form>

      {isCodeSent && (
        <Form noValidate onSubmit={validateCode}>
          <Form.Group controlId="codeGroup">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="text-danger mt-2">{codeValidationError}</div>
          </Form.Group>

          <Button className="mt-3" variant="light" type="submit">
            Validate code
          </Button>
          <div className="text-danger mt-2">{sendCodeError}</div>
        </Form>
      )}
    </Container>
  );
}
