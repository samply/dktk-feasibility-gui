import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TestsComponent } from './components/testpage/tests.component'

const routes: Routes = [{ path: '', component: TestsComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestsRoutingModule {}
