import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { DurianMasterDataComponent } from 'src/app/pages/durian-master-data/durian-master-data.component';
import { OrdersComponent } from 'src/app/pages/orders/orders.component';
import { PostFeedsComponent } from 'src/app/pages/post-feeds/post-feeds.component';
import { CheckOrderComponent } from 'src/app/pages/check-order/check-order.component'; 

export const AdminLayoutRoutes: Routes = [
    { path: 'shop',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'durian-master-data',   component: DurianMasterDataComponent },
    { path: 'orders',   component: OrdersComponent },
    { path: 'post-feeds',   component: PostFeedsComponent},
    { path: 'check-order',   component: CheckOrderComponent}
];
