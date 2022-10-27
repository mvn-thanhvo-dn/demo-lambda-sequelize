import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

import { profileRepository } from '../repositories';
import { checkAuth } from '../utils/auth';
import { validateData } from '../utils/validate-data';
import { UpdateProfileDto } from '../dtos';

export const getProfile = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {
    const data = checkAuth(event);
    const profile = await profileRepository.findOne({
      where: { userId: data['id'] },
    });
    response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(profile),
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

export const updateProfile = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  const { id } = event.pathParameters;
  const requestBody = JSON.parse(event.body);
  try {
    checkAuth(event);
    const message = await validateData(UpdateProfileDto, requestBody);
    if (message) {
      response = {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({ message }),
      };
      return response;
    }
    const profileData = plainToInstance(UpdateProfileDto, requestBody);
    await profileRepository.update(profileData, { where: { id } });
    response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ message: 'Update profile success!' }),
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

export const deleteProfile = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;
  try {
    const data = checkAuth(event);
    await profileRepository.destroy({ where: { userId: data['id'] } });
    response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ message: 'Delete profile success!' }),
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
