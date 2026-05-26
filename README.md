# Pict Section: Object Editor

> **[&#9654; Read the Pict-Section-Objecteditor Documentation](https://fable-retold.github.io/pict-section-objecteditor/)** &mdash; interactive docs with the full API reference.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A tree-based JSON object editor view for the Pict application framework. Provides an interactive, expandable tree interface for inspecting and editing arbitrary JSON data structures -- objects, arrays, strings, numbers, booleans, and nulls.

## Features

- **Tree-based navigation** -- Expand and collapse nested objects and arrays with click-to-toggle controls
- **Inline editing** -- Double-click string or number values to edit them in place
- **Type-aware add** -- Add new properties or array elements of any JSON type via a dropdown selector
- **Array reordering** -- Move array elements up and down with dedicated buttons
- **Add and remove** -- Add properties to objects, elements to arrays, and remove any node
- **Configurable templates** -- All HTML fragments are Pict MacroTemplates, fully overridable through configuration
- **Read-only mode** -- Set `Editable: false` for a pure data inspector
- **Depth control** -- Expand to a specific depth, expand all, or collapse all
- **Themeable** -- Built-in CSS with clean defaults; five additional demo themes included

## Installation

```bash
npm install pict-section-objecteditor
```

## Quick Start

```javascript
const libPictSectionObjectEditor = require('pict-section-objecteditor');

// Register as a Pict view
pict.addView('MyEditor',
	{
		ObjectDataAddress: 'AppData.MyObject',
		DefaultDestinationAddress: '#editor-container',
		InitialExpandDepth: 2,
		Editable: true,
		Renderables:
		[
			{
				RenderableHash: 'ObjectEditor-Container',
				TemplateHash: 'ObjectEditor-Container-Template',
				DestinationAddress: '#editor-container',
				RenderMethod: 'replace'
			}
		]
	},
	libPictSectionObjectEditor);

// Render the editor
pict.views.MyEditor.render();
```

The editor reads and writes data at `ObjectDataAddress` within the Fable instance (e.g. `this.fable.AppData.MyObject`). Changes are reflected in AppData immediately.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ObjectDataAddress` | string | `false` | Dot-path to the data (e.g. `'AppData.Config'`) |
| `InitialExpandDepth` | number | `1` | Auto-expand depth on first render |
| `Editable` | boolean | `true` | Enable editing UI |
| `ShowTypeIndicators` | boolean | `true` | Show type badges on containers |
| `IndentPixels` | number | `20` | Pixels of indentation per depth level |

## API

```javascript
let editor = pict.views.MyEditor;

// Expand/collapse
editor.expandAll();
editor.collapseAll();
editor.expandToDepth(3);

// Mutate data
editor.addObjectProperty('server', 'timeout', 30000);
editor.addArrayElement('features', 'websockets');
editor.setValueAtPath('server.port', 3000);
editor.removeNode('server.debug');

// Array reorder
editor.moveArrayElementUp('features', 2);
editor.moveArrayElementDown('features', 0);
```

## Keyboard Controls

| Context | Key | Action |
|---------|-----|--------|
| Inline edit | Enter | Commit the new value |
| Inline edit | Escape | Cancel and revert |
| Add property input | Enter | Commit the new property |
| Add property input | Escape | Cancel the add operation |

## Themes

The default theme uses warm, paper-like tones with a monospace font. The example application includes five additional themes:

| Theme | Style |
|-------|-------|
| **Basic** | Clean off-white with warm accents (default) |
| **Midnight** | Dark mode with Catppuccin-inspired colors |
| **Blueprint** | Technical grid-paper aesthetic |
| **Solarized** | Ethan Schoonover's Solarized light palette |
| **Terminal** | Retro green CRT with glow effects |
| **Spreadsheet** | Google Sheets-inspired data grid |

Themes are applied via a `data-theme` attribute on the container element. See the [Styling and Themes](docs/Styling-and-Themes.md) guide for details on writing custom themes.

## Documentation

Detailed documentation is available in the [docs](docs/) folder:

| Document | Description |
|----------|-------------|
| [Docs README](docs/README.md) | Documentation index and quick start |
| [Usage in a Pict Application](docs/Usage-Pict-Application.md) | Integration with Pict views and AppData |
| [Usage in Plain JavaScript](docs/Usage-Plain-JavaScript.md) | Standalone usage in any web page |
| [Configuration Reference](docs/Configuration.md) | All options, MacroTemplates, and template variables |
| [API Reference](docs/API-Reference.md) | Public methods for programmatic control |
| [Styling and Themes](docs/Styling-and-Themes.md) | CSS classes, MacroTemplate overrides, and theme guide |

## Example Application

A complete working example is in `example_applications/json_editor/`. To run it:

```bash
cd example_applications/json_editor
npm install
npx quack build && npx quack copy
# Open dist/index.html in a browser
```

The example includes a toolbar with expand/collapse controls and a theme selector dropdown.

## Testing

```bash
npm test
```

75 tests covering type detection, path parsing, value access, expand/collapse state, HTML rendering, add/remove operations, array reordering, path cleanup, and more.

```bash
npm run coverage
```

## Building

```bash
npm run build
```

Uses Quackage to produce Browserified bundles.

## Related Packages

- [pict](https://github.com/fable-retold/pict) - MVC application framework
- [pict-view](https://github.com/fable-retold/pict-view) - View base class
- [pict-template](https://github.com/fable-retold/pict-template) - Template engine
- [pict-provider](https://github.com/fable-retold/pict-provider) - Data provider base class
- [fable](https://github.com/fable-retold/fable) - Service infrastructure

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
