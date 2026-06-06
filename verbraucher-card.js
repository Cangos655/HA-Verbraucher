const VERSION = "0.13.0";

const loadEntityPicker = async () => {
  if (customElements.get("ha-entity-picker")) return;
  if (!window.loadCardHelpers) return;
  const helpers = await window.loadCardHelpers();
  const card = await helpers.createCardElement({ type: "entities", entities: [] });
  await card.constructor.getConfigElement();
};

// ---------------------------------------------------------------------------
// Main Card
// ---------------------------------------------------------------------------

class VerbraucherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._energyMap = {};   // entity_id → kWh today
    this._lastEnergyLoad = 0;
  }

  static getConfigElement() {
    return document.createElement("verbraucher-card-editor");
  }

  static getStubConfig() {
    return { type: "custom:verbraucher-card", title: "Verbraucher", entities: [] };
  }

  getCardSize() {
    return 2 + (this._config?.entities?.length ?? 0);
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("verbraucher-card: 'entities' muss eine Liste sein");
    }
    this._config = config;
    this._energyMap = {};
    this._lastEnergyLoad = 0;
    this._build();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    this._update();
    // Reload energy history every 5 minutes
    const now = Date.now();
    if (now - this._lastEnergyLoad > 5 * 60 * 1000) {
      this._lastEnergyLoad = now;
      this._loadEnergy();
    }
  }

  _power(entry) {
    const v = parseFloat(this._hass?.states[entry.entity]?.state ?? "");
    return isNaN(v) ? 0 : v;
  }

  // Integrate W history → kWh
  _integrate(states) {
    if (!states || states.length === 0) return 0;
    let kwh = 0;
    for (let i = 1; i < states.length; i++) {
      const w = parseFloat(states[i - 1].state);
      if (isNaN(w) || w < 0) continue;
      const dt = (new Date(states[i].last_changed) - new Date(states[i - 1].last_changed)) / 3_600_000;
      kwh += (w * dt) / 1000;
    }
    // Current open interval (last state → now)
    const last = states[states.length - 1];
    const lastW = parseFloat(last.state);
    if (!isNaN(lastW) && lastW >= 0) {
      const dt = (Date.now() - new Date(last.last_changed)) / 3_600_000;
      kwh += (lastW * dt) / 1000;
    }
    return kwh;
  }

  async _loadEnergy() {
    if (!this._config || !this._hass) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.toISOString();

    for (const entry of this._config.entities) {
      if (!entry.entity) continue;
      try {
        const data = await this._hass.callApi(
          "GET",
          `history/period/${start}?filter_entity_id=${entry.entity}&minimal_response=true&no_attributes=true`
        );
        this._energyMap[entry.entity] = this._integrate(data?.[0] ?? []);
      } catch (_) {
        this._energyMap[entry.entity] = 0;
      }
    }
    this._renderEnergy();
  }

  _renderEnergy() {
    const entries = this._config?.entities ?? [];
    const total = entries.reduce((s, e) => s + (this._energyMap[e.entity] ?? 0), 0);

    const totalEl = this.shadowRoot.getElementById("total-num");
    if (totalEl) {
      totalEl.textContent = total.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Find top 3 indices by kWh
    const ranked = entries
      .map((entry, i) => ({ i, kwh: this._energyMap[entry.entity] ?? 0 }))
      .filter(x => x.kwh > 0)
      .sort((a, b) => b.kwh - a.kwh)
      .slice(0, 3)
      .map((x, rank) => ({ i: x.i, rank: rank + 1 }));

    const rankMap = Object.fromEntries(ranked.map(x => [x.i, x.rank]));

    entries.forEach((entry, i) => {
      const el = this.shadowRoot.getElementById(`energy-${i}`);
      if (el) {
        const kwh = this._energyMap[entry.entity] ?? 0;
        el.textContent = kwh.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }

      const row = this.shadowRoot.getElementById(`row-${i}`);
      if (row) {
        row.classList.remove("rank-1", "rank-2", "rank-3");
        if (rankMap[i]) row.classList.add(`rank-${rankMap[i]}`);
      }
    });
  }

  _moreInfo(entityId) {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    }));
  }

  _build() {
    const entries = this._config?.entities ?? [];
    const title   = this._config?.title ?? "Verbraucher";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { overflow: hidden; }

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
        }
        .stats-row { display: flex; align-items: flex-end; gap: 24px; }
        .stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-label { font-size: 11px; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .5px; }
        .stat-value { display: flex; align-items: flex-end; gap: 4px; }
        .stat-num { font-size: 28px; font-weight: 700; color: #fff; line-height: 1; }
        .stat-unit { font-size: 13px; color: rgba(255,255,255,.6); margin-bottom: 3px; }

        .body { padding: 4px 0; }

        .row {
          padding: 10px 20px;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.1));
          cursor: pointer;
          transition: background .15s;
        }
        .row:last-child { border-bottom: none; }
        .row:hover { background: rgba(0,0,0,.03); }
        .row.rank-1 { background: rgba(255,152,0,.13); border-left: 3px solid rgba(255,152,0,.8); }
        .row.rank-2 { background: rgba(255,152,0,.07); border-left: 3px solid rgba(255,152,0,.45); }
        .row.rank-3 { background: rgba(255,152,0,.03); border-left: 3px solid rgba(255,152,0,.2); }
        .row.rank-1:hover { background: rgba(255,152,0,.18); }
        .row.rank-2:hover { background: rgba(255,152,0,.11); }
        .row.rank-3:hover { background: rgba(255,152,0,.07); }

        .row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .row-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .icon { --mdc-icon-size: 18px; color: var(--primary-color, #1e88e5); flex-shrink: 0; }
        .name {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .row-right { display: flex; gap: 14px; flex-shrink: 0; }
        .val-block { text-align: right; }
        .val { font-size: 13px; font-weight: 600; color: var(--secondary-text-color); }
        .val.active { color: var(--primary-color, #1e88e5); }
        .unit { font-size: 10px; color: var(--secondary-text-color); margin-left: 2px; opacity: .7; }

        .bar-track {
          height: 3px;
          background: var(--divider-color, rgba(0,0,0,.08));
          border-radius: 2px;
          overflow: hidden;
        }
        .bar-fill { height: 100%; border-radius: 2px; transition: width .5s ease; }
        .bar-fill.high { background: linear-gradient(90deg, #1565c0, #03a9f4); }
        .bar-fill.mid  { background: linear-gradient(90deg, #1e88e5, #90caf9); }
        .bar-fill.low  { background: rgba(30,136,229,.25); }

        .empty { padding: 20px; text-align: center; color: var(--secondary-text-color); font-size: 13px; }

        .house-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 20px;
          background: rgba(0,0,0,.18);
          font-size: 12px;
          color: rgba(255,255,255,.75);
          letter-spacing: .3px;
        }
        .house-label { color: rgba(255,255,255,.5); text-transform: uppercase; font-size: 11px; letter-spacing: .5px; }
        .house-value { font-size: 15px; font-weight: 700; color: #fff; }
        .house-unit { font-size: 11px; color: rgba(255,255,255,.55); margin-left: 3px; }
      </style>

      <ha-card>
        <div class="header">
          <div class="header-top">
            <span class="title">${title}</span>
            <span class="version">v${VERSION}</span>
          </div>
          <div class="stats-row">
            <div class="stat">
              <span class="stat-label">Aktuell</span>
              <div class="stat-value">
                <span class="stat-num" id="current-w">–</span>
                <span class="stat-unit" id="current-unit">W</span>
              </div>
            </div>
            <div class="stat">
              <span class="stat-label">Heute</span>
              <div class="stat-value">
                <span class="stat-num" id="total-num">–</span>
                <span class="stat-unit">kWh</span>
              </div>
            </div>
          </div>
        </div>
        ${this._config?.house_entity ? `
          <div class="house-bar">
            <span class="house-label">Haus gesamt</span>
            <div>
              <span class="house-value" id="house-num">–</span>
              <span class="house-unit" id="house-unit">W</span>
            </div>
          </div>
        ` : ""}
        <div class="body">
          ${entries.length === 0
            ? '<div class="empty">Keine Verbraucher konfiguriert</div>'
            : entries.map((e, i) => `
                <div class="row" id="row-${i}" data-entity="${e.entity}">
                  <div class="row-top">
                    <div class="row-left">
                      <ha-icon class="icon" id="icon-${i}" icon="${e.icon ?? "mdi:lightning-bolt"}"></ha-icon>
                      <span class="name">${e.name ?? e.entity}</span>
                    </div>
                    <div class="row-right">
                      <div class="val-block">
                        <span class="val" id="power-${i}">–</span>
                        <span class="unit">W</span>
                      </div>
                      <div class="val-block">
                        <span class="val" id="energy-${i}">–</span>
                        <span class="unit">kWh</span>
                      </div>
                    </div>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill low" id="bar-${i}" style="width:0%"></div>
                  </div>
                </div>
              `).join("")
          }
        </div>
      </ha-card>
    `;

    // Click → More-info (event delegation on body)
    this.shadowRoot.querySelector(".body").addEventListener("click", ev => {
      const row = ev.target.closest(".row[data-entity]");
      if (row) this._moreInfo(row.dataset.entity);
    });
  }

  _update() {
    if (!this._config || !this._hass) return;

    const entries   = this._config.entities ?? [];
    const powers    = entries.map(e => this._power(e));
    const maxPower  = Math.max(...powers, 1);
    const totalW    = powers.reduce((s, p) => s + p, 0);

    // Header: current total W or kW
    const currentEl   = this.shadowRoot.getElementById("current-w");
    const currentUnit = this.shadowRoot.getElementById("current-unit");
    if (currentEl && currentUnit) {
      if (totalW >= 1000) {
        currentEl.textContent   = (totalW / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
        currentUnit.textContent = "kW";
      } else {
        currentEl.textContent   = totalW.toLocaleString("de-DE", { maximumFractionDigits: 0 });
        currentUnit.textContent = "W";
      }
    }

    // Update values for each row
    entries.forEach((entry, i) => {
      const power  = powers[i];
      const pct    = Math.round((power / maxPower) * 100);
      const active = power > 0;

      const row = this.shadowRoot.getElementById(`row-${i}`);
      if (row) {
        // Preserve rank-* classes set by _renderEnergy, only toggle active W styling
        row.classList.remove("active");
      }

      const powerEl = this.shadowRoot.getElementById(`power-${i}`);
      if (powerEl) {
        powerEl.textContent = power.toLocaleString("de-DE", { maximumFractionDigits: 0 });
        powerEl.className   = "val" + (active ? " active" : "");
      }

      const bar = this.shadowRoot.getElementById(`bar-${i}`);
      if (bar) {
        bar.style.width = pct + "%";
        bar.className   = "bar-fill " + (pct > 50 ? "high" : pct > 15 ? "mid" : "low");
      }

      const iconEl = this.shadowRoot.getElementById(`icon-${i}`);
      if (iconEl) {
        const stateIcon = this._hass.states[entry.entity]?.attributes?.icon;
        iconEl.setAttribute("icon", entry.icon ?? stateIcon ?? "mdi:lightning-bolt");
      }
    });

    // House total sensor
    const houseEntity = this._config?.house_entity;
    if (houseEntity) {
      const state = this._hass.states[houseEntity];
      const raw = parseFloat(state?.state ?? "");
      const houseNum  = this.shadowRoot.getElementById("house-num");
      const houseUnit = this.shadowRoot.getElementById("house-unit");
      if (houseNum && houseUnit) {
        if (!isNaN(raw)) {
          const unit = state?.attributes?.unit_of_measurement ?? "W";
          if (unit === "W" && raw >= 1000) {
            houseNum.textContent  = (raw / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
            houseUnit.textContent = "kW";
          } else {
            houseNum.textContent  = raw.toLocaleString("de-DE", { maximumFractionDigits: unit === "kW" ? 2 : 0 });
            houseUnit.textContent = unit;
          }
        } else {
          houseNum.textContent  = "–";
          houseUnit.textContent = "W";
        }
      }
    }

    // Sort rows by current power descending (moves existing DOM nodes, no rebuild)
    const body = this.shadowRoot.querySelector(".body");
    if (body) {
      const sorted = entries.map((_, i) => i).sort((a, b) => powers[b] - powers[a]);
      sorted.forEach(i => {
        const row = this.shadowRoot.getElementById(`row-${i}`);
        if (row) body.appendChild(row);
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

class VerbraucherCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._rendered = false;
  }

  async setConfig(config) {
    const prevLen = (this._config?.entities ?? []).length;
    const newLen  = (config.entities ?? []).length;
    this._config = { ...config };
    if (!this._rendered) {
      await loadEntityPicker();
      this._render();
      this._rendered = true;
    } else if (newLen !== prevLen) {
      this._render();
    }
  }

  set hass(hass) {
    this._hass = hass;
    this.shadowRoot.querySelectorAll("ha-entity-picker").forEach(el => {
      el.hass = hass;
    });
  }



  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: this._config },
    }));
  }

  _render() {
    const c = this._config;
    const entries = c.entities ?? [];

    this.shadowRoot.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        .editor { display: flex; flex-direction: column; gap: 14px; padding: 4px 0; }
        ha-entity-picker, ha-icon-picker { display: block; width: 100%; }
        .field { display: flex; flex-direction: column; gap: 4px; }
        .field label { font-size: 12px; color: var(--secondary-text-color, #888); font-weight: 500; }
        .field input {
          width: 100%;
          padding: 8px 0 6px;
          border: none;
          border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.2));
          background: transparent;
          color: var(--primary-text-color, #333);
          font-size: 14px;
          font-family: inherit;
          outline: none;
        }
        .field input:focus { border-bottom: 2px solid var(--primary-color, #1e88e5); }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          font-size: 14px;
          margin-top: 4px;
          color: var(--primary-text-color);
        }
        .entry {
          border: 1px solid var(--divider-color, rgba(0,0,0,.12));
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .entry-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .entry-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--secondary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>

      <div class="editor">
        <div class="field">
          <label>Titel</label>
          <input type="text" id="title" placeholder="Verbraucher" />
        </div>

        <ha-entity-picker id="house-entity" label="Haus-Gesamtverbrauch (optional)"></ha-entity-picker>

        <div class="section-header">
          <span>Verbraucher</span>
          <mwc-button id="add-btn">+ Hinzufügen</mwc-button>
        </div>

        ${entries.map((e, i) => `
          <div class="entry" data-index="${i}">
            <div class="entry-header">
              <span class="entry-label">${e.name ? e.name : "Eintrag " + (i + 1)}</span>
              <ha-icon-button data-remove="${i}">
                <ha-icon icon="mdi:delete"></ha-icon>
              </ha-icon-button>
            </div>
            <div class="field">
              <label>Name</label>
              <input type="text" id="name-${i}" placeholder="z.B. Waschmaschine" />
            </div>
            <ha-entity-picker id="entity-${i}" label="Leistungs-Sensor (W)"></ha-entity-picker>
            <ha-icon-picker id="icon-${i}" label="Icon (optional)"></ha-icon-picker>
          </div>
        `).join("")}
      </div>
    `;

    // Title
    const titleEl = this.shadowRoot.getElementById("title");
    titleEl.value = c.title ?? "";
    titleEl.addEventListener("input", ev => {
      this._config = { ...this._config, title: ev.target.value || undefined };
      this._fire();
    });

    // House entity picker
    const housePicker = this.shadowRoot.getElementById("house-entity");
    if (housePicker) {
      if (this._hass) housePicker.hass = this._hass;
      housePicker.value = c.house_entity ?? "";
      housePicker.includeDomains = ["sensor"];
      housePicker.entityFilter = (s) => ["W", "kW"].includes(s.attributes.unit_of_measurement ?? "");
      housePicker.addEventListener("value-changed", ev => {
        this._config = { ...this._config, house_entity: ev.detail.value || undefined };
        this._fire();
      });
    }

    // Add
    this.shadowRoot.getElementById("add-btn").addEventListener("click", () => {
      const entities = [...(this._config.entities ?? [])];
      entities.push({ entity: "", name: "" });
      this._config = { ...this._config, entities };
      this._fire();
      this._render();
    });

    // Delete
    this.shadowRoot.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", ev => {
        const idx = parseInt(ev.currentTarget.dataset.remove);
        const entities = [...(this._config.entities ?? [])];
        entities.splice(idx, 1);
        this._config = { ...this._config, entities };
        this._fire();
        this._render();
      });
    });

    // Per-entry fields
    entries.forEach((e, i) => {
      const nf = this.shadowRoot.getElementById(`name-${i}`);
      if (nf) {
        nf.value = e.name ?? "";
        nf.addEventListener("input", ev => {
          const ents = [...this._config.entities];
          ents[i] = { ...ents[i], name: ev.target.value || undefined };
          this._config = { ...this._config, entities: ents };
          this._fire();
        });
      }

      const ep = this.shadowRoot.getElementById(`entity-${i}`);
      if (ep) {
        if (this._hass) ep.hass = this._hass;
        ep.value = e.entity ?? "";
        ep.includeDomains = ["sensor"];
        ep.entityFilter = (s) => ["W", "kW"].includes(s.attributes.unit_of_measurement ?? "");
        ep.addEventListener("value-changed", ev => {
          const ents = [...this._config.entities];
          ents[i] = { ...ents[i], entity: ev.detail.value };
          this._config = { ...this._config, entities: ents };
          this._fire();
        });
      }

      const ip = this.shadowRoot.getElementById(`icon-${i}`);
      if (ip) {
        ip.value = e.icon ?? "";
        ip.addEventListener("value-changed", ev => {
          const ents = [...this._config.entities];
          ents[i] = { ...ents[i], icon: ev.detail.value || undefined };
          this._config = { ...this._config, entities: ents };
          this._fire();
        });
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

customElements.define("verbraucher-card", VerbraucherCard);
customElements.define("verbraucher-card-editor", VerbraucherCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "verbraucher-card",
  name: "Verbraucher Card",
  description: "Zeigt Stromverbraucher mit aktuellem Verbrauch (W) und Tagesenergie (kWh)",
  preview: false,
});

console.info(
  `%c VERBRAUCHER-CARD %c v${VERSION} `,
  "background:#1e88e5;color:#fff;font-weight:700;padding:2px 4px;border-radius:3px 0 0 3px",
  "background:#1565c0;color:#fff;padding:2px 4px;border-radius:0 3px 3px 0"
);
