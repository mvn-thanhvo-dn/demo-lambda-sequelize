import { hashSync, compareSync } from 'bcryptjs';

const saltRounds = 10;

export const hashPassword = (password: string) => {
  return hashSync(password, saltRounds);
};

export const comparePassword = (password: string, dbPassword: string) => {
  return compareSync(password, dbPassword);
};
