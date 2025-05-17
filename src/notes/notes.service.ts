import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private notesRepo: Repository<Note>) { }


  async create({ title, content }: CreateNoteDto, user: User) {
    const note = this.notesRepo.create({
      title,
      content,
      user
    })
    await this.notesRepo.save(note);

    return {
      message: 'Created Successfully'
    }
  }

  async findAll(user: User, sortBy: 'createdAt' | 'updatedAt' = 'createdAt', order: 'ASC' | 'DESC' = 'DESC') {
    return this.notesRepo.find({
      where: {
        user: {
          id: user.id
        }
      },
      order: { [sortBy]: order }
    })
  }

  async findOne(id: number, user: User) {
    const note = await this.notesRepo.findOne({
      where: {
        id,
        user: { id: user.id }
      }
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User) {
    const note = await this.findOne(id, user);
    note.title = updateNoteDto.title;
    note.content = updateNoteDto.content;
    await this.notesRepo.save(note);
    return {
      message: 'Updated Successfully'
    }
  }

  async remove(id: number, user: User) {
    const note = await this.findOne(id, user);
    await this.notesRepo.remove(note);
    return {
      message: 'Note removed successfully'
    }
  }
}
