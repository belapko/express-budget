import { Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(user: AuthUserDto) {
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    return await this.prisma.user.create({ data: user });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
