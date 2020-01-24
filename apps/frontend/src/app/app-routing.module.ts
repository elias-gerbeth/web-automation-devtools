import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
    { path: 'dashboard', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'settings', component: SettingsComponent },
    { path: 'testing', loadChildren: () => import('./pages/testing/testing.module').then(m => m.TestingModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
