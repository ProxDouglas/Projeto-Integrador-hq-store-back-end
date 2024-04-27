import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Comics from 'src/api/v1/comics/core/entity/comics.entity';

@Entity({ name: 'hq_imagem' })
export default class ComicsImage {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'imagem', type: 'bytea', nullable: false })
    buffer: Buffer;

    @Column({ name: 'codificacao', type: 'varchar', nullable: false })
    encoding: string;

    @Column({ name: 'mimetype', type: 'varchar', nullable: false })
    mimetype: string;

    @Column({ name: 'nome_original', type: 'varchar', nullable: false })
    originalname: string;

    @Column({ name: 'size', type: 'integer', nullable: false })
    size: number;

    @Column({ name: 'hq_id', type: 'integer', nullable: false })
    comics_id: number;

    @ManyToOne(() => Comics, (comics) => comics.images)
    @JoinColumn({ name: 'hq_id', referencedColumnName: 'id' })
    comics: Comics;
}
