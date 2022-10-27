import { IsDate, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsDate()
  @IsOptional()
  birthday: Date;
}
