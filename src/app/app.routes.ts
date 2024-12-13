import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path:'',redirectTo:'home',pathMatch:'full' },
    { path:'product',component:ProductComponent },
    { path:'usuario',component:UsuarioComponent },
    { path:'home', component:HomeComponent },
    { path:'**', redirectTo:'home' }
];