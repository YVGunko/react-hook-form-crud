import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(`getToken, token=${userToken?.username || 'looks like userToken is null'}`);
    return userToken
  };
  const [token, setToken] = useState(getToken());
  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
    console.log(`saveToken, token.id=${userToken.password}`);
  };
  return {
    setToken: saveToken,
    token
  }
}