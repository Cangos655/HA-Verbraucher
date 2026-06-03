export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  formatEntityState: (entity: HassEntity) => string;
}

export interface VerbraucherEntry {
  entity: string;
  energy_entity: string;
  name?: string;
  icon?: string;
}

export interface VerbraucherCardConfig {
  type: string;
  title?: string;
  entities: VerbraucherEntry[];
}
