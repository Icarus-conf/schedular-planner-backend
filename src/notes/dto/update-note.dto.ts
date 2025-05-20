import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsInt({ message: 'Category ID must be an integer' })
  @IsOptional()
  categoryId?: number | null;
}
