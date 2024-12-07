import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';

@Entity({ name: 'fornecedor' })
export default class Fornecedor {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'nome', nullable: false })
    name: string;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'cnpj', type: 'varchar', nullable: false })
    cnpj: string;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'pais', type: 'varchar', nullable: false })
    pais: string;
}
