import { Component, Input, OnInit } from '@angular/core'
import { TimeRestriction, TimeRestrictionType } from '../../../../model/api/query/timerestriction'
import { ValueFilter } from '../../../../model/api/query/valueFilter'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import { MAT_DATE_FORMATS } from '@angular/material/core'

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'num-edit-time-restriction',
  templateUrl: './edit-time-restriction.component.html',
  styleUrls: ['./edit-time-restriction.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class EditTimeRestrictionComponent implements OnInit {
  @Input()
  timeRestriction: TimeRestriction

  @Input()
  modus: string

  @Input()
  filter: ValueFilter

  timeRestrictionOptions = Object.keys(TimeRestrictionType)
  timeRestrictionType: typeof TimeRestrictionType = TimeRestrictionType

  dateType: TimeRestrictionType

  constructor() {}

  ngOnInit(): void {}

  testevent(type: string, event: MatDatepickerInputEvent<Date>): void {
    console.log(type)
    console.log(event.value)
  }
}
