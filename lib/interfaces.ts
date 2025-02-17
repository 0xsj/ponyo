import { CreateUserDTO } from "./dto";
import { Profile, User } from "./models";
import { Result } from "./shared/result";
import { APIError } from "./errors/api-error";

export interface IUser {
  create?(data: CreateUserDTO): Promise<Result<User, APIError>>;
  get(id: string): Promise<Result<User, APIError>>;
  getByUsername?(username: string): Promise<Result<User, APIError>>;
  update?(id: string, data: Partial<User>): Promise<Result<User, APIError>>;
}

export interface IProfile {
  get(id: string): Promise<Result<Profile, APIError>>;
  update(
    id: string,
    data: Partial<Profile>,
  ): Promise<Result<Profile, APIError>>;
}
