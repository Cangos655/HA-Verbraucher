const VERSION = "0.3.0";

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
  }

  static getConfigElement() {
    return document.createElement("verbraucher-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:verbraucher-card",
      title: "Verbraucher",
      entities: [],
    };
  }

  getCardSize() {
    return 2 + (this._config?.entities?.length ?? 0);
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error("verbraucher-card: 'entities' muss eine Liste sein");
    }
    this._config = config;
    this._build();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config) this._update();
  }

  _power(entry) {
    const v = parseFloat(this._hass?.states[entry.entity]?.state ?? "");
    return isNaN(v) ? 0 : v;
  }

  _energy(entry) {
    const v = parseFloat(this._hass?.states[entry.energy_entity]?.state ?? "");
    return isNaN(v) ? 0 : v;
  }

  _build() {
    const entries = this._config?.entities ?? [];
    const title = this._config?.title ?? "Verbraucher";

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

        .body { padding: 4px 0; }

        .row {
          padding: 10px 20px;
          border-bottom: 1px solid rgba(30,136,229,.1);
          transition: background .2s;
        }
        .row:last-child { border-bottom: none; }
        .row.active { background: rgba(30,136,229,.08); }

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
        .val-block { text-align: right; }
        .val {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,.4);
        }
        .val.active { color: #90caf9; }
        .unit {
          font-size: 10px;
          color: rgba(255,255,255,.3);
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

        .empty {
          padding: 20px;
          text-align: center;
          color: var(--secondary-text-color);
          font-size: 13px;
        }
      </style>

      <ha-card>
        <div class="header">
          <div class="header-top">
            <span class="title">${title}</span>
            <span class="version">v${VERSION}</span>
          </div>
          <div class="total-row">
            <span class="total-num" id="total-num">–</span>
            <span class="total-unit" id="total-unit">${entries.some(e => e.energy_entity) ? "kWh heute" : "W gesamt"}</span>
          </div>
        </div>
        <div class="body">
          ${entries.length === 0
            ? '<div class="empty">Keine Verbraucher konfiguriert</div>'
            : entries.map((e, i) => `
                <div class="row" id="row-${i}">
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
                      ${e.energy_entity ? `
                      <div class="val-block">
                        <span class="val" id="energy-${i}">–</span>
                        <span class="unit">kWh</span>
                      </div>` : ""}
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
  }

  _update() {
    if (!this._config || !this._hass) return;

    const entries = this._config.entities ?? [];
    const powers = entries.map(e => this._power(e));
    const maxPower = Math.max(...powers, 1);
    const totalEnergy = entries.reduce((s, e) => s + this._energy(e), 0);

    const hasEnergy = entries.some(e => e.energy_entity);
    const totalEl = this.shadowRoot.getElementById("total-num");
    if (totalEl) {
      if (hasEnergy) {
        totalEl.textContent = totalEnergy.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
      } else {
        const totalPower = powers.reduce((s, p) => s + p, 0);
        totalEl.textContent = totalPower.toLocaleString("de-DE", { maximumFractionDigits: 0 });
      }
    }

    entries.forEach((entry, i) => {
      const power = powers[i];
      const energy = this._energy(entry);
      const pct = Math.round((power / maxPower) * 100);
      const active = power > 0;

      const row = this.shadowRoot.getElementById(`row-${i}`);
      if (row) row.className = "row" + (active ? " active" : "");

      const powerEl = this.shadowRoot.getElementById(`power-${i}`);
      if (powerEl) {
        powerEl.textContent = power.toLocaleString("de-DE", { maximumFractionDigits: 0 });
        powerEl.className = "val" + (active ? " active" : "");
      }

      const energyEl = this.shadowRoot.getElementById(`energy-${i}`);
      if (energyEl) {
        energyEl.textContent = energy.toLocaleString("de-DE", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        });
      }

      const bar = this.shadowRoot.getElementById(`bar-${i}`);
      if (bar) {
        bar.style.width = pct + "%";
        bar.className = "bar-fill " + (pct > 50 ? "high" : pct > 15 ? "mid" : "low");
      }

      const iconEl = this.shadowRoot.getElementById(`icon-${i}`);
      if (iconEl) {
        const stateIcon = this._hass.states[entry.entity]?.attributes?.icon;
        iconEl.setAttribute("icon", entry.icon ?? stateIcon ?? "mdi:lightning-bolt");
      }
    });
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
  }

  async setConfig(config) {
    this._config = { ...config };
    await loadEntityPicker();
    this._render();
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
        .editor { display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
        ha-textfield { display: block; width: 100%; }
        ha-entity-picker, ha-icon-picker { display: block; width: 100%; }
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
      </style>

      <div class="editor">
        <ha-textfield id="title" label="Titel (optional)" value="${c.title ?? ""}"></ha-textfield>

        <div class="section-header">
          <span>Verbraucher</span>
          <mwc-button id="add-btn">+ Hinzufügen</mwc-button>
        </div>

        ${entries.map((e, i) => `
          <div class="entry">
            <div class="entry-header">
              <span class="entry-label">Eintrag ${i + 1}</span>
              <ha-icon-button data-remove="${i}">
                <ha-icon icon="mdi:delete"></ha-icon>
              </ha-icon-button>
            </div>
            <ha-textfield id="name-${i}" label="Name *"></ha-textfield>
            <ha-entity-picker id="entity-${i}" label="Leistungs-Sensor (W)"></ha-entity-picker>
            <ha-icon-picker id="icon-${i}" label="Icon (optional)"></ha-icon-picker>
          </div>
        `).join("")}
      </div>
    `;

    // Title
    this.shadowRoot.getElementById("title").addEventListener("change", ev => {
      this._config = { ...this._config, title: ev.target.value || undefined };
      this._fire();
    });

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
