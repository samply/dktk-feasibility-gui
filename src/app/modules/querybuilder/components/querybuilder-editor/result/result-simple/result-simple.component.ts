import { Component, Input, OnInit } from '@angular/core'
import { QueryResult, QueryResultSB } from '../../../../model/api/result/QueryResult'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import {
  ResultDetailsDialogComponentData,
  ResultDetailsDialogComponent,
} from '../result-details-dialog/result-details-dialog.component'
import { Observable } from 'rxjs'
import { BackendService } from '../../../../service/backend.service'

@Component({
  selector: 'num-result-simple',
  templateUrl: './result-simple.component.html',
  styleUrls: ['./result-simple.component.scss'],
})
export class ResultSimpleComponent implements OnInit {
  @Input()
  resultObservable: Observable<QueryResultSB>

  @Input()
  result: QueryResultSB

  @Input()
  showSpinner: boolean

  constructor(public dialog: MatDialog, public backend: BackendService) {}

  ngOnInit(): void {}

  openDialogResultDetails(): void {
    const dialogConfig = new MatDialogConfig<ResultDetailsDialogComponentData>()

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.data = {
      resultObservable$: this.resultObservable,
    }
    this.dialog.open(ResultDetailsDialogComponent, dialogConfig)
  }
}
