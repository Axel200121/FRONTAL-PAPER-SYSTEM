import { CategoryDto } from "./category.dto"
import { ProviderDto } from "./provider.dto"

export interface ProductDto {
    id?:string
    codeProduct?:string
    name?:string
    description?:string
    buyPrice?:number
    salePrice?:number
    stock?:number
    minimumStcok?:number
    urlImage?:string
    status?:string
    category?:CategoryDto
    provider?:ProviderDto
    createdAt?:string
    updatedAt?:string

}
