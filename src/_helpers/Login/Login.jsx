import React, { useState } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
// import './Login.css';
import { fetchWrapper } from '@/_helpers';
// import api  from "../http-common/http-common";

const baseUrl = `${config.apiUrl}/login`;

async function loginUser(credentials) {
  return fetchWrapper.auth(baseUrl, credentials);
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState({
    error: false,
    status: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({ // TODO useCustomer(0) ???
      id: '0',
      username,
      password,
      roles: '',
    });

    if (token) {
      if (token.error) {
        console.log(`Login, token.error=${token?.error}`);
        setError({
          error: token?.error,
          status: token?.status,
        });
      } else {
        token.password = password;
        setToken(token);
      }
    }
  };

  if (error?.error) {
    return (<div className="login-wrapper"><h1>Нет доступа к серверу приложения. Попробуйте позже...</h1></div>);
  }
  return (
    <div className="p-4">
      <div className="container">
        <div className="row">
          <div className="col-md-5 col-sm-6 col-lg-3 mx-auto">
            <div className="formContainer">
              <h2 className="p-2 text-center mb-4 h4" id="formHeading">Вход тут...</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                  <label className="mb-2" htmlFor="username">Имя пользователя </label>
                  <input onChange={(e) => setUserName(e.target.value)} className="form-control" id="username" name="username" type="text" />
                </div>
                <div className="form-group mt-3">
                  <label className="mb-2" htmlFor="password">Пароль</label>
                  <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" name="password" />
                </div>
                <button type="submit" className="btn btn-success btn-lg w-100 mt-4">Войти</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
