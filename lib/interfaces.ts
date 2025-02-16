import { CreateUserDTO } from "./dto";
import { Profile, User } from "./models";
import { APIResult } from "./shared/result";

export interface IUser {
  create(data: CreateUserDTO): Promise<APIResult<User>>;
  get(id: string): Promise<APIResult<User>>;
  getByUsername(username: string): Promise<APIResult<User>>;
  update(id: string, data: Partial<User>): Promise<APIResult<User>>;
}

export interface IProfile {
  get(id: string): Promise<APIResult<Profile>>;
  update(id: string, data: Partial<Profile>): Promise<APIResult<Profile>>;
}
