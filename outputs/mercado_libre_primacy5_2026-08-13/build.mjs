import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "C:/Users/Joaco/Downloads/Publicar-08-13-09_27_12.xlsx";
const outputDir = "C:/Users/Joaco/Documents/ChatGPT/Saracho Neumáticos/outputs/mercado_libre_primacy5_2026-08-13";
const outputPath = `${outputDir}/Mercado_Libre_Primacy_5_catalogado.xlsx`;
const sheetName = "Neumáticos de Auto y Camioneta";

const products = [
  { sku: "044495", width: 215, aspect: 55, rim: 18, load: 99, speed: "V", weightKg: 10.4, loadRange: "XL" },
  { sku: "065068", width: 245, aspect: 45, rim: 18, load: 100, speed: "W", weightKg: 11.1, loadRange: "XL" },
  { sku: "121427", width: 255, aspect: 45, rim: 18, load: 99, speed: "Y", weightKg: 11.7, loadRange: "SL" },
  { sku: "192003", width: 235, aspect: 55, rim: 19, load: 105, speed: "W", weightKg: 10.0, loadRange: "XL" },
  { sku: "330554", width: 215, aspect: 60, rim: 16, load: 95, speed: "V", weightKg: 10.0, loadRange: "SL" },
  { sku: "402612", width: 225, aspect: 55, rim: 18, load: 102, speed: "V", weightKg: 10.8, loadRange: "XL" },
  { sku: "416537", width: 205, aspect: 45, rim: 17, load: 88, speed: "W", weightKg: 9.2, loadRange: "XL" },
  { sku: "430332", width: 215, aspect: 55, rim: 17, load: 94, speed: "V", weightKg: 8.0, loadRange: "SL" },
  { sku: "443497", width: 215, aspect: 65, rim: 17, load: 103, speed: "V", weightKg: 10.9, loadRange: "XL" },
  { sku: "44495", width: 215, aspect: 55, rim: 18, load: 99, speed: "V", weightKg: 10.4, loadRange: "XL" },
  { sku: "558009", width: 205, aspect: 55, rim: 16, load: 94, speed: "V", weightKg: 8.9, loadRange: "XL" },
  { sku: "579287", width: 235, aspect: 50, rim: 19, load: 103, speed: "W", weightKg: 8.0, loadRange: "XL" },
  { sku: "65068", width: 245, aspect: 45, rim: 18, load: 100, speed: "W", weightKg: 11.1, loadRange: "XL" },
  { sku: "696861", width: 225, aspect: 55, rim: 17, load: 101, speed: "W", weightKg: 10.3, loadRange: "XL" },
  { sku: "740443", width: 225, aspect: 45, rim: 17, load: 94, speed: "W", weightKg: 8.0, loadRange: "XL" },
  { sku: "864963", width: 215, aspect: 50, rim: 17, load: 95, speed: "W", weightKg: 9.4, loadRange: "XL" },
  { sku: "894109", width: 235, aspect: 45, rim: 18, load: 98, speed: "Y", weightKg: 10.4, loadRange: "XL" },
  { sku: "974855", width: 215, aspect: 55, rim: 16, load: 97, speed: "W", weightKg: 9.5, loadRange: "XL" },
  { sku: "975969", width: 205, aspect: 60, rim: 16, load: 92, speed: "V", weightKg: 9.0, loadRange: "SL" },
  { sku: "989426", width: 235, aspect: 45, rim: 17, load: 97, speed: "W", weightKg: 10.0, loadRange: "XL" },
];

for (const product of products) {
  product.size = `${product.width}/${product.aspect} R${product.rim}`;
  product.title = `NEUMATICO ${product.size} MICHELIN PRIMACY 5 ${product.load}${product.speed}`;
  product.packageWidthCm = Math.ceil(product.width / 10);
  product.outerDiameterCm = Math.ceil(product.rim * 2.54 + (2 * product.width * product.aspect) / 1000);
}

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItem(sheetName);

const beforeStyle = await workbook.inspect({
  kind: "computedStyle",
  sheetId: sheetName,
  range: "B3:R12",
  maxChars: 3500,
});
console.log("BEFORE_STYLE");
console.log(beforeStyle.ndjson);

const beforePreview = await workbook.render({
  sheetName,
  range: "A1:BD12",
  scale: 0.7,
  format: "png",
});
await fs.writeFile(`${outputDir}/before-template.png`, new Uint8Array(await beforePreview.arrayBuffer()));

const firstRow = 9;
const lastRow = firstRow + products.length - 1;

sheet.getRange(`B${firstRow}:B${lastRow}`).values = products.map((product) => [product.title]);
sheet.getRange(`F${firstRow}:F${lastRow}`).values = products.map((product) => [product.speed]);
sheet.getRange(`H${firstRow}:H${lastRow}`).values = products.map((product) => [product.sku]);
sheet.getRange(`O${firstRow}:R${lastRow}`).values = products.map((product) => [
  product.packageWidthCm,
  product.outerDiameterCm,
  product.outerDiameterCm,
  product.weightKg,
]);

sheet.getRange(`AJ${firstRow}:BD${lastRow}`).values = products.map((product) => [
  "Michelin",
  "Primacy 5",
  product.load,
  1,
  product.aspect,
  product.width,
  "mm",
  product.rim,
  '"',
  "Primacy",
  "BSW",
  "P",
  "No",
  "Verano",
  null,
  "No",
  "HT",
  "No",
  null,
  null,
  product.loadRange,
]);

const checkMain = await workbook.inspect({
  kind: "table",
  sheetId: sheetName,
  range: `B3:R${lastRow}`,
  include: "values,formulas",
  maxChars: 18000,
  tableMaxRows: 28,
  tableMaxCols: 17,
  tableMaxCellChars: 120,
});
console.log("CHECK_MAIN");
console.log(checkMain.ndjson);

const checkAttributes = await workbook.inspect({
  kind: "table",
  sheetId: sheetName,
  range: `AJ3:BD${lastRow}`,
  include: "values,formulas",
  maxChars: 18000,
  tableMaxRows: 28,
  tableMaxCols: 21,
  tableMaxCellChars: 120,
});
console.log("CHECK_ATTRIBUTES");
console.log(checkAttributes.ndjson);

for (const [label, range] of [
  ["requested-left", `B${firstRow}:B${lastRow}`],
  ["speed", `F${firstRow}:F${lastRow}`],
  ["sku", `H${firstRow}:H${lastRow}`],
  ["package", `O${firstRow}:R${lastRow}`],
  ["attributes", `AJ${firstRow}:BD${lastRow}`],
]) {
  const errors = await workbook.inspect({
    kind: "match",
    sheetId: sheetName,
    range,
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 100 },
    summary: `${label} formula error scan`,
  });
  console.log(`ERROR_SCAN ${label}`);
  console.log(errors.ndjson);
}

const previewSpecs = [
  ["Ayuda", "A1:I99", 0.8, "final-ayuda.png"],
  ["extra info", "A1:IG27", 0.5, "final-extra-info.png"],
  [sheetName, `A1:R${lastRow}`, 1, "final-products-main.png"],
  [sheetName, `AH1:BD${lastRow}`, 1, "final-products-attributes.png"],
];
for (const [previewSheet, range, scale, filename] of previewSpecs) {
  const preview = await workbook.render({ sheetName: previewSheet, range, scale, format: "png" });
  await fs.writeFile(`${outputDir}/${filename}`, new Uint8Array(await preview.arrayBuffer()));
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT ${outputPath}`);
process.exit(0);
