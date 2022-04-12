import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { QueryResult, QueryResultSB } from '../../../../model/api/result/QueryResult'
import { Observable, Subscription } from 'rxjs'
import { BackendService } from '../../../../service/backend.service'
import { FeatureService } from '../../../../../../service/feature.service'

export class ResultDetailsDialogComponentData {
  resultObservable$: Observable<QueryResultSB>
}

@Component({
  selector: 'num-result-details-dialog',
  templateUrl: './result-details-dialog.component.html',
  styleUrls: ['./result-details-dialog.component.scss'],
})
export class ResultDetailsDialogComponent implements OnInit {
  result: QueryResultSB
  resultSubscription: Subscription

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResultDetailsDialogComponentData,
    public dialogRef: MatDialogRef<ResultDetailsDialogComponent>,
    public backend: BackendService,
    private feature: FeatureService
  ) {
    this.resultSubscription = this.data.resultObservable$.subscribe((resultTemp) => {
      console.log(resultTemp)
      this.result = resultTemp
      let sum = 0
      this.result.replySites.forEach((site) => {
        // @ts-ignore
        sum += site.donor.count
      })
      this.result.totalNumberOfPatients = sum

      // this.sortResult(resultTemp)
    })
  }

  lowerBoundaryLocation: number = this.feature.getLocationResultLowerBoundary()

  ngOnInit(): void {}

  doClose(): void {
    this.resultSubscription?.unsubscribe()
    this.dialogRef.close()
  }

  sortResult(resultTemp): void {
    this.result = resultTemp
    // this.result.resultLines.sort((a, b) => b.numberOfPatients - a.numberOfPatients)
  }
}
