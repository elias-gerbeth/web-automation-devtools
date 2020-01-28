import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { TabsComponent } from './pages/tabs/tabs.component';

export const AppRoutes: Routes = [
    {
        path: 'requests',
        component: RequestsComponent,
    },
    {
        path: 'tabs',
        component: TabsComponent,
    },
    {
        path: 'welcome',
        component: WelcomeComponent,
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tabs'
    }
];