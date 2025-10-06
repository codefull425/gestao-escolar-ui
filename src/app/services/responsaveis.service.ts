import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlunoResponse, ResponsavelRequest, ResponsavelResponse } from '../types/api.models';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ResponsaveisService {
  private readonly http = inject(HttpClient);

  list(): Observable<ResponsavelResponse[]> {
    return this.http.get<ResponsavelResponse[]>(`${API_BASE}/responsaveis`);
  }

  listWithAlunos(id: string): Observable<AlunoResponse[]> {
    return this.http.get<AlunoResponse[]>(`${API_BASE}/responsaveis/${id}/alunos`);
  }

  get(id: string): Observable<ResponsavelResponse> {
    return this.http.get<ResponsavelResponse>(`${API_BASE}/responsaveis/${id}`);
  }

  create(payload: ResponsavelRequest): Observable<ResponsavelResponse> {
    return this.http.post<ResponsavelResponse>(`${API_BASE}/responsaveis`, payload);
  }

  update(id: string, payload: ResponsavelRequest): Observable<ResponsavelResponse> {
    return this.http.put<ResponsavelResponse>(`${API_BASE}/responsaveis/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/responsaveis/${id}`);
  }
}


