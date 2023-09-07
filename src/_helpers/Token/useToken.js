import { useState } from 'react';
import { tokenService } from '@/_services';

export default function useToken() {
  const [token, setToken] = useState(tokenService.get());
  const saveToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };
  return {
    setToken: saveToken,
    token,
  };
}
