import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'scan',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../scan/scan.module').then(m => m.ScanPageModule)
          }
        ]
      },
      {
        path: 'rankings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../rankings/rankings.module').then(m => m.RankingsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'tabs/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
