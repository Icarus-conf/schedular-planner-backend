import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUserByEmail = await this.findUserByEmail(createUserDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingUserByUsername = await this.findUserByUsername(createUserDto.username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already in use');
    }


    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email }
    });
  }

  async findUserByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username }
    });
  }
}
