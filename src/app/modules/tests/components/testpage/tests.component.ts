import { Component, OnDestroy, OnInit } from '@angular/core'
import { TestdatenInterface } from './Testdaten.interface'
import { TerminologyEntry } from '../../../querybuilder/model/api/terminology/terminology'
import { Subscription } from 'rxjs'
import { BackendService } from '../../../querybuilder/service/backend.service'
import { FormControl } from '@angular/forms'

declare var require: any

@Component({
  selector: 'num-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
})
export class TestsComponent implements OnInit, OnDestroy {
  Testdatei = require('../../Testdaten/1.json')
  selEntries = require('../../Testdaten/selectable-entries.json')

  Testdaten: any
  separatedTestdaten: Array<TestdatenInterface> = []

  resultList: Array<TerminologyEntry> = []
  private subscription: Subscription
  resourceList = new Array()
  resourceControl = new FormControl(['Condition'])
  ergebnis: [number, number, number] = [0, 0, 0]

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.Testdaten = this.Testdatei.entry
    this.resultList = this.selEntries

    this.separateTestdaten()

    console.log(this.resourceControl.value)
    console.log(this.separatedTestdaten)
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  separateTestdaten(): void {
    this.Testdaten.forEach((value) => {
      const index = this.separatedTestdaten.findIndex((x) => x.type === value.resource.resourceType)
      if (index !== -1) {
        this.separatedTestdaten[index].element.push(value)
      } else {
        this.separatedTestdaten.push({ type: value.resource.resourceType, element: [value] })
        this.resourceList.push(value.resource.resourceType)
      }
    })
  }

  public readTextData(): void {
    this.subscription = this.backend
      .getTerminolgyEntrySearchResult('', '')
      .subscribe((termEntryList) => {
        this.resultList = termEntryList
        this.separateTestdaten()
      })
  }

  count(count): void {
    if (count === '0') {
      this.ergebnis[1] = this.ergebnis[1] + 1
    }
    if (count === '1') {
      this.ergebnis[0] = this.ergebnis[0] + 1
    }
    if (count === 'notfound') {
      this.ergebnis[2] = this.ergebnis[2] + 1
    }
  }
  selectionChanged(): void {
    this.ergebnis = [0, 0, 0]
  }
}
