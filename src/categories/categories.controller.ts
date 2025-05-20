import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private cateService: CategoriesService) {}

  @Post()
  create(@Body() payload: CreateCategoryDto, @Request() req) {
    return this.cateService.create(payload, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.cateService.findAll(req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.cateService.remove(id, req.user);
  }
}
