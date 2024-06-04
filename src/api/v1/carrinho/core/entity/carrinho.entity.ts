import {
    Column,
    Entity,
    JoinTable,
    OneToMany,
    OneToOne,
    ManyToMany,
    PrimaryGeneratedColumn,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import {
    IsInt,
    Min,
    Max,
    Length,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    isInt,
    IsIn,
    isNumber,
} from 'class-validator';
import Apreciador from '../../../apreciador/core/entity/apreciador.entity';
import Comics from '../../../comics/core/entity/comics.entity';

@Entity({ name: 'carrinho' })
export default class Carrinho {
    @PrimaryColumn({ name: 'apreciador_id' })
    apreciador_id: number;

    @PrimaryColumn({ name: 'hq_id' })
    hq_id: number;

    @ManyToOne(() => Apreciador, (apreciador) => apreciador.carrinho)
    @JoinColumn({ name: 'apreciador_id', referencedColumnName: 'id' })
    apreciador: Apreciador;

    @ManyToOne(() => Comics, (comics) => comics.carrinho)
    @JoinColumn({ name: 'hq_id', referencedColumnName: 'id' })
    comics: Comics;

    @Length(1, 15)
    @IsInt()
    @Column({ name: 'quantidade', nullable: true })
    quantidade: number;

}
