# Node Blueprint CLI
Node Blueprint is a zero-config CLI tool that helps you scaffold production-ready Node.js applications with your preferred tech stack in one command.

[![npm version](https://img.shields.io/npm/v/create-node-blueprint.svg)](https://www.npmjs.com/package/create-node-blueprint)
[![npm downloads](https://img.shields.io/npm/dm/create-node-blueprint)](https://www.npmjs.com/package/create-node-blueprint)
[![license](https://img.shields.io/npm/l/create-node-blueprint)](https://www.npmjs.com/package/create-node-blueprint)

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

## Development Contribution

### Before You Start
1. **Always open an issue first**  
   Discuss your proposed changes before writing code
2. **Check existing issues**  
   Avoid duplicating work by searching open/closed issues
3. **Fork the repository**  
   Create your feature branch from the `main` branch

### Local Development Setup

1. **Clone and install dependencies**
```bash
git clone https://github.com/yogendrarana/node-blueprint.git
cd node-blueprint
bun install
```

2. **Build all packages**
```bash
bun run build
bun run build:cli               # Build CLI package
```

3. **Link CLI globally**
```bash
cd apps/create-node-blueprint
npm link                    # Creates global symlink
create-node-blueprint --help    # Verify local version
```

#### Monorepo Structure
```plaintext
├── apps/
│   ├── create-node-blueprint/               # CLI package (create-node-blueprint)
│   └── web/                                 # Docs site (@node-blueprint/web)
└── package.json
```

#### Development Scripts
```plaintext
{
  "scripts": {
    "dev:web": "bun --filter @node-blueprint/web dev",
    "dev:cli": "bun --filter create-node-blueprint dev",
    "build:web": "bun --filter @node-blueprint/web build",
    "build:cli": "bun --filter create-node-blueprint build",
    "build": "bun run build:cli && bun run build:web"
  }
}
```

## Golden Rule
Always test template generation with multiple combinations before submitting PR!
