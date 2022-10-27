import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

import { userRepository, profileRepository } from '../repositories';
import { comparePassword } from '../utils/hash-password';
import { validateData } from '../utils/validate-data';
import { checkAuth } from '../utils/auth';
import { getAccessToken } from '../utils/jwt';
import { sequelize } from '../shared/configs/database';
import { RegisterUserDto, LoginDto } from '../dtos';

export const registerUser = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  const requestBody = JSON.parse(event.body);
  const trans = await sequelize.transaction();
  try {
    const message = await validateData(RegisterUserDto, requestBody);
    if (message) {
      response = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message }),
      };
      return response;
    }
    const userData = plainToInstance(RegisterUserDto, requestBody);
    const user = await userRepository.create({
      email: userData.email,
      password: userData.password,
    });
    await profileRepository.create({
      name: userData.name,
      age: userData.age,
      userId: user.id,
    });
    await trans.commit();
    response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ message: 'Register user success!' }),
    };
  } catch (err: unknown) {
    await trans.rollback();
    console.log(err);
    response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'Some error happened',
      }),
    };
  }
  return response;
};

export const login = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  const requestBody = JSON.parse(event.body);
  try {
    const message = await validateData(LoginDto, requestBody);
    if (message) {
      response = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message }),
      };
      return response;
    }
    const { email, password } = plainToInstance(LoginDto, requestBody);
    const user = await userRepository.findOne({
      where: { email },
      include: [profileRepository],
    });
    if (user && comparePassword(password, user.password)) {
      response = {
        statusCode: StatusCodes.OK,
        body: JSON.stringify({
          accessToken: getAccessToken({
            id: user.id,
            email,
            name: user.profile.name,
          }),
        }),
      };
    } else {
      response = {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({ message: 'Email or password is incorrect!' }),
      };
    }
  } catch (err: unknown) {
    console.log(err);
    response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({
        message: err instanceof Error ? err.message : 'Some error happened',
      }),
    };
  }
  return response;
};

export const getAllUsers = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {
    checkAuth(event);
    const users = await userRepository.findAll({
      include: [profileRepository],
    });
    response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(users),
    };
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof TokenExpiredError) {
      response = {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          message: err.message,
        }),
      };
    } else if (err instanceof JsonWebTokenError) {
      response = {
        statusCode: StatusCodes.UNAUTHORIZED,
        body: JSON.stringify({
          message: err.message,
        }),
      };
    } else {
      response = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: JSON.stringify({
          message: err instanceof Error ? err.message : 'some error happened',
        }),
      };
    }
  }
  return response;
};
