import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* Utils */
import LocalStorageMethods from '../utils/localStorage';
import validateEmail from '../utils/validators/validateEmail';
import validatePassword from '../utils/validators/validatePassword';
import messages from '../utils/messages';

/* Services */
import { loginRequest } from '../services/request';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailErrVisible, setEmailErrVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordErrVisible, setPasswordErrVisible] = useState(false);
  const [loginErrVisible, setLoginErrVisible] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  // redirect to customer products
  useEffect(() => {
    const user = LocalStorageMethods.getParsedItem('user');
    if (user) {
      if (user.role === 'customer') {
        navigate('/customer/products');
      } else {
        navigate('/seller/orders');
      }
    }
  }, [navigate]);

  // enable submit
  useEffect(() => {
    if (validateEmail(email) && validatePassword(password)) {
      setSubmitDisabled(false);
    }
  }, [email, navigate, password]);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await loginRequest({ email, password });

      if (user) {
        // save user
        localStorage.setItem('user', JSON.stringify({
          email,
          ...user,
        }));

        if (user.role === 'customer') {
          navigate('/customer/products');
        } else {
          navigate('/seller/orders');
        }
      }
    } catch (err) {
      console.log(err);
      setLoginErrVisible(true);
    }
  };

  return (
    <div>
      <form action="">
        <input
          data-testid="common_login__input-email"
          type="email"
          name="email"
          id="email"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
          onBlur={
            () => setEmailErrVisible(!validateEmail(email))
          }
        />

        <input
          data-testid="common_login__input-password"
          type="password"
          name="password"
          id="password"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
          onBlur={
            () => setPasswordErrVisible(!validatePassword(password))
          }
        />

        <button
          data-testid="common_login__button-login"
          type="submit"
          disabled={ submitDisabled }
          onClick={ handleSubmit }
        >
          LOGIN
        </button>

        {
          loginErrVisible && (
            <span data-testid="common_login__element-invalid-email">
              { messages.login.notFound }
            </span>
          )
        }
        {
          emailErrVisible && (
            <span data-testid="common_login__element-invalid-email">
              { messages.email.invalid }
            </span>
          )
        }
        {
          passwordErrVisible && (
            <span data-testid="common_login__element-invalid-password">
              { messages.password.invalid }
            </span>
          )
        }
      </form>

      <button
        type="button"
        data-testid="common_login__button-register"
      >
        <Link to="/register">Sign up</Link>
      </button>
    </div>
  );
}
