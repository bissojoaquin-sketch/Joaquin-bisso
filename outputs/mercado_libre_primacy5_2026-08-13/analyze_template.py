from pathlib import Path
import zipfile
import xml.etree.ElementTree as ET

path = Path(r"C:\Users\Joaco\Downloads\Publicar-08-13-09_27_12.xlsx")
ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

with zipfile.ZipFile(path) as book:
    workbook = ET.fromstring(book.read("xl/workbook.xml"))
    rels = ET.fromstring(book.read("xl/_rels/workbook.xml.rels"))
    rel_map = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels
    }
    rel_ns = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    for sheet in workbook.find("m:sheets", ns):
        name = sheet.attrib["name"]
        if name != "Neumáticos de Auto y Camioneta":
            continue
        target = rel_map[sheet.attrib[rel_ns]].replace("\\", "/")
        sheet_path = target if target.startswith("xl/") else f"xl/{target}"
        root = ET.fromstring(book.read(sheet_path))
        validations = root.find("m:dataValidations", ns)
        if validations is None:
            print("No data validations")
            break
        for validation in validations:
            sqref = validation.attrib.get("sqref", "")
            formula = validation.findtext("m:formula1", default="", namespaces=ns)
            if any(column in sqref for column in [
                "F", "M", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS",
                "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD",
            ]):
                print(sqref, "=>", formula)
