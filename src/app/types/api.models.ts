export interface ResponsavelResponse {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  ativo: boolean;
}

export interface ResponsavelRequest {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  ativo?: boolean;
  alunoIds?: string[];
}

export interface AlunoResponse {
  id: string;
  nome: string;
  matricula: string;
  dataNascimento?: string; // date (yyyy-MM-dd)
  ativo?: boolean;
  createdAt?: string; // date-time
  updatedAt?: string; // date-time
  responsaveis?: ResponsavelSummary[];
}

export interface AlunoRequest {
  nome: string;
  matricula: string;
  dataNascimento?: string; // yyyy-MM-dd
  ativo?: boolean;
  responsavelIds: string[];
}

export interface ResponsavelSummary {
  id: string;
  nome: string;
  cpf: string;
}


