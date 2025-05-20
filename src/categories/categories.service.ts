import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  async create({ name }: CreateCategoryDto, user: User) {
    const existingCat = await this.categoriesRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existingCat) throw new ConflictException('Category already exists');
    const category = this.categoriesRepo.create({ name, user });

    await this.categoriesRepo.save(category);

    return {
      message: 'Created Successfully',
    };
  }

  async findAll(user: User) {
    return this.categoriesRepo.find({
      where: {
        user: { id: user.id },
      },
    });
  }

  async findOne(id: number, user: User) {
    const cat = await this.categoriesRepo.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (!cat) throw new NotFoundException('Category not found');

    return cat;
  }

  async remove(id: string, user: User) {
    const cat = await this.findOne(+id, user);
    await this.categoriesRepo.remove(cat);
  }
}
