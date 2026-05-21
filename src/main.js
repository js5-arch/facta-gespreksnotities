import "./style.css";

let actions = [];

document.querySelector("#app").innerHTML = `
  <div class="app">
    <h1>Facta Gespreksverslagen</h1>
    <p class="subtitle">Klantgesprek vastleggen, structureren en opvolgen</p>

    <div class="grid">
      <section class="card">
        <h2>1. Gespreksgegevens</h2>

        <label>naam accountmanager</label>
        <input id="accountManager" placeholder="Bijv. Mitch, Cees" />

        <label>Klantnaam</label>
        <input id="customer" placeholder="Bijv. HVC, Dunea, Tata Steel" />

        <label>Contactpersoon</label>
        <input id="contact" placeholder="Naam contactpersoon" />

        <label>Type gesprek</label>
        <select id="meetingType">
          <option>Relatiebeheer</option>
          <option>Service / onderhoud</option>
          <option>Offerte / aanvraag</option>
          <option>Project / CAPEX</option>
          <option>Klacht / escalatie</option>
          <option>Strategisch accountgesprek</option>
        </select>

        <label>Classificatie</label>
        <select id="classification">
          <option>Nog bepalen</option>
          <option>OPEX</option>
          <option>CAPEX</option>
          <option>OPEX + CAPEX</option>
          <option>Service</option>
          <option>Project</option>
        </select>

        <label>Commerciële status</label>
        <select id="status">
          <option>Oriënterend</option>
          <option>Kans herkend</option>
          <option>Offerte nodig</option>
          <option>Actie intern nodig</option>
          <option>Geen vervolg</option>
        </select>
      </section>

      <section class="card">
        <h2>2. Notitie</h2>

        <label>Gespreksnotitie</label>
        <textarea id="notes" rows="14" placeholder="Typ hier je notities van het gesprek..."></textarea>

        <button id="generate">Genereer slim verslag</button>
      </section>
    </div>

    <section class="card">
      <h2>3. Acties</h2>

      <div class="action-row">
        <input id="actionText" placeholder="Actie, bijv. offerte uitwerken" />
        <input id="actionOwner" placeholder="Eigenaar" />
        <input id="actionDate" type="date" />
        <button id="addAction">Toevoegen</button>
      </div>

      <div id="actionsList"></div>
    </section>

    <section class="card">
      <h2>4. Gegenereerd verslag</h2>
      <div id="output" class="output">Nog geen verslag gegenereerd.</div>

      <div class="buttons">
        <button id="copy">Kopieer verslag</button>
        <button id="clear">Nieuw gesprek</button>
      </div>
    </section>
  </div>
`;

function detectClassification(text) {
  const lower = text.toLowerCase();

  const capexWords = ["project", "investering", "aanbesteding", "renovatie", "nieuwbouw", "uitbreiding", "capex"];
  const opexWords = ["service", "onderhoud", "storing", "contract", "inspectie", "beheer", "opex"];

  const hasCapex = capexWords.some(word => lower.includes(word));
  const hasOpex = opexWords.some(word => lower.includes(word));

  if (hasCapex && hasOpex) return "OPEX + CAPEX";
  if (hasCapex) return "CAPEX";
  if (hasOpex) return "OPEX";
  return document.querySelector("#classification").value;
}

function detectOpportunities(text) {
  return text
    .split(".")
    .map(s => s.trim())
    .filter(s =>
      /offerte|kans|contract|uitbreiding|aanvraag|project|onderhoud|service|besparen/i.test(s)
    );
}

function detectRisks(text) {
  return text
    .split(".")
    .map(s => s.trim())
    .filter(s =>
      /klacht|risico|probleem|vertraging|onduidelijk|druk|ontevreden|storing/i.test(s)
    );
}

function renderActions() {
  const list = document.querySelector("#actionsList");

  if (actions.length === 0) {
    list.innerHTML = `<p class="muted">Nog geen acties toegevoegd.</p>`;
    return;
  }

  list.innerHTML = actions.map((a, index) => `
    <div class="action-card">
      <strong>${a.text}</strong>
      <span>Eigenaar: ${a.owner || "n.t.b."}</span>
      <span>Deadline: ${a.date || "n.t.b."}</span>
      <button onclick="removeAction(${index})">Verwijder</button>
    </div>
  `).join("");
}

window.removeAction = function(index) {
  actions.splice(index, 1);
  renderActions();
};

document.querySelector("#addAction").addEventListener("click", () => {
  const text = document.querySelector("#actionText").value;
  const owner = document.querySelector("#actionOwner").value;
  const date = document.querySelector("#actionDate").value;

  if (!text) return;

  actions.push({ text, owner, date });

  document.querySelector("#actionText").value = "";
  document.querySelector("#actionOwner").value = "";
  document.querySelector("#actionDate").value = "";

  renderActions();
});

document.querySelector("#generate").addEventListener("click", () => {
  const customer = document.querySelector("#customer").value;
  const contact = document.querySelector("#contact").value;
  const accountManager = document.querySelector("#accountManager").value;
  <p><strong>Accountmanager:</strong> ${accountManager || "-"}</p>
  const meetingType = document.querySelector("#meetingType").value;
  const status = document.querySelector("#status").value;
  const notes = document.querySelector("#notes").value;
  const classification = detectClassification(notes);

  document.querySelector("#classification").value = classification;

  const opportunities = detectOpportunities(notes);
  const risks = detectRisks(notes);

  if (notes.toLowerCase().includes("offerte")) {
    actions.push({ text: "Offerte uitwerken", owner: "Accountmanager", date: "" });
  }

  if (notes.toLowerCase().includes("vervolg") || notes.toLowerCase().includes("afspraak")) {
    actions.push({ text: "Vervolgafspraak plannen", owner: "Accountmanager", date: "" });
  }

  renderActions();

  document.querySelector("#output").innerHTML = `
    <h3>Gespreksverslag</h3>

    <p><strong>Klant:</strong> ${customer || "-"}</p>
    <p><strong>Contactpersoon:</strong> ${contact || "-"}</p>
    <p><strong>Type gesprek:</strong> ${meetingType}</p>
    <p><strong>Classificatie:</strong> ${classification}</p>
    <p><strong>Status:</strong> ${status}</p>

    <h3>Samenvatting</h3>
    <p>${notes || "Geen notitie ingevuld."}</p>

    <h3>Commerciële kansen</h3>
    ${
      opportunities.length
        ? `<ul>${opportunities.map(o => `<li>${o}</li>`).join("")}</ul>`
        : `<p>Geen duidelijke commerciële kans herkend.</p>`
    }

    <h3>Risico's / aandachtspunten</h3>
    ${
      risks.length
        ? `<ul>${risks.map(r => `<li>${r}</li>`).join("")}</ul>`
        : `<p>Geen duidelijke risico's herkend.</p>`
    }

    <h3>Acties</h3>
    ${
      actions.length
        ? `<ul>${actions.map(a => `<li>${a.text} — ${a.owner || "n.t.b."} — ${a.date || "geen deadline"}</li>`).join("")}</ul>`
        : `<p>Geen acties vastgelegd.</p>`
    }

    <h3>Volgende stap</h3>
    <p>Controleer het verslag, vul ontbrekende acties aan en deel dit daarna met betrokken collega’s.</p>
  `;
});

document.querySelector("#copy").addEventListener("click", () => {
  const text = document.querySelector("#output").innerText;
  navigator.clipboard.writeText(text);
  alert("Verslag gekopieerd.");
});

document.querySelector("#clear").addEventListener("click", () => {
  location.reload();
});

renderActions();