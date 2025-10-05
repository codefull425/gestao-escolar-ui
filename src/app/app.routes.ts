import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  {
    path: 'alunos',
    loadComponent: () => import('./features/alunos/alunos-list.component').then(m => m.AlunosListComponent)
  },
  {
    path: 'alunos/novo',
    loadComponent: () => import('./features/alunos').then(m => m.AlunoFormComponent)
  },
  {
    path: 'alunos/:id',
    loadComponent: () => import('./features/alunos').then(m => m.AlunoFormComponent)
  },
  {
    path: 'responsaveis',
    loadComponent: () => import('./features/responsaveis/responsaveis-list.component').then(m => m.ResponsaveisListComponent)
  },
  {
    path: 'responsaveis/novo',
    loadComponent: () => import('./features/responsaveis/responsavel-form.component').then(m => m.ResponsavelFormComponent)
  },
  {
    path: 'responsaveis/:id',
    loadComponent: () => import('./features/responsaveis/responsavel-form.component').then(m => m.ResponsavelFormComponent)
  },
  { path: '**', redirectTo: '' }
];


