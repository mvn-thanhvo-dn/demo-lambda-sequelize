import { IsEmail, IsString, IsNumber } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsNumber()
  age: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
