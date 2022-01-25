import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { QueryResult, QueryResultSB } from '../../../../model/api/result/QueryResult'
import { Observable, Subscription } from 'rxjs'
import { BackendService } from '../../../../service/backend.service'

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
    public backend: BackendService
  ) {
    this.resultSubscription = this.data.resultObservable$.subscribe((resultTemp) =>
      this.sortResult(resultTemp)
    )
  }

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
