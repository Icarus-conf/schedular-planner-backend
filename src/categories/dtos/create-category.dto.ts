import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(1, { message: 'Category name cannot be empty' })
  @MaxLength(50, { message: 'Category name cannot exceed 50 characters' })
  name: string;
}
