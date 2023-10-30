import {
  Controller,
  Request,
  Body,
  Post,
  UseGuards,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from 'src/users/dto/create-user.dto';
import { RefreshJwtGuard } from './guards/jwtRefresh.guard';
import { JwtGuard } from './guards/jwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() user: AuthUserDto, @Res({ passthrough: true }) res) {
    return await this.authService.signIn(user, res);
  }

  @Post('signup')
  async signUp(@Body() user: AuthUserDto, @Res({ passthrough: true }) res) {
    return await this.authService.signUp(user, res);
  }

  @UseGuards(JwtGuard)
  @Get('verify')
  async verifyToken() {
    return {};
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }

  @Post('signout')
  signOut(@Res() res) {
    res.clearCookie('refresh_token');
    return res.sendStatus(200);
  }
}
