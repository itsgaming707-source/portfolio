import fs from "fs";
import path from "path";
import { PortfolioData } from "@/types/portfolio";
import defaultData from "@/data/portfolioData.json";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolioData.json");
const CONFIG_FILE_PATH = path.join(process.cwd(), "src", "data", "adminConfig.json");

export function getPortfolioData(): PortfolioData {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error reading portfolio data:", error);
  }
  return defaultData as PortfolioData;
}

export function savePortfolioData(data: PortfolioData): boolean {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    return false;
  }
}

export function getAdminPassword(): string {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, "utf-8"));
      return config.adminPassword || "admin";
    }
  } catch (error) {
    console.error("Error reading admin config:", error);
  }
  return process.env.ADMIN_PASSWORD || "Nikhil2006";
}

export function updateAdminPassword(newPassword: string): boolean {
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify({ adminPassword: newPassword }, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error updating admin password:", error);
    return false;
  }
}

