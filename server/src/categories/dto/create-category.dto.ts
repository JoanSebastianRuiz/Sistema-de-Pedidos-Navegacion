import { IsString, MaxLength } from 'class-validator';
import { CATEGORY_ERROR_CODES } from 'src/shared/errors';

export class CreateCategoryDto {
  @IsString({ message: CATEGORY_ERROR_CODES.NAME_INVALID })
  @MaxLength(120, { message: CATEGORY_ERROR_CODES.NAME_TOO_LONG })
  name!: string;
}
