import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Joaco/Downloads/Publicar-08-13-09_27_12.xlsx";
const outputDir = "C:/Users/Joaco/Documents/ChatGPT/Saracho Neumáticos/outputs/mercado_libre_2026-08-13";

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

if (false) {
const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 12000,
  tableMaxRows: 8,
  tableMaxCols: 12,
  tableMaxCellChars: 160,
});
console.log("OVERVIEW");
console.log(overview.ndjson);

const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 6000 });
console.log("SHEETS");
console.log(sheets.ndjson);

for (const sheet of workbook.worksheets.items) {
  const preview = await workbook.render({
    sheetName: sheet.name,
    range: "A1:BD12",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    `${outputDir}/before-${sheet.name.replace(/[^a-z0-9_-]+/gi, "_")}.png`,
    new Uint8Array(await preview.arrayBuffer()),
  );
  const header = await workbook.inspect({
    kind: "table",
    sheetId: sheet.name,
    range: "A1:BD12",
    include: "values,formulas",
    maxChars: 30000,
    tableMaxRows: 12,
    tableMaxCols: 56,
    tableMaxCellChars: 300,
  });
  console.log(`TABLE ${sheet.name}`);
  console.log(header.ndjson);
}
}

const productSheet = workbook.worksheets.getItem("Neumáticos de Auto y Camioneta");
const data = productSheet.getRange("A9:BG1001").values;
const columnLetters = [];
for (let index = 0; index < 59; index += 1) {
  let n = index + 1;
  let label = "";
  while (n > 0) {
    n -= 1;
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26);
  }
  columnLetters.push(label);
}

const placeholderValues = new Set([
  "Seleccionar",
  "Escribí o elegí un valor",
  "Ofrezco",
  "Nuevo",
  "No agregar cuotas",
  "Acepto",
  "Garantía de fábrica",
  "años",
  "Michelin",
  "21 %",
  "0 %",
  "#VALUE!",
]);
const stats = columnLetters.map((letter, columnIndex) => {
  const values = data
    .map((row, rowIndex) => ({ row: rowIndex + 9, value: row[columnIndex] }))
    .filter(({ value }) => value !== null && value !== "" && value !== undefined);
  const unique = [];
  for (const entry of values) {
    const key = String(entry.value);
    if (!unique.some((item) => item.value === key)) unique.push({ row: entry.row, value: key });
    if (unique.length >= 12) break;
  }
  const meaningful = values.filter(({ value }) => !placeholderValues.has(String(value)) && value !== 1 && value !== 5);
  return { column: letter, nonEmpty: values.length, meaningful: meaningful.length, uniqueSamples: unique };
});
if (false) {
  console.log("COLUMN_STATS");
  console.log(JSON.stringify(stats.filter((item) => item.meaningful > 0 || ["B","F","H","M","O","P","Q","R","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD"].includes(item.column)), null, 2));
}

const rowsWithUserData = data
  .map((row, rowIndex) => ({ row: rowIndex + 9, values: row }))
  .filter(({ values }) => {
    const meaningfulColumns = [0, 1, 4, 5, 6, 7, 9, 12, 13, 14, 15, 16, 17, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58];
    return meaningfulColumns.some((col) => {
      const value = values[col];
      return value !== null && value !== "" && value !== undefined && !placeholderValues.has(String(value)) && value !== 1 && value !== 5;
    });
  })
  .slice(0, 80)
  .map(({ row, values }) => ({
    row,
    cells: Object.fromEntries(values.map((value, col) => [columnLetters[col], value]).filter(([, value]) => value !== null && value !== "" && value !== undefined)),
  }));
if (false) {
  console.log("MEANINGFUL_ROWS");
  console.log(JSON.stringify(rowsWithUserData, null, 2));
}

for (const sourcePath of [
  "C:/Users/Joaco/Downloads/Mercado_Libre_Saracho_CORREGIDO_VISIBLE.xlsx",
  "C:/Users/Joaco/Downloads/Mercado_Libre_Dimensiones_Pesos_Saracho.xlsx",
]) {
  const sourceInput = await FileBlob.load(sourcePath);
  const sourceWorkbook = await SpreadsheetFile.importXlsx(sourceInput);
  if (false) console.log(`SOURCE ${sourcePath}`);
  const sourceOverview = await sourceWorkbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 25000,
    tableMaxRows: 60,
    tableMaxCols: 20,
    tableMaxCellChars: 200,
  });
  if (false) console.log(sourceOverview.ndjson);
  for (const sourceSheet of sourceWorkbook.worksheets.items) {
    const sourcePreview = await sourceWorkbook.render({
      sheetName: sourceSheet.name,
      autoCrop: "all",
      scale: 1,
      format: "png",
    });
    await fs.writeFile(
      `${outputDir}/source-${sourcePath.split("/").at(-1).replace(/\.xlsx$/i, "")}-${sourceSheet.name.replace(/[^a-z0-9_-]+/gi, "_")}.png`,
      new Uint8Array(await sourcePreview.arrayBuffer()),
    );
  }
}

if (false) {
console.log("VALIDATIONS");
for (const address of ["F9", "M9", "AJ9", "AK9", "AL9", "AM9", "AN9", "AO9", "AP9", "AQ9", "AR9", "AS9", "AT9", "AU9", "AV9", "AW9", "AX9", "AY9", "AZ9", "BA9", "BB9", "BC9", "BD9"]) {
  const validation = productSheet.getRange(address).dataValidation;
  console.log(address, JSON.stringify(validation));
}
console.log(workbook.help("range.dataValidation", { include: "index,examples,notes", maxChars: 5000 }).ndjson);
}

for (const catalogPath of [
  "C:/Users/Joaco/Downloads/2026-08-10T16_11_38Z_especificaciones-de-productos_sarachoneumaticos.xlsx",
  "C:/Users/Joaco/Downloads/2026-08-10T13_55_07Z_especificaciones-de-productos_sarachoneumaticos.xlsx",
]) {
  const catalogInput = await FileBlob.load(catalogPath);
  const catalogWorkbook = await SpreadsheetFile.importXlsx(catalogInput);
  const catalogOverview = await catalogWorkbook.inspect({
    kind: "workbook,sheet,table",
    maxChars: 18000,
    tableMaxRows: 12,
    tableMaxCols: 30,
    tableMaxCellChars: 180,
  });
  if (false) {
    console.log(`CATALOG ${catalogPath}`);
    console.log(catalogOverview.ndjson);
  }
  const targetCodes = new Set(["472527", "416537", "12600NXC", "665100", "068-CONT", "832656", "55039"]);
  const catalogSheet = catalogWorkbook.worksheets.getItemAt(0);
  const catalogValues = catalogSheet.getRange("A3:P1000").values;
  const matches = catalogValues
    .filter((row) => targetCodes.has(String(row[2] ?? "")))
    .map((row) => ({
      productId: row[0],
      name: row[1],
      code: row[2],
      brand: row[4],
      field: row[10],
      value: row[15] ?? row[13],
    }));
  console.log(`CATALOG_MATCHES ${catalogPath}`);
  console.log(JSON.stringify(matches, null, 2));
}
