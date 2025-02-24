//user.interface.ts
import { Result } from "@/lib/shared/result";
import { ServiceError } from "@/lib/errors/service-error";
import { RepositoryError } from "@/lib/errors/repository-error";
import { User, CreateUserDTO, UpdateUserDTO } from "./user.entity";

export interface IUser<E extends Error> {
  create(date: CreateUserDTO): Promise<Result<User, E>>;
  getUser(id: string): Promise<Result<User | null, E>>;
}

export interface IUserRepository extends IUser<RepositoryError> {}
export interface IUserService extends IUser<ServiceError> {}
