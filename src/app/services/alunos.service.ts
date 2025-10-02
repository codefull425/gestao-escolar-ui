import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlunoRequest, AlunoResponse } from '../types/api.models';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AlunosService {
  private readonly http = inject(HttpClient);

  list(): Observable<AlunoResponse[]> {
    return this.http.get<AlunoResponse[]>(`${API_BASE}/alunos`);
  }

  get(id: string): Observable<AlunoResponse> {
    return this.http.get<AlunoResponse>(`${API_BASE}/alunos/${id}`);
  }

  create(payload: AlunoRequest): Observable<AlunoResponse> {
    return this.http.post<AlunoResponse>(`${API_BASE}/alunos`, payload);
  }

  update(id: string, payload: AlunoRequest): Observable<AlunoResponse> {
    return this.http.put<AlunoResponse>(`${API_BASE}/alunos/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/alunos/${id}`);
  }
}


