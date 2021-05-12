import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { TerminologyEntry } from '../../../querybuilder/model/api/terminology/terminology'
import { TermEntry2CriterionTranslator } from '../../../querybuilder/controller/TermEntry2CriterionTranslator'
import { Criterion } from '../../../querybuilder/model/api/query/criterion'
import { Query, QueryOnlyV1 } from '../../../querybuilder/model/api/query/query'
import { QueryProviderService } from '../../../querybuilder/service/query-provider.service'
import { ApiTranslator } from '../../../querybuilder/controller/ApiTranslator'
import { interval, Observable, Subscription, timer } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, share, switchAll, takeUntil } from 'rxjs/operators'
import { QueryResult } from '../../../querybuilder/model/api/result/QueryResult'
import { FeatureService } from '../../../../service/feature.service'
import { BackendService } from '../../../querybuilder/service/backend.service'

@Component({
  selector: 'num-single-test',
  templateUrl: './single-test.component.html',
  styleUrls: ['./single-test.component.scss'],
})
export class SingleTestComponent implements OnInit, OnDestroy {
  @Input()
  item: any

  @Input()
  resultList: Array<TerminologyEntry>

  @Input()
  type: string

  @Output()
  found = new EventEmitter()

  readonly POLLING_INTERVALL_MILLISECONDS = this.featureService.getPollingIntervall() * 1000
  readonly POLLING_MAXL_MILLISECONDS = this.featureService.getPollingTime() * 1000

  istvorhanden: [boolean, string, string]
  private readonly translator
  criterion: Criterion
  query: Query
  translatedQuery: QueryOnlyV1
  postmanSync: string
  ergebnis: boolean
  result: QueryResult
  resultUrl: string
  showSpinningIcon = false

  subscriptionPolling: Subscription
  private subscriptionResult: Subscription
  public resultObservable$: Observable<QueryResult>

  constructor(
    private http: HttpClient,
    public featureService: FeatureService,
    public backend: BackendService
  ) {
    this.translator = new TermEntry2CriterionTranslator(false)
  }

  ngOnInit(): void {
    this.ergebnis = false

    console.log(this.item)

    //  if (this.type === "Condition") {
    this.isTestcodeInSearchData()

    this.query = this.buildQuery()
    if (this.istvorhanden[0]) {
      console.log(this.query)
      this.translatedQuery = new ApiTranslator().translateToV1(this.query)

      this.postQuery('sync').subscribe(
        (response) => {
          this.postmanSync = response
          if (this.postmanSync.toString() === '1') {
            this.ergebnis = true
            this.found.emit('1')
          } else {
            this.found.emit('0')
          }
        },
        (error) => {
          console.log(error)
          this.found.emit('0')
        }
      )
    } else {
      this.found.emit('notfound')
    }

    //   }
  }

  ngOnDestroy(): void {
    this.subscriptionPolling?.unsubscribe()
    this.subscriptionResult?.unsubscribe()
  }

  isTestcodeInSearchData(): void {
    let TestdatenCode1: string
    let TestdatenCode2: string
    if (
      this.type === 'Condition' ||
      this.type === 'Observation' ||
      this.type === 'Procedure' ||
      this.type === 'DiagnosticReport'
    ) {
      TestdatenCode1 = this.item.resource?.code.coding[0]?.code
      TestdatenCode2 = this.item.resource?.code.coding[1]?.code
    }
    if (this.type === 'MedicationStatement') {
      TestdatenCode1 = this.item.resource?.medicationCodeableConcept?.coding[0]?.code
      TestdatenCode2 = this.item.resource?.medicationCodeableConcept?.coding[1]?.code
    }
    if (this.type === 'Immunization') {
      TestdatenCode1 = this.item.resource?.vaccineCode?.coding[0]?.code
      TestdatenCode2 = this.item.resource?.vaccineCode?.coding[1]?.code
    }
    if (this.type === 'Consent') {
      TestdatenCode1 = this.item.resource?.scope?.coding[0]?.code
      TestdatenCode2 = this.item.resource?.scope?.coding[1]?.code
    }
    if (this.resultList.filter((x) => x.termCode.code === TestdatenCode1).length > 0) {
      this.istvorhanden = [true, TestdatenCode1, '']
      this.criterion = this.buildCriterion(this.getElement()[0])
      console.log(this.criterion)
    } else {
      if (this.resultList.filter((x) => x.termCode.code === TestdatenCode2).length > 0) {
        this.istvorhanden = [true, TestdatenCode2, '']
        this.criterion = this.buildCriterion(this.getElement()[0])
        console.log(this.criterion)
      } else {
        this.istvorhanden = [false, TestdatenCode1, TestdatenCode2]
      }
    }
  }

  getElement(): object {
    return this.resultList.filter((x) => x.termCode.code === this.istvorhanden[1])
  }

  buildCriterion(element: object): Criterion {
    const criterionTemp = this.translator.translate(element)

    criterionTemp.valueFilters?.forEach((filter) => {
      if (filter.type === 'concept') {
        filter.valueDefinition.selectableConcepts.forEach((selectedConcept) => {
          filter.selectedConcepts.push(selectedConcept)
        })
      }
      if (filter.type === 'quantity-range') {
        filter.comparator = 'gt'
        filter.value = 1
        filter.type = 'quantity-comparator'
      }
    })
    return criterionTemp
  }

  buildQuery(): Query {
    const queryTemp = QueryProviderService.createDefaultQuery()
    queryTemp.groups[0].inclusionCriteria.push([this.criterion])
    return queryTemp
  }

  postQuery(modus: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'codex/json',
        Accept: 'internal/json',
        'Access-Control-Allow-Origin': '*',
      }),
    }
    let url: string
    if (modus === 'translate') {
      url = 'http://localhost:5000/query-translate'
    }
    if (modus === 'sync') {
      url = 'http://localhost:5000/query-sync'
    }

    return this.http.post(url, this.translatedQuery, httpOptions)
  }

  startRequestingResult(resultUrl: string): void {
    this.resultUrl = resultUrl

    this.resultObservable$ = interval(this.POLLING_INTERVALL_MILLISECONDS).pipe(
      takeUntil(timer(this.POLLING_MAXL_MILLISECONDS)),
      map(() => this.backend.getResult(this.resultUrl)),
      share(),
      switchAll()
    )
    this.subscriptionPolling = this.resultObservable$.subscribe(
      (result) => {
        this.result = result
        console.log(result)
      },
      (error) => {
        console.error(error)
      },
      () => {
        console.log('done')
        //  this.resultUrl = ''
        this.showSpinningIcon = false
      }
    )
  }

  doSend(): void {
    this.resultUrl = ''
    this.result = undefined
    this.showSpinningIcon = true
    this.subscriptionResult?.unsubscribe()
    this.subscriptionResult = this.backend
      .postQuery(this.query)
      .subscribe((response) => this.startRequestingResult(response.location))
  }
}
