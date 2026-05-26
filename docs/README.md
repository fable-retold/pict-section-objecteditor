# Pict Section: Object Editor Documentation

A tree-based JSON object editor view for Pict applications. Provides an interactive, expandable tree interface for inspecting and editing arbitrary JSON data structures with full support for all JSON types.

## Documentation Index

| Document | Description |
|----------|-------------|
| [Usage in a Pict Application](Usage-Pict-Application.md) | Integrate the editor into a Pict app with views and AppData |
| [Usage in Plain JavaScript](Usage-Plain-JavaScript.md) | Use the editor standalone in any web page |
| [Configuration Reference](Configuration.md) | All configuration options with defaults and descriptions |
| [API Reference](API-Reference.md) | Public methods for programmatic control |
| [Styling and Themes](Styling-and-Themes.md) | CSS customization, MacroTemplate overrides, and built-in themes |

## Quick Start

```bash
npm install pict-section-objecteditor
```

```javascript
const libPictSectionObjectEditor = require('pict-section-objecteditor');

// In a Pict application, register as a view:
pict.addView('MyEditor',
	{
		ObjectDataAddress: 'AppData.MyObject',
		DefaultDestinationAddress: '#editor-container',
		Renderables: [
			{
				RenderableHash: 'ObjectEditor-Container',
				TemplateHash: 'ObjectEditor-Container-Template',
				DestinationAddress: '#editor-container',
				RenderMethod: 'replace'
			}
		]
	},
	libPictSectionObjectEditor);
```

## Features

- **Tree-based navigation** -- Expand and collapse nested objects and arrays
- **Inline editing** -- Double-click values to edit strings and numbers in place
- **Type-aware operations** -- Add new properties or elements of any JSON type (String, Number, Boolean, Null, Object, Array)
- **Array reordering** -- Move array elements up and down with dedicated buttons
- **Add and remove** -- Add properties to objects, elements to arrays, and remove any node
- **Configurable templates** -- All HTML is generated via Pict MacroTemplates, fully overridable through configuration
- **Read-only mode** -- Disable editing for a pure inspector view
- **Depth control** -- Expand to a specific depth, expand all, or collapse all
- **Themeable** -- Ship your own CSS or use one of the included demo themes

## Ecosystem

Pict Section ObjectEditor is part of the Pict ecosystem:

- [pict](https://github.com/fable-retold/pict) - MVC application framework
- [pict-view](https://github.com/fable-retold/pict-view) - View base class
- [pict-template](https://github.com/fable-retold/pict-template) - Template engine
- [fable](https://github.com/fable-retold/fable) - Service infrastructure
