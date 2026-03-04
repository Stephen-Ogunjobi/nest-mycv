import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create(email, hashedPassword);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return user;
  }

  async signout(userId: any) {
    if (!userId) {
      throw new BadRequestException('Provide userId');
    }
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
