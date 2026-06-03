import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, VerbraucherCardConfig, VerbraucherEntry } from './types.js';

@customElement('verbraucher-card-editor')
export class VerbraucherCardEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: VerbraucherCardConfig;

  setConfig(config: VerbraucherCardConfig): void {
    this._config = config;
  }

  private _fire(config: VerbraucherCardConfig): void {
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
  }

  private _titleChanged(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value;
    this._fire({ ...this._config!, title: val || undefined });
  }

  private _entityChanged(ev: CustomEvent, index: number, field: keyof VerbraucherEntry): void {
    const value = ev.detail.value as string;
    const entities = [...(this._config?.entities ?? [])];
    entities[index] = { ...entities[index], [field]: value };
    this._fire({ ...this._config!, entities });
  }

  private _nameChanged(ev: Event, index: number): void {
    const val = (ev.target as HTMLInputElement).value;
    const entities = [...(this._config?.entities ?? [])];
    entities[index] = { ...entities[index], name: val || undefined };
    this._fire({ ...this._config!, entities });
  }

  private _iconChanged(ev: CustomEvent, index: number): void {
    const value = ev.detail.value as string;
    const entities = [...(this._config?.entities ?? [])];
    entities[index] = { ...entities[index], icon: value || undefined };
    this._fire({ ...this._config!, entities });
  }

  private _addRow(): void {
    const entities = [...(this._config?.entities ?? [])];
    entities.push({ entity: '', energy_entity: '' });
    this._fire({ ...this._config!, entities });
  }

  private _removeRow(index: number): void {
    const entities = [...(this._config?.entities ?? [])];
    entities.splice(index, 1);
    this._fire({ ...this._config!, entities });
  }

  render() {
    if (!this._config) return nothing;

    return html`
      <div class="editor">
        <ha-textfield
          label="Titel (optional)"
          .value=${this._config.title ?? ''}
          @change=${this._titleChanged}
        ></ha-textfield>

        <div class="section-header">
          <span>Verbraucher</span>
          <mwc-button @click=${this._addRow}>+ Hinzufügen</mwc-button>
        </div>

        ${(this._config.entities ?? []).map((entry, i) => html`
          <div class="entry">
            <div class="entry-header">
              <span class="entry-label">Eintrag ${i + 1}</span>
              <ha-icon-button
                .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                @click=${() => this._removeRow(i)}
              ></ha-icon-button>
            </div>

            <ha-entity-picker
              label="Leistungs-Sensor (W) *"
              .hass=${this.hass}
              .value=${entry.entity}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${(ev: CustomEvent) => this._entityChanged(ev, i, 'entity')}
            ></ha-entity-picker>

            <ha-entity-picker
              label="Energie-Sensor (kWh) *"
              .hass=${this.hass}
              .value=${entry.energy_entity}
              .includeDomains=${['sensor']}
              allow-custom-entity
              @value-changed=${(ev: CustomEvent) => this._entityChanged(ev, i, 'energy_entity')}
            ></ha-entity-picker>

            <ha-textfield
              label="Name (optional)"
              .value=${entry.name ?? ''}
              @change=${(ev: Event) => this._nameChanged(ev, i)}
            ></ha-textfield>

            <ha-icon-picker
              label="Icon (optional)"
              .value=${entry.icon ?? ''}
              @value-changed=${(ev: CustomEvent) => this._iconChanged(ev, i)}
            ></ha-icon-picker>
          </div>
        `)}
      </div>
    `;
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 4px 0;
    }
    ha-textfield {
      display: block;
      width: 100%;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 14px;
      color: var(--primary-text-color);
      margin-top: 4px;
    }
    .entry {
      border: 1px solid var(--divider-color, rgba(0,0,0,.12));
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .entry-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    ha-entity-picker,
    ha-icon-picker {
      display: block;
      width: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'verbraucher-card-editor': VerbraucherCardEditor;
  }
}
