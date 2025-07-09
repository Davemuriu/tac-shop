import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { SaleEntry } from "../types";

export function exportSalesToExcel(salesData: SaleEntry[], filename = "sales.xlsx") {
  const sheetData = salesData.map((sale) => ({
    "Date/Time": sale.dateTime,
    SKU: sale.SKU,
    "Product Name": sale.productName,
    Quantity: sale.quantity,
    Price: sale.price,
    Total: sale.total,
  }));

  const ws = XLSX.utils.json_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, filename);
}
