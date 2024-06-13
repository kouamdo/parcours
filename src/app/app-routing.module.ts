import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { ModulesRoutingModule } from './modules/modules-routing.module';
import { RequestPasswordResetComponent } from './request-password-reset/request-password-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'requestPassword', component: RequestPasswordResetComponent},
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'parcours', loadChildren: () => import('./modules/modules.module').then((m) => m.ModulesModule), canActivate: [AuthGuard] }, // Protège la route principale avec AuthGuard
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ModulesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
