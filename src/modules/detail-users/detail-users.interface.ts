import { Role } from './detail-users.enum'

export interface IMonitor {
  monitorId: number
  startYear: number
  semester: number
  endYear: number
}

export interface IHeadMaster {
  headMasterId: number
  startYear: number
  semester: number
  endYear: number
  classId: number
}
export interface IMonitorSearch {
  monitorId: number
  startYear: number
  semester: number
  endYear: number
  studentId: number
}
export interface IHeadMasterSearch {
  headMasterId: number
  startYear: number
  semester: number
  endYear: number
  studentId: number
}

export interface IHeadMasterResponse {
  id: number
  classId: number
}

export interface IStudentMonitorResponse {
  id: number
  classId: number
  oldMonitorId: number
}

export interface IScoreRequest {
  studentId: number
  type: Role
}
