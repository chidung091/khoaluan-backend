import { isString, trim, isNumber, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';

export const round2Number = (rawNum: number | string, precise?: number): number => {
  if (isString(rawNum)) {
    rawNum = trim(rawNum);
  }
  const num = Number(rawNum);
  if (!isNumber(num)) {
    return num;
  }

  const multipleOfTen = 10 ** (precise || 2);

  return Math.round(num * multipleOfTen) / multipleOfTen;
};

export const round2NumberToString = (num: any, precise?: number) => {
  if (isEmpty(num) || (!isNumber(num) && !isString(num))) {
    return '';
  }

  return round2Number(num, precise).toFixed(precise || 2);
};

export function decodeJWTToken(token: string) {
  return jwt.decode(token);
}

export function isClientErrorStatus(status) {
  if (!status) {
    return false;
  }

  return status.toString().match(/^4\d{2}$/);
}

export const isArrayNotEmpty = (arr) => Array.isArray(arr) && arr.length;
