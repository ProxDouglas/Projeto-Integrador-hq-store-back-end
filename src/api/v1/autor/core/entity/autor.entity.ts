import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';

@Entity({ name: 'autor' })
export default class Autor {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'nome', nullable: false })
    nome: string;
}
