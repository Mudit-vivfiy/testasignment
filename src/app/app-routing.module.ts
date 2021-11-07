import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormComponent } from './user-list/form/form.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'userList', pathMatch: 'full' },
  { path: 'userList', canActivate: [AuthGuard], component: UserListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', canActivate: [AuthGuard], component: SignupComponent },
  { path: 'form', canActivate: [AuthGuard], component: FormComponent },
  { path: 'form/:id', canActivate: [AuthGuard], component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
