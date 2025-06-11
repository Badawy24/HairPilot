import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceComponent } from './service/service.component';
import { GalleryComponent } from './gallery/gallery.component';
import { PriceComponent } from './price/price.component';
import { ContactComponent } from './contact/contact.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { BookingComponent } from './booking/booking.component';
import { FaceComponent } from './face/face.component';


export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:HomeComponent},
    {path:'about',component:AboutComponent},
    {path:'service',component:ServiceComponent},
    {path:'price',component:PriceComponent},
    {path:'gallery',component:GalleryComponent},
    {path:'contact',component:ContactComponent},
    {path:'face',component:FaceComponent},
      { path: 'booking', component: BookingComponent },

    {path:'**',component:NotfoundComponent},

];
