import { Component, Input, OnInit } from '@angular/core'
import { TimeRestriction, TimeRestrictionType } from '../../../../model/api/query/timerestriction'
// @ts-ignore
import moment from 'moment'
import { ValueFilter } from '../../../../model/api/query/valueFilter'

@Component({
  selector: 'num-display-time-restriction',
  templateUrl: './display-time-restriction.component.html',
  styleUrls: ['./display-time-restriction.component.scss'],
})
export class DisplayTimeRestrictionComponent implements OnInit {
  @Input()
  timeRestriction: TimeRestriction

  @Input()
  modus: string

  @Input()
  filter: ValueFilter

  readonly typeLatest = TimeRestrictionType.BETWEEN
  timeRestrictionType: typeof TimeRestrictionType = TimeRestrictionType

  constructor() {}

  ngOnInit(): void {}

  getDateFormatted(date: Date): string {
    return date ? moment(date).format('DD.MM.YYYY') : ''
  }
}
