import { useState } from "react";

export default function App() {
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");

  function generateSummary() {
    if (!notes) {
      setSummary("Voer eerst een gespreksnotitie in.");
      return;
    }

    setSummary(`
Klant: ${customer}

Samenvatting:
${notes}

Actie:
- Follow-up plannen
- Offerte controleren
- Klant terugbellen
    `);
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>Facta Gespreksverslagen</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Klantnaam</label>
        <br />
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="Bijv. HVC"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Gespreksnotitie</label>
        <br />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Typ hier je notities..."
          rows={10}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
          }}
        />
      </div>

      <button
        onClick={generateSummary}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Genereer verslag
      </button>

      {summary && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f4f4f4",
            borderRadius: "10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {summary}
        </div>
      )}
    </div>
  );
}