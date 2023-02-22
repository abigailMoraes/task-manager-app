import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { MatButtonModule} from '@angular/material/button';
const routes: Routes = [
   {path:'user',component:UserComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
            MatButtonModule ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
