import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

const DEMO_USERS = [
  {
    username: 'admin',
    password: 'password123',
    nama: 'Administrator',
    email: 'admin@jmc.com',
    role: Role.Admin,
  },
  {
    username: 'operator1',
    password: 'password123',
    nama: 'Operator Gudang',
    email: 'operator1@jmc.com',
    role: Role.Operator,
  },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    for (const user of DEMO_USERS) {
      const existing = await this.prisma.user.findUnique({
        where: { username: user.username },
      });

      if (existing) {
        this.logger.log(`User ${user.username} already exists, skipping.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await this.prisma.user.create({
        data: {
          username: user.username,
          password: hashedPassword,
          nama: user.nama,
          email: user.email,
          role: user.role,
        },
      });

      this.logger.log(`Demo user created: ${user.username} (${user.role})`);
    }
  }
}
