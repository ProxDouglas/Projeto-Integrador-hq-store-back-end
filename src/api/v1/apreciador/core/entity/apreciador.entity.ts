import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import Carrinho from '../../../carrinho/core/entity/carrinho.entity';

@Entity({ name: 'apreciador' })
export default class Apreciador {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'nome', nullable: false })
    nome: string;

    @Length(2, 11)
    @IsNotEmpty()
    @Column({ name: 'cpf', nullable: false })
    cpf: string;
    
    @Length(2, 255)
    @IsNotEmpty()
    @Column({ name: 'email', nullable: false })
    email: string;

    @OneToMany(() => Carrinho, (carrinho) => carrinho.apreciador)
    carrinho: Carrinho;
}
