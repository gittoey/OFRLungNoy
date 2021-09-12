import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { DurianMasterDataComponent } from 'src/app/pages/durian-master-data/durian-master-data.component';
import { OdersComponent } from 'src/app/pages/oders/oders.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'app-durian-master-data',   component: DurianMasterDataComponent },
    { path: 'app-oders',   component: OdersComponent }
];
