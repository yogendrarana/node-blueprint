# Node Blueprint CLI
Node Blueprint is a zero-config CLI tool that helps you scaffold production-ready Node.js applications with your preferred tech stack in one command.

## Features ✨
- Instant project boilerplate generation
- Interactive prompt mode
- Supports multiple frameworks, databases & ORMs
- TypeScript and ESM first approach

## Tech Stack Options

### Frameworks
- `express`
- `fastify`

### Databases
- `mysql`
- `postgresql`
- `mongodb`

### ORMs
- `drizzle`
- `prisma`
- `mongoose`

## Installation & Usage

### Interactive Mode
```bash
npm create node-blueprint
```

### Quick generation with files
```bash
npm create node-blueprint --name app-name --framework express --database postgres --orm drizzle
```