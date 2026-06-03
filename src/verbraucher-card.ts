import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HomeAssistant, VerbraucherCardConfig, VerbraucherEntry } from './types.js';

export const VERSION = '0.1.0';

@customElement('verbraucher-card')
export class VerbraucherCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;

  private _config?: VerbraucherCardConfig;

  static getConfigElement(): HTMLElement {
    return document.createElement('verbraucher-card-editor');
  }

  static getStubConfig(): VerbraucherCardConfig {
    return { type: 'custom:verbraucher-card', title: 'Verbraucher', entities: [] };
  }

  setConfig(config: VerbraucherCardConfig): void {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('verbraucher-card: "entities" muss eine Liste sein');
    }
    this._config = config;
  }

  private _power(entry: VerbraucherEntry): number {
    const s = this.hass?.states[entry.entity];
    const v = parseFloat(s?.state ?? '');
    return isNaN(v) ? 0 : v;
  }

  private _energy(entry: VerbraucherEntry): number {
    const s = this.hass?.states[entry.energy_entity];
    const v = parseFloat(s?.state ?? '');
    return isNaN(v) ? 0 : v;
  }

  private get _totalEnergy(): number {
    if (!this._config) return 0;
    return this._config.entities.reduce((sum, e) => sum + this._energy(e), 0);
  }

  private get _maxPower(): number {
    if (!this._config) return 0;
    return Math.max(...this._config.entities.map(e => this._power(e)), 1);
  }

  private _barClass(pct: number): string {
    if (pct > 50) return 'high';
    if (pct > 15) return 'mid';
    return 'low';
  }

  private _renderRow(entry: VerbraucherEntry) {
    const power = this._power(entry);
    const energy = this._energy(entry);
    const pct = Math.round((power / this._maxPower) * 100);
    const active = power > 0;
    const icon = entry.icon ?? this.hass?.states[entry.entity]?.attributes?.icon as string ?? 'mdi:lightning-bolt';
    const name = entry.name ?? entry.entity;

    return html`
      <div class="row ${active ? 'active' : ''}">
        <div class="row-top">
          <div class="row-left">
            <ha-icon class="icon" .icon=${icon}></ha-icon>
            <span class="name">${name}</span>
          </div>
          <div class="row-right">
            <div class="val-block">
              <span class="val ${active ? 'active' : ''}">${power.toLocaleString('de-DE', { maximumFractionDigits: 0 })}</span>
              <span class="unit">W</span>
            </div>
            <div class="val-block">
              <span class="val">${energy.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
              <span class="unit">kWh</span>
            </div>
          </div>
        </div>
        <div class="bar-track">
          <div class="bar-fill ${this._barClass(pct)}" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this._config || !this.hass) return nothing;

    const title = this._config.title ?? 'Verbraucher';
    const total = this._totalEnergy;

    return html`
      <ha-card>
        <div class="header">
          <div class="header-top">
            <span class="title">${title}</span>
            <span class="version">v${VERSION}</span>
          </div>
          <div class="total-row">
            <span class="total-num">${total.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
            <span class="total-unit">kWh heute</span>
          </div>
        </div>
        <div class="body">
          ${this._config.entities.map(e => this._renderRow(e))}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color));
    }
    .header {
      padding: 16px 20px 14px;
      background: linear-gradient(135deg, #1e88e5, #1565c0);
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .title {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,.65);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .version {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,.45);
      background: rgba(255,255,255,.12);
      border-radius: 10px;
      padding: 2px 8px;
      letter-spacing: .3px;
    }
    .total-row {
      display: flex;
      align-items: flex-end;
      gap: 6px;
    }
    .total-num {
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }
    .total-unit {
      font-size: 14px;
      color: rgba(255,255,255,.6);
      margin-bottom: 3px;
    }
    .body {
      padding: 4px 0;
    }
    .row {
      padding: 10px 20px;
      border-bottom: 1px solid rgba(30,136,229,.1);
      transition: background .15s;
    }
    .row:last-child {
      border-bottom: none;
    }
    .row.active {
      background: rgba(30,136,229,.08);
    }
    .row-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .row-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .icon {
      --mdc-icon-size: 18px;
      color: #90caf9;
      flex-shrink: 0;
    }
    .name {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,.85);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row-right {
      display: flex;
      gap: 14px;
      flex-shrink: 0;
    }
    .val-block {
      text-align: right;
    }
    .val {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,.6);
    }
    .val.active {
      color: #90caf9;
    }
    .unit {
      font-size: 10px;
      color: rgba(255,255,255,.35);
      margin-left: 2px;
    }
    .bar-track {
      height: 3px;
      background: rgba(255,255,255,.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 2px;
      transition: width .5s ease;
    }
    .bar-fill.high { background: linear-gradient(90deg, #1565c0, #03a9f4); }
    .bar-fill.mid  { background: linear-gradient(90deg, #1e88e5, #90caf9); }
    .bar-fill.low  { background: rgba(30,136,229,.3); }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'verbraucher-card': VerbraucherCard;
  }
}
