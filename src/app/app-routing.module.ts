import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ControlComponent } from './control/control.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AddComponent } from './components/add/add.component';
import { AuthGuard } from './auth.guard';
import { ViewersComponent } from './components/viewers/viewers.component';
import { ViewerloginComponent } from './components/viewerlogin/viewerlogin.component';
import { GidComponent } from './components/gid/gid.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'quiz', component: QuizComponent },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'control', component: ControlComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add', component: AddComponent },
  { path: 'viewers', component: ViewersComponent },
  { path: 'viewerlogin', component: ViewerloginComponent },
  { path: 'gid', component: GidComponent },
  { path: '**', component: ErrorPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  QuizComponent,
  InstructionsComponent,
  WelcomeComponent,
  DashboardComponent,
  ErrorPageComponent,
  ControlComponent,
  RegisterComponent,
  LoginComponent,
  AddComponent,
  ViewersComponent,
  ViewerloginComponent,
  GidComponent
];
