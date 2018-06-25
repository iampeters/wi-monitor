import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'quiz', component: QuizComponent },
  { path: 'instructions', component: InstructionsComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: '**', component: ErrorPageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [QuizComponent, InstructionsComponent, WelcomeComponent, ErrorPageComponent ];
