import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity()
export class PointFrame {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'nvarchar', length: '100' })
  stringPoint: string

  @Column()
  minPoint: number

  @Column()
  maxPoint: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date
}
