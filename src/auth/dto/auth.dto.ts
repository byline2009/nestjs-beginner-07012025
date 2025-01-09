import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @MaxLength(12)
  password: string;
  firstName: string;
  lastName: string;
}
