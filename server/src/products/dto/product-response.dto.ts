import { Expose } from 'class-transformer';
import { BasicResponseDto } from 'src/shared/domain/basic-response.dto';

export class ProductResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description?: string | null;

  @Expose()
  price!: number;

  @Expose()
  isActive!: boolean;

  @Expose()
  category!: BasicResponseDto;
}
