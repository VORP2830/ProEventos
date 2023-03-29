import { Evento } from "./Evento";

export interface Lote {
  id: number;
  nome: string;
  preco: number;
  dateInicio?: Date;
  dateFim?: Date;
  quantidade: number;
  eventoId: number;
  evento: Evento[];
}
