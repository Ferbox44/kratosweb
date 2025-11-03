# Kratos

A web-based interactive compiler application built with Angular and WebAssembly. Kratos provides a Monaco Editor-powered interface for writing and compiling code, with real-time feedback on tokens, quadruples (intermediate code), and compilation errors.

## Features

- 🎨 **Monaco Editor Integration**: Full-featured code editor with syntax highlighting and IntelliSense support
- ⚡ **WebAssembly Compiler**: Fast, client-side compilation powered by WASM
- 📊 **Detailed Compilation Results**:
  - Token analysis (lexical analysis results)
  - Quadruples (intermediate code representation)
  - Syntax and semantic error reporting
- 🎯 **Real-time Feedback**: Instant compilation results with visual indicators
- 🌙 **Dark Theme**: Modern dark theme for comfortable coding

## Technology Stack

- **Angular** 20.3.0
- **Monaco Editor** 0.53.0
- **WebAssembly** (compiler backend)
- **TypeScript** 5.9.2
- **RxJS** 7.8.0

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kratos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
kratos/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── editor/          # Monaco Editor component
│   │   ├── services/
│   │   │   └── compilador.service.ts  # WASM compiler service
│   │   ├── app.ts               # Root component
│   │   └── app.routes.ts        # Routing configuration
│   ├── assets/
│   │   └── wasm/                # WebAssembly compiler files
│   │       ├── compilador.js
│   │       └── compilador.wasm
│   └── styles.css               # Global styles
├── dist/                        # Build output
└── package.json
```

## Usage

1. Write your code in the Monaco Editor
2. Click the "Compilar" (Compile) button
3. View the compilation results in the tabs:
   - **Tokens**: See the lexical analysis results
   - **Cuádruplos**: View the generated quadruples (intermediate code)
   - **Errores**: Check for syntax and semantic errors

## Example Code

The editor comes with a default example:

```plaintext
class mi_program
def private A as int;
main()
  Cont = 0;
end
endclass
```

## Development

### Running Tests

```bash
npm test
```

### Code Style

This project uses Prettier for code formatting with the following configuration:
- Print width: 100
- Single quotes
- Angular HTML parser for template files

## Browser Support

Modern browsers with WebAssembly support:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## License

MIT License


