import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* Utils */
import {
  validateName,
  validateEmail,
  validatePassword,
} from '../utils/validators';

import messages from '../utils/messages';

/* Services */
import { registerRequest } from '../services/request';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nameErrVisible, setNameErrVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErrVisible, setEmailErrVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErrVisible, setPasswordErrVisible] = useState(false);
  const [registerErrVisible, setRegisterErrVisible] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    if (
      validateName(name)
      && validateEmail(email)
      && validatePassword(password)
    ) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [
    email,
    name,
    password,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerRequest({
        email,
        password,
        name,
      });

      localStorage.setItem('user', JSON.stringify(data));

      navigate('/customer/products');
    } catch (err) {
      setRegisterErrVisible(true);
    }
  };

  return (
    <div>
      <form action="">
        <input
          type="text"
          data-testid="common_register__input-name"
          value={ name }
          onChange={ (e) => setName(e.target.value) }
          onBlur={
            () => setNameErrVisible(!validateName(name))
          }
        />

        <input
          type="email"
          data-testid="common_register__input-email"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
          onBlur={
            () => setEmailErrVisible(!validateEmail(email))
          }
        />

        <input
          type="password"
          data-testid="common_register__input-password"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
          onBlur={
            () => setPasswordErrVisible(!validatePassword(password))
          }
        />

        <button
          id="register-btn"
          type="submit"
          data-testid="common_register__button-register"
          onClick={ handleSubmit }
          disabled={ submitDisabled }
        >
          Create account
        </button>
      </form>

      {
        registerErrVisible && (
          <span
            data-testid="common_register__element-invalid_register"
          >
            { messages.register.conflict }
          </span>
        )
      }
      {
        nameErrVisible && (
          <span
            data-testid="common_register__element-invalid_register"
          >
            { messages.name.invalid }
          </span>
        )
      }
      {
        emailErrVisible && (
          <span
            data-testid="common_register__element-invalid_register"
          >
            { messages.email.invalid }
          </span>
        )
      }
      {
        passwordErrVisible && (
          <span
            data-testid="common_register__element-invalid_register"
          >
            { messages.password.invalid }
          </span>
        )
      }
    </div>
  );
}
