/* eslint-disable no-use-before-define */
/* eslint-disable import/prefer-default-export */
export const tokenService = {
  get,
};
function get() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken;
}
