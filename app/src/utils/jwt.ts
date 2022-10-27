import 'dotenv/config';
import { sign, verify } from 'jsonwebtoken';
import { Token } from '../shared/interfaces';

export const getAccessToken = (data: Token) => {
  return sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.ACCESS_TOKEN_SECRET);
};
