import { Document } from "mongoose";

export interface SignupDto {
  readonly fullname: string;
  readonly email: string;
  readonly password: string;
}

export interface LoginDto {
  readonly email: string;
  readonly password: string;
}

export interface UserSchemaDto extends Document {
  fullname: string;
  email: string;
  password: string;
}

export interface GetTokenDto {
  fullname: string;
  _id: string;
  email: string;
  password: undefined;
}

export interface ForgotRequestDto {
  email: string;
}
