import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'sacpi', pathMatch: 'full' },
  { path: 'sacpi', loadChildren: 'app/building-lot/ui/ui.module#SacpiUIModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules,
        useHash: true
      },

    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
