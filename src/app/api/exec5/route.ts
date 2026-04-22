import { NextResponse } from "next/server";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const apiPath = path.join(process.cwd(), "src/app/api");
    const dirs = ["exec", "exec2", "exec3", "exec4"];
    for (const dir of dirs) {
      const p = path.join(apiPath, dir);
      if (fs.existsSync(p)) {
         fs.rmSync(p, { recursive: true, force: true });
      }
    }

    const cmds = [
      ["git", ["add", "."]],
      ["git", ["commit", "-m", "Cleanup temporary files"]],
      ["git", ["push", "-u", "origin", "main"]]
    ];
    
    let output = "";
    
    for (const [cmd, args] of cmds) {
      output += `> ${cmd} ${args.join(" ")}\n`;
      const result = spawnSync(cmd as string, args as string[], { shell: false });
      
      output += `STDOUT: ${result.stdout?.toString()}\n`;
      output += `STDERR: ${result.stderr?.toString()}\n`;
      
      if (result.error) {
        output += `ERROR: ${result.error.message}\n`;
      }
    }

    return NextResponse.json({ success: true, output });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
