import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { PermissionsComponent } from './pages/permissions/permissions.component';
import { RolesComponent } from './pages/roles/roles.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full' 
    }, // Redirige la ruta raíz a /login
    {   
        path: 'login', 
        component: AuthComponent 
    },
    {
        path:'home',
        component:HomeComponent,
        canActivate:[AuthGuard],
        children:[
            {
                path:'dashboard',
                component:DashboardComponent
            },
            {
                path:'users',
                component:UsersComponent
            },
            {
                path:'permissions',
                component:PermissionsComponent
            },
            {
                path:'roles',
                component:RolesComponent
            },
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full'
                
            }
        ]
    }

];
