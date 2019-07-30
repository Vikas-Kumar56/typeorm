import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('varchar', { length: 50 })
  author!: string;

  @Column('varchar', { length: 50 })
  title!: string;

  @Column('varchar', { length: 255 })
  body!: string;

  @Column('boolean', { default: false })
  isPublished!: boolean;
}
