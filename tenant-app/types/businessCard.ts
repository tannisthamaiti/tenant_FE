// types/businessCard.ts
export interface ICardData {
  name: string | null;
  job_title: string | null;
  company: string | null;
  email: string | null;
  phone: string | string[] | null;
  website: string | null;
  address: string | null;
}

export interface IApiResponse {
  status: string;
  data: ICardData;
}