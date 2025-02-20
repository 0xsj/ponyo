import { CreateUserDTO } from "./dto";
import { Profile, User } from "./models";
import { Result } from "./shared/result";
import { APIError } from "./errors/api-error";

export interface IUser<E extends Error = APIError> {
  create?(data: CreateUserDTO): Promise<Result<User, E>>;
  get(id: string): Promise<Result<User, E>>;
  getByUsername?(username: string): Promise<Result<User, E>>;
  update?(id: string, data: Partial<User>): Promise<Result<User, E>>;
}


export interface IProfile<E extends Error = APIError> {
  create?(): Promise<Result<Profile, E>>;
  
  get(id: string): Promise<Result<Profile, E>>;
  update(
    id: string,
    data: Partial<Profile>,
  ): Promise<Result<Profile, E>>;
}
