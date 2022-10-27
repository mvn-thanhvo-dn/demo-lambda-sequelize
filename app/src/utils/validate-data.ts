import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const validateData = async (
  type: any,
  data: any,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
) => {
  let message = '';
  const errors: ValidationError[] = await validate(
    plainToInstance(type, data),
    {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    },
  );
  if (errors.length > 0) {
    message = errors
      .map((error: ValidationError) => Object.values(error.constraints))
      .join(', ');
  }
  return message;
};
