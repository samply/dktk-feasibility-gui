export class QueryResult {
  totalNumberOfPatients: number
  queryId: string

  resultLines: QueryResultLine[]
}

export class QueryResultLine {
  numberOfPatients: number
  siteName: string
}

export class QueryResultSB {
  totalNumberOfPatients?: number
  replySites: QueryResultSBLine[]
}
export class QueryResultSBLine {
  site: string
  donor: object
  sample: object
}
