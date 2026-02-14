import { User } from './user.model';

export interface Provider extends User {
  company: string;
}
