
const wettbewerbe = [
  "Medaillenschießen Jugend",
  "Medaillenschießen Schützen",
  "Pokalschießen Jugend",
  "Pokalschießen Schützen"
];

const app = document.getElementById("app");

function render() {
  app.innerHTML = "";
  wettbewerbe.forEach(w => {
    const container = document.createElement("div");
    container.className = "tab";
    const h2 = document.createElement("h2");
    h2.textContent = w;
    container.appendChild(h2);
    const entries = JSON.parse(localStorage.getItem(w)) || [];
    entries.forEach((e, i) => {
      const div = document.createElement("div");
      div.className = "entry";
      div.innerHTML = `
        <input placeholder="Startnummer" value="${e.startnummer}" onchange="update('${w}', ${i}, 'startnummer', this.value)">
        <input placeholder="Name" value="${e.name}" onchange="update('${w}', ${i}, 'name', this.value)">
        <input type="number" placeholder="1. Schuss" value="${e.schuss1}" onchange="update('${w}', ${i}, 'schuss1', this.value)">
        <input type="number" placeholder="2. Schuss" value="${e.schuss2}" onchange="update('${w}', ${i}, 'schuss2', this.value)">
        <input type="number" placeholder="3. Schuss" value="${e.schuss3}" onchange="update('${w}', ${i}, 'schuss3', this.value)">
        <span class="total">Gesamt: ${(+e.schuss1||0)+(+e.schuss2||0)+(+e.schuss3||0)}</span>
      `;
      container.appendChild(div);
    });
    const btn = document.createElement("button");
    btn.textContent = "Teilnehmer hinzufügen";
    btn.onclick = () => addEntry(w);
    container.appendChild(btn);
    app.appendChild(container);
  });

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "CSV exportieren";
  exportBtn.onclick = exportCSV;
  exportBtn.style.marginTop = "1rem";
  app.appendChild(exportBtn);
}

function update(wettbewerb, index, field, value) {
  const data = JSON.parse(localStorage.getItem(wettbewerb)) || [];
  data[index][field] = value;
  localStorage.setItem(wettbewerb, JSON.stringify(data));
  render();
}

function addEntry(wettbewerb) {
  const data = JSON.parse(localStorage.getItem(wettbewerb)) || [];
  data.push({ startnummer: "", name: "", schuss1: "", schuss2: "", schuss3: "" });
  localStorage.setItem(wettbewerb, JSON.stringify(data));
  render();
}

function exportCSV() {
  let csv = "Wettbewerb;Startnummer;Name;1. Schuss;2. Schuss;3. Schuss;Gesamt\n";
  wettbewerbe.forEach(w => {
    const data = JSON.parse(localStorage.getItem(w)) || [];
    data.forEach(e => {
      const gesamt = (+e.schuss1||0)+(+e.schuss2||0)+(+e.schuss3||0);
      csv += `${w};${e.startnummer};${e.name};${e.schuss1};${e.schuss2};${e.schuss3};${gesamt}\n`;
    });
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ergebnisse.csv";
  a.click();
}

window.onload = render;
