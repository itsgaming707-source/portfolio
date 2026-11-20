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

export interface AdminCredentials {
  username: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, "utf-8"));
      return {
        username: config.adminUsername || process.env.ADMIN_USERNAME || "Nikhil123",
        password: config.adminPassword || process.env.ADMIN_PASSWORD || "Nikhil2006",
      };
    }
  } catch (error) {
    console.error("Error reading admin config:", error);
  }
  return {
    username: process.env.ADMIN_USERNAME || "Nikhil123",
    password: process.env.ADMIN_PASSWORD || "Nikhil2006",
  };
}

export function updateAdminCredentials(newCreds: { username?: string; password?: string }): boolean {
  try {
    const current = getAdminCredentials();
    const updated = {
      adminUsername: newCreds.username ? newCreds.username.trim() : current.username,
      adminPassword: newCreds.password ? newCreds.password : current.password,
    };
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error updating admin credentials:", error);
    return false;
  }
}

export function getAdminPassword(): string {
  return getAdminCredentials().password;
}

export function updateAdminPassword(newPassword: string): boolean {
  return updateAdminCredentials({ password: newPassword });
}
