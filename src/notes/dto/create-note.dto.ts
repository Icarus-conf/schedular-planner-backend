import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt({ message: 'Category ID must be an integer' })
  @IsOptional()
  categoryId?: number;
}
