import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepo: Repository<Note>,
    private categoriesService: CategoriesService,
  ) {}

  async create(
    { title, content }: CreateNoteDto,
    user: User,
    categoryId?: number,
  ) {
    let category;
    if (categoryId) {
      category = await this.categoriesService.findOne(categoryId, user);
    }

    const note = this.notesRepo.create({
      title,
      content,
      user,
      category,
    });
    await this.notesRepo.save(note);

    return {
      message: 'Created Successfully',
    };
  }

  async findAll(
    user: User,
    sortBy: 'createdAt' | 'updatedAt' = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
    categoryId?: number,
  ) {
    const query = {
      where: {
        user: {
          id: user.id,
        },
      },
      order: { [sortBy]: order },
      relations: ['category'],
    };

    if (categoryId) {
      query.where['category'] = { id: categoryId };
    }

    return this.notesRepo.find(query);
  }

  async findOne(id: number, user: User) {
    const note = await this.notesRepo.findOne({
      where: {
        id,
        user: { id: user.id },
      },
      relations: ['category'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    user: User,
    categoryId?: number,
  ) {
    const note = await this.findOne(id, user);
    note.title = updateNoteDto.title;
    note.content = updateNoteDto.content;
    if (categoryId !== undefined) {
      note.category = categoryId
        ? await this.categoriesService.findOne(categoryId, user)
        : null;
    }
    await this.notesRepo.save(note);
    return {
      message: 'Updated Successfully',
    };
  }

  async remove(id: number, user: User) {
    const note = await this.findOne(id, user);
    await this.notesRepo.remove(note);
    return {
      message: 'Note removed successfully',
    };
  }
}
