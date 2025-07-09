import * as XLSX from "xlsx";
import { Product } from "../types";

export async function loadProductsFromExcel(filePath: string): Promise<Product[]> {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const products = XLSX.utils.sheet_to_json<Product>(sheet);
  return products;
}
