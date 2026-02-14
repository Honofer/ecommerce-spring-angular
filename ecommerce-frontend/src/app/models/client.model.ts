import { User } from './user.model';

export interface Client extends User {
  localization: string;
}
