import { PermissionDto } from "./permission.dto";

export interface RoleDto {
    id?:string,
    name?:string,
    description?:string,
    status?:string,
    permissions?:PermissionDto[]
    createdAt?:string,
    updatedAt?:string,
}
