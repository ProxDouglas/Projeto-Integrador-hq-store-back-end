import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Apreciador from '../../../apreciador/core/entity/apreciador.entity';
import CarrinhoItem from './carrinho-item.entity';

@Entity({ name: 'carrinho' })
export default class Carrinho {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'apreciador_id', nullable: false })
    apreciador_id: number;

    @ManyToOne(() => Apreciador, (apreciador) => apreciador.carrinho)
    @JoinColumn({ name: 'apreciador_id', referencedColumnName: 'id' })
    apreciador: Apreciador;

    @OneToMany(() => CarrinhoItem, (carrinho_item) => carrinho_item.carrinho)
    itens: CarrinhoItem[];
}
