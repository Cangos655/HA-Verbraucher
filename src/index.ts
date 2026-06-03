import { VERSION } from './verbraucher-card.js';
import './verbraucher-card.js';
import './verbraucher-card-editor.js';

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'verbraucher-card',
  name: 'Verbraucher Card',
  description: 'Zeigt Stromverbraucher mit aktuellem Verbrauch (W) und Tagesenergie (kWh)',
  preview: false,
  documentationURL: 'https://github.com/Cangos655/HA-Verbraucher',
});

console.info(`%c VERBRAUCHER-CARD %c v${VERSION} `, 'background:#1e88e5;color:#fff;font-weight:700;padding:2px 4px;border-radius:3px 0 0 3px', 'background:#1565c0;color:#fff;font-weight:400;padding:2px 4px;border-radius:0 3px 3px 0');
