import { APIGatewayProxyEvent } from 'aws-lambda';
import { verifyToken } from './jwt';

export const checkAuth = (event: APIGatewayProxyEvent) => {
  const token = event.headers['Authorization']
    ? event.headers['Authorization'].split(' ')[1]
    : null;
  return verifyToken(token);
};
