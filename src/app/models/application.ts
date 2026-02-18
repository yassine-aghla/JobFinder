export interface Application {
  id?: number;
  userId: number;
  offerId: string;
  apiSource: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: 'en_attente' | 'accepté' | 'refusé';
  notes?: string;
  dateAdded: string;
}
