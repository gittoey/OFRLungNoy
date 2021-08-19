import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { DurianMasterDataComponent } from './pages/durian-master-data/durian-master-data.component';
import { VarietiesComponent } from './pages/durian-master-data/varieties/varieties.component';
import { GradeComponent } from './pages/durian-master-data/grade/grade.component';
import { PriceComponent } from './pages/durian-master-data/price/price.component';
import { MeatComponent } from './pages/durian-master-data/meat/meat.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DurianMasterDataComponent,
    VarietiesComponent,
    GradeComponent,
    PriceComponent,
    MeatComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

