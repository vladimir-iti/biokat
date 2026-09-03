export type ServiceSlug =
  | 'power-supply'
  | 'lighting'
  | 'fire-safety'
  | 'low-current'
  | 'automation'
  | 'switchboards'
  | 'high-voltage';

export interface Service {
  slug: ServiceSlug;
  title: string;
  /** Родительный падеж для фраз вида «объекты по направлению …» */
  genitive: string;
  label: string;
  short: string;
  lead: string;
  includes: string[];
  tasks: string[];
  strengths: { title: string; text: string }[];
  seo: { title: string; description: string };
}

export type ProjectType =
  | 'infrastructure'
  | 'industry'
  | 'residential'
  | 'retail'
  | 'social';

export interface ProjectFact {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  address: string;
  region: string;
  type: ProjectType;
  years: string;
  client?: string;
  services: ServiceSlug[];
  /** Номера строк в реестре договоров */
  contracts?: number[];
  facts: ProjectFact[];
  works: string[];
  /** «Задача и решение» — только там, где есть реальная фабула */
  story?: string[];
  featured?: boolean;
}

export type ContractStatus = 'done' | 'active';

export interface Contract {
  id: number;
  signed: string;
  finished: string;
  client: string;
  description: string;
  /** тыс. руб. */
  amount: number;
  status: ContractStatus;
  services: ServiceSlug[];
  project?: string;
}

export type DocumentKind = 'license' | 'sro' | 'certificate' | 'sample';

export interface DocumentItem {
  id: string;
  kind: DocumentKind;
  title: string;
  summary: string;
  meta: { label: string; value: string }[];
  /** Пометка о временном статусе документа */
  note?: string;
  file?: string;
  preview?: string;
}
