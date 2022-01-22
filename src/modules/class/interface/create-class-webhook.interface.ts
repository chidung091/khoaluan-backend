export interface ICreateClassWebhook {
  classId: number
  courseId: number
  students: IStudents[]
}

export interface IStudents {
  semester: number
  studentsIds: Array<number>
  startYear: number
  endYear: number
  headMasterId: number
  monitorId: number
}

export interface IClassIds {
  classIds: Array<number>
}

export interface IMonitorId {
  monitorId: number
}

export interface ITeacher {
  headMasterId: number
  startYear: number
  semester: number
  endYear: number
}
export interface IClassId {
  classId: number
}

export interface IClassResponse {
  id: number
  createdAt: Date
  updatedAt: Date
  classId: number
  courseId: number
  students: IStudents[]
}
