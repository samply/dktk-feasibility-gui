import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TestsRoutingModule } from './tests-routing.module'
import { TestsComponent } from './components/testpage/tests.component'
import { MaterialModule } from '../../layout/material/material.module'
import { SingleTestComponent } from './components/single-test/single-test.component'
import { LayoutModule } from '../../layout/layout.module'
import { SharedModule } from '../../shared/shared.module'

@NgModule({
  declarations: [TestsComponent, SingleTestComponent],
  imports: [CommonModule, TestsRoutingModule, MaterialModule, LayoutModule, SharedModule],
})
export class TestsModule {}
