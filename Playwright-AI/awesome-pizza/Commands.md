# Commands for AI Playwright

## Initialize Project

```bash
npm init playwright@latest
```

## Add Playwright Test Agent Definitions

For Claude:
```bash
npx playwright init-agents --loop=claude
```

For VSCode:
```bash
npx playwright init-agents --loop=vscode
```


Install playwright cli:
```bash
npm install -g @playwright/cli@latest
```

Install playwright cli skills:
```bash
playwright-cli install --skills
```
If this command only install skills for claude, copy the skills folder to .github