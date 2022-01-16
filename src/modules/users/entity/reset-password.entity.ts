import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm'
import { Status } from '../users.enum'

@Entity()
export class ResetPassword {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  userID: number

  @Column()
  token: string

  @Column({ type: 'enum', enum: Status })
  status: string

  @Column()
  expiredAt: Date

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
