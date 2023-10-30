import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(user: AuthUserDto, res) {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('User not exists');
    }

    const passwordsCompared = await compare(
      user.password,
      existingUser.password,
    );

    if (!passwordsCompared) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    res.cookie(
      'refresh_token',
      this.jwtService.sign(payload, { expiresIn: '7d' }),
    );

    return {
      user: existingUser,
      accessToken: this.jwtService.sign(payload), // refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async signUp(user: AuthUserDto, res) {
    const existingUser = await this.usersService.findByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.usersService.create(user);

    const payload = {
      id: createdUser.id,
      email: createdUser.email,
    };

    res.cookie(
      'refresh_token',
      this.jwtService.sign(payload, { expiresIn: '7d' }),
    );

    return {
      user: createdUser,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async refreshToken(payload: { id: number; email: string }) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
