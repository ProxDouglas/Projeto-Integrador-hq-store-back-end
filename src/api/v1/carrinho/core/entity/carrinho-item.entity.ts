import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
// import { Length, IsNotEmpty, isInt } from 'class-validator';
import Comics from '../../../comics/core/entity/comics.entity';
import Carrinho from '../../../carrinho/core/entity/carrinho.entity';

@Entity({ name: 'carrinho_item' })
export default class CarrinhoItem {
    @PrimaryColumn({ name: 'carrinho_id' })
    carrinho_id: number;

    @PrimaryColumn({ name: 'hq_id' })
    hq_id: number;

    @Column({ name: 'quantidade', nullable: false })
    quantidade: number;

    @ManyToOne(() => Carrinho, (carrinho) => carrinho.itens)
    @JoinColumn({ name: 'carrinho_id', referencedColumnName: 'id' })
    carrinho: Carrinho;

    @OneToOne(() => Comics, (comics) => comics.carrinho_item)
    @JoinColumn({ name: 'hq_id', referencedColumnName: 'id' })
    comics: Comics;

    /*
    @ManyToMany(() => Comics)
    @JoinTable({
        name: 'hq_colecao',
        joinColumn: { name: 'colecao_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'hq_id',
            referencedColumnName: 'id',
        },
    })
    */
}
