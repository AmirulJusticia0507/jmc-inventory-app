import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        username: string;
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        isLocked: boolean;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        username: string;
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        isLocked: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        username: string;
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        isLocked: boolean;
        createdAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        username: string;
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        isLocked: boolean;
        createdAt: Date;
    }>;
    toggleLock(id: string): Promise<{
        username: string;
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        isLocked: boolean;
    }>;
    changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<{
        id: string;
    }>;
    remove(id: string): Promise<{
        username: string;
        password: string;
        id: string;
        email: string;
        nama: string;
        role: import(".prisma/client").$Enums.Role;
        isLocked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private validatePassword;
}
