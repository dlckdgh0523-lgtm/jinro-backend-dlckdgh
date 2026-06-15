// 커리어넷 두 계열(JSON/EUC-KR XML)을 흡수한 단일 내부 타입

export interface NormalizedJob {
  seq: number;
  name: string;
  summary: string | null;
  aptitude: string | null;
  salary: string | null;
  prospect: string | null;
  relatedMajors: string[];
  theme: string | null;
  raw: Record<string, unknown>;
}

export interface NormalizedJuniorJob {
  seq: number;
  name: string;
  field: string | null;
  summary: string | null;
  raw: Record<string, unknown>;
}

export interface NormalizedMajor {
  majorSeq: number;
  name: string;
  field: string | null;
  summary: string | null;
  departments: string[];
  raw: Record<string, unknown>;
}

export interface NormalizedSchool {
  seq: string;
  name: string;
  region: string | null;
  gubun: string | null;
  estType: string | null;
  link: string | null;
  raw: Record<string, unknown>;
}

export interface NormalizedCounselCase {
  seq: number;
  title: string;
  question: string | null;
  answer: string | null;
  raw: Record<string, unknown>;
}

export interface NormalizedEduMaterial {
  seq: number;
  title: string;
  summary: string | null;
  attFiles: string[];
  raw: Record<string, unknown>;
}

export interface NormalizedTest {
  no: number;
  name: string;
  target: string | null;
}

export interface NormalizedPage<T> {
  items: T[];
  total: number | null;
}
