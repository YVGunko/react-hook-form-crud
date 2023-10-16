function get() {
  const orderGridState = sessionStorage.getItem('orderGridState');
  console.log(`orderGridState get data=', ${JSON.parse(orderGridState)}`);
  return orderGridState || null;
}
export { get };

function set(orderGridState) {
  console.log(`orderGridState set data=', ${JSON.stringify(orderGridState)}`);
  return sessionStorage.setItem('orderGridState', JSON.stringify(orderGridState));
}
export { set };

export const orderGridService = {
  get,
  set,
};
