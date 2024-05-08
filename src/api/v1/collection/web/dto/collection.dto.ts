import { Length, IsNotEmpty } from 'class-validator';

export default class CollectionDto {
    id: number;

    @Length(2, 155)
    @IsNotEmpty()
    name: string;

    @Length(0, 700)
    description: string;
}
