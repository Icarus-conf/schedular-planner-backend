import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('create')
  create(@Body() body: CreateNoteDto, @Request() req) {
    return this.notesService.create(body, req.user, body.categoryId);
  }

  @Get('get-all-notes')
  findAll(
    @Request() req,
    @Query('sortBy') sortBy: 'createdAt' | 'updatedAt' = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.notesService.findAll(req.user);
  }

  @Get('get-one-note/:id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(+id, req.user);
  }

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() { title, content, categoryId }: UpdateNoteDto,
    @Request() req,
  ) {
    return this.notesService.update(
      +id,
      { title, content },
      req.user,
      categoryId!,
    );
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Request() req) {
    return this.notesService.remove(+id, req.user);
  }
}
