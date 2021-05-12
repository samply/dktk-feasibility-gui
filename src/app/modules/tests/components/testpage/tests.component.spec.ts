import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TestsComponent } from './tests.component'
import { MaterialModule } from '../../../../layout/material/material.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SingleTestComponent } from '../single-test/single-test.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { TranslateModule } from '@ngx-translate/core'
import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FeatureService } from '../../../../service/feature.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

describe('TestsComponent', () => {
  let component: TestsComponent
  let fixture: ComponentFixture<TestsComponent>
  const featureService = {
    getPollingTime(): number {
      return 10
    },
    getPollingIntervall(): number {
      return 1
    },
  } as FeatureService
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsComponent, SingleTestComponent, ButtonComponent],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        FontAwesomeTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: FeatureService,
          useValue: featureService,
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
