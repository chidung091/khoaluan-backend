import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Users } from '../../users/entity/users.entity'

@Entity()
export class DetailUsers {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  birthDate: Date

  @Column()
  name: string

  @Column({ nullable: true })
  imageUrls: string

  @OneToOne(() => Users)
  @JoinColumn()
  users: Users

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
