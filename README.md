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
npm install
```

2. **Build all packges**
```bash
npm run build:all
yarn build:cli --watch      # For incremental development
```

1. **Link CLI globally**
```bash
cd apps/cli
npm link                    # Creates global symlink
node-blueprint --version    # Verify local version
```

#### Monorepo Structure
```plaintext
├── apps/
│   ├── create-node-blueprint/               # CLI package (create-node-blueprint)
│   └── web/                                 # Docs site (@node-blueprint/web)
└── package.json
```

#### Development Scripts
{
  "scripts": {
    "dev:web": "yarn workspace @node-blueprint/web dev",
    "dev:cli": "yarn workspace create-node-blueprint dev",
    "build:web": "yarn workspace @node-blueprint/web build",
    "build:cli": "yarn workspace create-node-blueprint build",
    "build:all": "yarn build:cli && yarn build:web"
  }
}

#### Golden Rule
Always test template generation with multiple combinations before submitting PR!
