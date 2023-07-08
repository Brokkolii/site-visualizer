import { Building } from './building.model';

export interface Site {
  id: string;
  name: string;
  widthX: number;
  widthZ: number;
  buildings: Building[];
}
