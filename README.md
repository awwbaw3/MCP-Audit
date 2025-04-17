# 🧭 MCP-Audit

`mcp-audit` is a CLI tool that scans your project for compliance with custom `.mcp` (Model Context Protocol) files and README goals. It also detects duplicate logic and generates a detailed report, making it ideal for AI-assisted IDEs like Cursor and Windsurf.

## 🔧 Features

- ✅ Validates your project against rules in `mcp-suite/*.mcp`
- 📄 Compares actual code against stated goals in `README.md`
- 🔍 Detects duplicate files, components, or logic
- 🧠 Outputs audit reports in Markdown or JSON
- ⚙️ Optional GitHub Action for automated audits on push

## 🚀 Getting Started

### 1. Install (Dev or Local)

```bash
git clone https://github.com/awwbaw3/MCP-Audit.git
cd MCP-Audit
npm install
