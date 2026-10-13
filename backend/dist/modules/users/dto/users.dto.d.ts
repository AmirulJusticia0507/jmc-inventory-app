import { Role } from '@prisma/client';
export declare class CreateUserDto {
    username: string;
    password: string;
    nama: string;
    email: string;
    role: Role;
}
export declare class UpdateUserDto {
    nama?: string;
    email?: string;
    role?: Role;
}
export declare class ChangePasswordDto {
    newPassword: string;
}
