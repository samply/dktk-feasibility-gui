import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { CategoryEntry, TerminologyEntry } from '../model/api/terminology/terminology'
import { AppConfigService } from '../../../config/app-config.service'
import { Observable, of } from 'rxjs'
import { FeatureService } from '../../../service/feature.service'
import { Query } from '../model/api/query/query'
import { QueryResponse } from '../model/api/result/QueryResponse'
import { QueryResult, QueryResultSB } from '../model/api/result/QueryResult'
import { MockBackendDataProvider } from './MockBackendDataProvider'
import { ApiTranslator } from '../controller/ApiTranslator'
import { HttpHeaders } from '@angular/common/http'
import SearchbrokerResult from '../../../../assets/mock/MockedSearchbrokerResult.json'

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(
    private config: AppConfigService,
    private feature: FeatureService,
    private http: HttpClient
  ) {}
  private static PATH_ROOT_ENTRIES = 'terminology/root-entries'
  private static PATH_TERMINOLOGY_SUBTREE = 'terminology/entries'
  private static PATH_SEARCH = 'terminology/selectable-entries'
  private static PATH_RUN_QUERY = 'queries'

  public static MOCK_RESULT_URL = 'http://localhost:9999/result-of-query/12345'

  private readonly mockBackendDataProvider = new MockBackendDataProvider(this.feature)
  lowerBoundaryPatient: number = this.feature.getPatientResultLowerBoundary()

  public getCategories(): Observable<Array<CategoryEntry>> {
    if (this.feature.mockTerminology()) {
      return of(this.mockBackendDataProvider.getCategoryEntries())
    }

    return this.http.get<Array<CategoryEntry>>(
      this.createUrl('backend', BackendService.PATH_ROOT_ENTRIES)
    )
  }

  public getTerminolgyTree(id: string): Observable<TerminologyEntry> {
    if (this.feature.mockTerminology()) {
      return of(this.mockBackendDataProvider.getTerminologyEntry(id))
    }

    return this.http.get<TerminologyEntry>(
      this.createUrl('backend', BackendService.PATH_TERMINOLOGY_SUBTREE + '/' + id)
    )
  }

  public getTerminolgyEntrySearchResult(
    catId: string,
    search: string
  ): Observable<Array<TerminologyEntry>> {
    if (this.feature.mockTerminology()) {
      return of(this.mockBackendDataProvider.getTerminolgyEntrySearchResult(catId, search))
    }

    const queryParam = 'query=' + search.toUpperCase() + (catId ? '&categoryId=' + catId : '')
    const url = this.createUrl('backend', BackendService.PATH_SEARCH, queryParam)

    return this.http.get<Array<TerminologyEntry>>(url)
  }

  public postQuery(query: Query): Observable<any> {
    if (this.feature.mockQuery()) {
      return of({ location: BackendService.MOCK_RESULT_URL })
    }

    if (this.feature.getQueryVersion() === 'v1') {
      const queryV1 = new ApiTranslator().translateToV1(query)
      return this.http.post<QueryResponse>(
        this.createUrl('backend', BackendService.PATH_RUN_QUERY),
        queryV1
      )
    }
    if (this.feature.getQueryVersion() === 'v2') {
      const queryV2 = new ApiTranslator().translateToV2(query)
      // return this.http.post<QueryResponse>(this.createUrl('backend', BackendService.PATH_RUN_QUERY), queryV2)

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Basic ' + btoa('test123:test123'))
        .set('Accept', 'text/plain; charset=utf-8')

      const test = { query: JSON.stringify(queryV2), target: [], queryName: 'foo' }
      return this.http.post<any>(
        this.createUrl('searchbroker', BackendService.PATH_RUN_QUERY),
        JSON.stringify(test),
        { headers, observe: 'response' }
      )
    }
  }

  public getResult(resultUrl: string): Observable<QueryResultSB> {
    if (this.feature.mockResult()) {
      const result = {
        totalNumberOfPatients: Math.floor(Math.random() * 1000),
        queryId: '12345',
        resultLines: [
          { siteName: 'Standort 1', numberOfPatients: 351 },
          { siteName: 'Standort 2', numberOfPatients: 1277 },
          { siteName: 'Standort 3', numberOfPatients: 63 },
          { siteName: 'Standort 4', numberOfPatients: 0 },
        ],
      }

      return of(SearchbrokerResult)
    }
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('test123:test123'))
    return this.http.get<QueryResultSB>(resultUrl, { headers })
  }

  createUrl(broker: string, pathToResource: string, paramString?: string): string {
    let url: string
    if (broker === 'backend') {
      url = this.config.getConfig().uiBackendApi.baseUrl
    }
    if (broker === 'searchbroker') {
      url = this.config.getConfig().uiSearchbrokerApi.baseUrl
    }
    if (!url.endsWith('/')) {
      url += '/'
    }

    url += pathToResource

    if (paramString) {
      url += '?' + paramString
    }
    return url
  }

  obfuscateResult(result: number): string {
    if (this.lowerBoundaryPatient === undefined) {
      return 'obfuscated'
    } else {
      if (result === 0) {
        return '0'
      } else {
        if (result <= this.lowerBoundaryPatient) {
          return '< ' + this.lowerBoundaryPatient.toString()
        } else {
          if (result !== undefined) {
            return result.toString()
          } else {
            return 'undefined'
          }
        }
      }
    }
  }
}
