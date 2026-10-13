import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            nama: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    validateUser(userId: string): Promise<{
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
}
