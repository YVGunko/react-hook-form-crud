/**
 * Check if Object is string. 
 * @param str 
 * @returns 
 */
export function isString(str) {
    return Object.prototype.toString.call(str) === "[object String]" && !!str
  }
  
/**
 * Check null, should contain only letters, allowed space, min length is minLength. 
 * @param minLength 
 * @param string 
 * @returns 
 */
export const isStringInValid = (string, minLength) => {
    return !string || !string?.trim() || !/^[a-zA-Za-åa-ö-w-я0-9_]+(?:\W+[a-zA-Z0-9_]+)*\W*$/.test(string) || string.length < minLength
}

/**
 * Check null, should contain only letters, allowed space, min length is minLength. 
 * @param str  
 * @returns 
 */
export function removeSpecials(str) {
  let lower = str.toLowerCase();
  let upper = str.toUpperCase();

  let res = "",i=0,n=lower.length,t;
  for(i; i<n; ++i) {
      if(lower[i] !== upper[i] || lower[i].trim() === ''){
          t=str[i];
          if(t!==undefined){
              res +=t;
          }
      }
  }
  return res;
}

/**
 * Check if Object is empty 
 * @param objectName  
 * @returns 
 */
export const isObjectEmpty = (objectName) => {
    return objectName && Object.keys(objectName).length === 0
  }