import { RoleDto } from "./role.dto";

export interface UserDto {
    id?:string,
    name?:string,
    lastName?:string,
    password?:string,
    confirmPassword?:string,
    email?:string,
    phone?:string,
    address?:string,
    status?:string,
    role?:RoleDto
    createdAt?:string,
    updatedAt?:string,
}
