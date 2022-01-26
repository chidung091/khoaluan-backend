import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Status } from './time.enum'

@Entity()
export class Time {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  startYear: number

  @Column()
  endYear: number

  @Column()
  semester: number

  @Column()
  startTimeStudent: Date

  @Column()
  endTimeStudent: Date

  @Column()
  startTimeMonitor: Date

  @Column()
  endTimeMonitor: Date

  @Column()
  startTimeHeadMaster: Date

  @Column()
  endTimeHeadMaster: Date

  @Column()
  startTimeDepartment: Date

  @Column()
  endTimeDepartment: Date

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

  @Column({ type: 'enum', enum: Status, default: Status.Inactive })
  status: Status
}
