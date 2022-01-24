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

export interface IHeadMasterResponse {
  id: number
  classId: number
}
