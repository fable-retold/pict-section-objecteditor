# JSON Editor — Interactive Object Editor with Six Themes

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/json%5Feditor/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

A single-page playground for `pict-section-objecteditor`. Renders a
deeply-nested fictional server configuration into a collapsible,
inline-editable tree with type indicators, add/remove/reorder
controls, and a theme switcher that swaps between six radically
different visual styles — Basic, Midnight (dark), Blueprint (technical
graph paper), Solarized (data-grid), Terminal (retro green CRT), and
Spreadsheet (Google-Sheets-like grid). The editor view is one
subclass; everything else is configuration plus a CSS-only theme
attribute toggle.

The application code is *seven* statements — register a view, render
it on initialise. Every interactive capability — toggle nodes, click
to add, double-click to edit, drag-to-reorder, depth-N expansion,
runtime theme switching — comes from the view's public API and
`data-theme` attribute.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Object editor view subclassed from `Pict-Section-ObjectEditor` | `class ExampleObjectEditorView extends libPictSectionObjectEditor` |
| `ObjectDataAddress` binds the editor to AppData | `"ObjectDataAddress": "AppData.ConfigData"` — view reads from `this.fable.AppData.ConfigData` |
| `InitialExpandDepth` for first-render layout | `"InitialExpandDepth": 2` — root + first-level objects open, deeper ones collapsed |
| Editable mode with type-aware inputs | `"Editable": true` — double-click strings/numbers, single-click booleans, add/remove buttons appear |
| Type indicator badges | `"ShowTypeIndicators": true` — `obj` / `arr` badges next to container keys |
| `expandAll()` / `collapseAll()` / `expandToDepth(N)` API | Toolbar buttons call straight into the view |
| Six runtime CSS themes via `data-theme` attribute | `setTheme(name)` flips `data-theme` on the editor root; CSS in the HTML cascades the rest |
| `var(--theme-color-*)` token system with fallbacks | The default theme uses `var(--theme-color-text-primary, #3D3229)` so themes can override via CSS custom properties |
| Inline value editing with Enter / Escape | Double-click a value → input appears; Enter commits, Escape cancels |
| Click-to-toggle for booleans | Booleans render as clickable text — one click flips true ↔ false |
| Add property / add element / remove / move up / move down | Hover any row → action buttons appear in the right margin |
| Macro templates for fine-grained HTML overrides | `MacroTemplates.Node.*` is a fragment-by-fragment map every host can swap |

## Key files

- `ObjectEditor-Example-Application.js` — the entire host application.
  Declares an `ExampleObjectEditorConfiguration` object literal,
  subclasses the section as `ExampleObjectEditorView`, registers it
  via `pict.addView(...)`, then renders it in `onAfterInitialize`.
  Also seeds `AppData.ConfigData` with a richly-typed sample
  configuration so the tree has something interesting to display on
  first paint.
- `html/index.html` — the static shell. Contains all six themes as
  scoped CSS blocks (`.pict-objecteditor[data-theme="midnight"] ...`,
  `.pict-objecteditor[data-theme="blueprint"] ...`, …), the toolbar
  with expand/collapse/depth/theme controls, and the
  `<div id="ObjectEditorContainer"></div>` slot.
- `package.json` — `name: "object_editor_example"` becomes the bundle
  filename `object_editor_example.min.js`, loaded after `pict.min.js`.

## The data model

One AppData address, the deeply-nested `ConfigData`, declared inline
in the application's `default_configuration`:

```json
"DefaultAppData":
{
    "ConfigData":
    {
        "application":
        {
            "name": "Retold Documentation Server",
            "version": "2.1.0",
            "debug": false,
            "port": 8080,
            "maxConnections": 1000,
            "features": ["markdown", "mermaid", "search", "syntax-highlight"],
            "database":
            {
                "host": "localhost",
                "port": 5432,
                "name": "retold_docs",
                "ssl": true,
                "pool": { "min": 2, "max": 10 },
                "credentials": null
            },
            "logging":
            {
                "level": "info",
                "format": "json",
                "colorize": true,
                "destinations":
                [
                    { "type": "console", "enabled": true },
                    { "type": "file", "path": "/var/log/retold.log", "enabled": false, "maxSize": "10MB" }
                ]
            },
            "cache":
            {
                "enabled": true,
                "ttl": 3600,
                "maxItems": 500,
                "strategy": "lru"
            },
            "metadata":
            {
                "createdAt": "2024-01-15T08:30:00Z",
                "author": "Steven Velozo",
                "tags": ["documentation", "api", "fable", "open-source"],
                "license": "MIT"
            }
        }
    }
}
```

Every primitive type is represented: strings, numbers, booleans,
`null`, arrays of strings, arrays of objects, nested objects. The
sample is intentionally heterogeneous so the editor exercises every
rendering path on first paint.

The editor doesn't hold its own copy — it reads and writes
`this.fable.AppData.ConfigData` in place. Mutations from the buttons
(remove, add, reorder, inline-edit commit) **mutate the AppData
object directly**. Any other view, provider, or solver reading the
same address sees the updated values immediately, with no event
dispatch required.

---

## Feature 1 — Subclassing the section view

The section is consumed as a Pict view, not a provider. Hosts
subclass it to inherit the rendering + interaction logic, then merge
their own configuration on top of the section's
`default_configuration`:

```js
const libPictSectionObjectEditor = require('../../source/Pict-Section-ObjectEditor.js');

class ExampleObjectEditorView extends libPictSectionObjectEditor
{
    constructor(pFable, pOptions, pServiceHash)
    {
        super(pFable, pOptions, pServiceHash);
    }
}

const ExampleObjectEditorConfiguration = (
{
    "ViewIdentifier": "ExampleObjectEditor",
    "DefaultDestinationAddress": "#ObjectEditorContainer",
    "ObjectDataAddress": "AppData.ConfigData",
    "InitialExpandDepth": 2,
    "Editable": true,
    "ShowTypeIndicators": true,
    "Renderables":
    [
        {
            "RenderableHash": "ObjectEditor-Container",
            "TemplateHash": "ObjectEditor-Container-Template",
            "DestinationAddress": "#ObjectEditorContainer",
            "RenderMethod": "replace"
        }
    ]
});
```

The subclass is empty — the demo doesn't need to override behavior,
just wants its own `ViewIdentifier` so multiple object editors could
coexist on the same page. The override block is the configuration
delta; the section's `default_configuration` supplies CSS,
`MacroTemplates`, `Templates`, and a fallback `Renderables` block.

`ObjectDataAddress: "AppData.ConfigData"` is the most important option
— it tells the view where to read its data from `this.fable`. Every
expand/collapse/edit operation resolves the path and reads/writes
in-place.

---

## Feature 2 — Initial render at depth 2

`InitialExpandDepth: 2` controls what's visible on first paint:

- Depth 0 — only the root container shows; everything collapsed.
- Depth 1 — the root expands, but `application.*` keys stay collapsed.
- Depth 2 — `application.database`, `application.logging`,
  `application.cache`, `application.metadata` all open, but `database.pool`
  / `logging.destinations[0]` / `metadata.tags` remain collapsed.

This is the "see the shape" default — the user gets a high-level
overview without scrolling through hundreds of leaf rows. Click any
toggle to expand a single subtree; click **Expand All** in the
toolbar to fully unfurl.

The seed data is shaped to make depth-2 the visually interesting
case: deeply-nested objects (`database.pool`) and arrays of objects
(`logging.destinations`) stay collapsed and show their child count in
the summary text, while the second-level scalar keys (`database.host`,
`cache.enabled`, etc.) are immediately visible.

---

## Feature 3 — The toolbar — public API in 6 buttons

The HTML toolbar's onclick handlers call the editor's public methods
directly via the global `_Pict.views.ExampleObjectEditorView`:

```html
<div class="toolbar">
    <button onclick="_Pict.views.ExampleObjectEditorView.expandAll()">Expand All</button>
    <button onclick="_Pict.views.ExampleObjectEditorView.collapseAll()">Collapse All</button>
    <button onclick="_Pict.views.ExampleObjectEditorView.expandToDepth(1)">Depth 1</button>
    <button onclick="_Pict.views.ExampleObjectEditorView.expandToDepth(2)">Depth 2</button>
    <button onclick="_Pict.views.ExampleObjectEditorView.expandToDepth(3)">Depth 3</button>
    <select onchange="setTheme(this.value)">
        <option value="basic">Basic</option>
        <option value="midnight">Midnight</option>
        <option value="blueprint">Blueprint</option>
        <option value="solarized">Solarized</option>
        <option value="terminal">Terminal</option>
        <option value="spreadsheet">Spreadsheet</option>
    </select>
</div>
```

`expandAll()` walks the data and marks every container path as
expanded; `collapseAll()` empties the expanded-paths set;
`expandToDepth(N)` clears + walks to depth N. After each, the editor
re-renders the tree from the data in `AppData.ConfigData` — no DOM
mutation, just a template-driven repaint.

These are the only host-facing methods you need for most navigation
UX. The rest of the editor's API (`setValueAtPath`, `toggleNode`,
`toggleBoolean`, `addObjectProperty`, `removeObjectProperty`,
`addArrayElement`, `moveArrayElementUp`, `moveArrayElementDown`,
`beginEdit`) is reachable via the macro templates' inline `onclick`
handlers and via direct calls from cooperating hosts.

---

## Feature 4 — Inline editing of leaves

Double-clicking a string or number leaf launches `beginEdit(path,
type)`, which replaces the value span with an input element:

```js
beginEdit(pPath, pType)
{
    // ... resolve the value span ...
    let tmpInput = document.createElement('input');
    tmpInput.type = (pType === 'number') ? 'number' : 'text';
    tmpInput.className = 'pict-oe-value-input';
    tmpInput.value = tmpInputValue;

    let tmpCommit = function()
    {
        let tmpNewValue = tmpInput.value;
        if (pType === 'number')
        {
            tmpNewValue = Number(tmpNewValue);
            if (isNaN(tmpNewValue))
            {
                tmpNewValue = 0;
            }
        }
        tmpSelf._setValueAtPath(tmpData, pPath, tmpNewValue);
        tmpSelf.renderTree();
    };

    tmpInput.addEventListener('blur', tmpCommit);
    tmpInput.addEventListener('keydown', function(pEvent)
    {
        if (pEvent.key === 'Enter')
        {
            tmpInput.blur();
        }
        else if (pEvent.key === 'Escape')
        {
            tmpInput.removeEventListener('blur', tmpCommit);
            tmpSelf.renderTree();
        }
    });

    tmpValueSpan.innerHTML = '';
    tmpValueSpan.appendChild(tmpInput);
    tmpInput.focus();
    tmpInput.select();
}
```

Two short input-lifecycle handlers — the only `addEventListener`
calls in the section — track the live input element through commit
(blur or Enter) and cancel (Escape). After commit, the tree
re-renders from the (now-updated) AppData; after cancel, the tree
re-renders unchanged.

Boolean leaves use a simpler `toggleBoolean(path)` — one click flips
the value and re-renders, no input lifecycle required. `null` is
read-only by default; replace it with a typed value via the parent
container's add control.

---

## Feature 5 — Six themes via one CSS attribute

The editor's root element carries class `pict-objecteditor`. Themes
are scoped CSS overrides keyed by an attribute selector
`.pict-objecteditor[data-theme="..."]`. The `setTheme(name)` function
in `index.html` flips the attribute:

```js
function setTheme(pThemeName)
{
    var tmpEditor = document.querySelector('.pict-objecteditor');
    if (!tmpEditor) { return; }
    if (pThemeName === 'basic')
    {
        tmpEditor.removeAttribute('data-theme');
    }
    else
    {
        tmpEditor.setAttribute('data-theme', pThemeName);
    }
}
```

Each theme is a full CSS override block sitting in `index.html`. The
**Spreadsheet** theme — a Google Sheets-like grid look — flips the
row separators, sets a serif-free font, and replaces the rounded
action buttons with subtle outlined squares:

```css
.pict-objecteditor[data-theme="spreadsheet"]
{
    background: var(--theme-color-background-panel, #FFFFFF);
    border: 1px solid #BABFC4;
    border-radius: 0;
    color: var(--theme-color-text-primary, #222222);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    font-size: 13px;
    padding: 0;
}
.pict-objecteditor[data-theme="spreadsheet"] .pict-oe-row
{
    border-radius: 0;
    border-bottom: 1px solid #E2E5E8;
    min-height: 32px;
}
.pict-objecteditor[data-theme="spreadsheet"] .pict-oe-row:nth-child(even)
{
    background: #F8F9FA;     /* zebra striping */
}
.pict-objecteditor[data-theme="spreadsheet"] .pict-oe-row:nth-child(even):hover
{
    background: #EBF2FA;
}
/* ... ~150 more lines covering toggles, type badges, action buttons,
   inline edit inputs, root-add controls ... */
```

**Terminal** goes the other direction — black background, green CRT
glow via `text-shadow`, monospace VT323 font, `text-transform:
uppercase` on booleans and nulls:

```css
.pict-objecteditor[data-theme="terminal"]
{
    background: #0A0A0A;
    border: 1px solid #1A3A1A;
    color: #33FF33;
    font-family: 'VT323', 'Lucida Console', 'Courier New', monospace;
    text-shadow: 0 0 4px rgba(51, 255, 51, 0.3);
    box-shadow: inset 0 0 60px rgba(0, 30, 0, 0.5);
}
.pict-objecteditor[data-theme="terminal"] .pict-oe-value-string
{
    color: #33FF33;
}
.pict-objecteditor[data-theme="terminal"] .pict-oe-value-number
{
    color: #33CCFF;
    text-shadow: 0 0 4px rgba(51, 204, 255, 0.3);
}
.pict-objecteditor[data-theme="terminal"] .pict-oe-value-boolean
{
    color: #FF6633;
    text-shadow: 0 0 4px rgba(255, 102, 51, 0.3);
}
```

No JavaScript involved — the section's macro templates emit the same
HTML regardless of theme; the theme's CSS reskins everything.

---

## Feature 6 — Theme-aware default styling via CSS custom properties

The section's built-in CSS is **not hardcoded** — every color resolves
through a `var(--theme-color-*, <fallback>)` chain. From
`Pict-Section-ObjectEditor-DefaultConfiguration.js`:

```css
.pict-objecteditor
{
    color: var(--theme-color-text-primary, #3D3229);
    background: var(--theme-color-background-panel, #FDFCFA);
    border: 1px solid var(--theme-color-border-default, #E8E3DA);
}
.pict-oe-value-string  { color: var(--theme-color-syntax-string,  #2E7D74); }
.pict-oe-value-number  { color: var(--theme-color-syntax-number,  #3B6DAA); }
.pict-oe-value-boolean { color: var(--theme-color-syntax-keyword, #8B5E3C); }
.pict-oe-value-null    { color: var(--theme-color-syntax-keyword, #B0A89E); }
.pict-oe-action-remove
{
    border-color: var(--theme-color-status-error, #E8C8C8);
    background: var(--theme-color-background-hover, #FAF0F0);
    color: var(--theme-color-status-error, #A04040);
}
```

This means the editor cooperates with `pict-section-theme` out of the
box — drop the section into a themed shell and the editor's colors
follow the active theme automatically. The hand-picked hex fallbacks
ensure the editor still looks coordinated when no theme provider is
active (the case for this demo's **Basic** theme).

The six demo themes deliberately ignore the custom-property system
and override the colors directly — that's intentional, to show how a
host can layer its own visual identity on top of the framework
defaults. A production app with `pict-section-theme` installed would
typically define theme tokens for the relevant `--theme-color-*`
properties instead.

---

## Feature 7 — Macro templates for fragment-by-fragment overrides

The editor's HTML is composed from a `MacroTemplates.Node` map —
named template strings for every fragment of a row:

```js
MacroTemplates:
{
    Node:
    {
        RowOpen:  '<div class="pict-oe-row" style="padding-left:{~D:Record.PaddingLeft~}px" data-path="{~D:Record.EscapedPath~}">',
        RowClose: '</div>',
        Toggle:   '<span class="pict-oe-toggle" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].toggleNode(\'{~D:Record.EscapedPath~}\')">{~D:Record.ToggleArrow~}</span>',
        Spacer:   '<span class="pict-oe-spacer"></span>',
        KeyName:  '<span class="pict-oe-key">{~D:Record.EscapedKey~}</span>',
        KeyIndex: '<span class="pict-oe-key"><span class="pict-oe-array-index">{~D:Record.ArrayIndex~}</span></span>',
        Separator:'<span class="pict-oe-separator">:</span>',
        TypeBadge:'<span class="pict-oe-type-badge">{~D:Record.TypeLabel~}</span>',
        Summary:  '<span class="pict-oe-summary">{~D:Record.SummaryText~}</span>',
        ValueStringEditable: '<span class="pict-oe-value pict-oe-value-string" ondblclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginEdit(\'{~D:Record.EscapedPath~}\', \'string\')" title="{~D:Record.EscapedTitle~}">{~D:Record.EscapedValue~}</span>',
        ValueStringReadOnly: '<span class="pict-oe-value pict-oe-value-string" title="{~D:Record.EscapedTitle~}">{~D:Record.EscapedValue~}</span>',
        ValueBooleanEditable: '<span class="pict-oe-value pict-oe-value-boolean" style="cursor:pointer" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].toggleBoolean(\'{~D:Record.EscapedPath~}\')">{~D:Record.DisplayValue~}</span>',
        ButtonRemove: '<span class="pict-oe-action-btn pict-oe-action-remove" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].removeNode(\'{~D:Record.EscapedPath~}\')" title="Remove">×</span>',
        ButtonAddObject: '<span class="pict-oe-action-btn pict-oe-action-add" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginAddToObject(\'{~D:Record.EscapedPath~}\')" title="Add">+</span>',
        ButtonMoveUp: '<span class="pict-oe-action-btn pict-oe-action-move" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].moveArrayElementUp(\'{~D:Record.EscapedArrayPath~}\', {~D:Record.ArrayIndex~})" title="Move up">▲</span>',
        // ... more
    }
}
```

The fragments compose into per-type Templates like
`ObjectEditor-Node-String` and `ObjectEditor-Node-Object`. A host that
wants to add a "lock this value" button beside Remove would override
just `ButtonRemove` (or add a sibling fragment) without re-implementing
the whole row template.

`Context[0]` resolves to the editor view itself, which is how the
inline `onclick` handlers reach back into the view: `{~P~}.views['<hash>'].method(...)`.
The `<hash>` is the view's hash (`ExampleObjectEditor` in this demo),
so the same templates work for any host that subclasses the section
with its own `ViewIdentifier`.

---

## Running the example

```bash
cd example_applications/json_editor
npm install
npm run build      # quack build → dist/object_editor_example.min.js
# Open dist/index.html in a browser, or serve dist/ statically.
```

No backend, no schema validation, no persistence — every mutation
lives in `AppData.ConfigData` for the session. Reloading resets to
the seed data.

## Things to try in the running app

- **Open the configuration tree** — depth 2 is the default. Notice
  the type badges (`obj`, `arr`) on container keys and the child
  counts in the summary text (`{6} keys`, `[4]`).
- **Click any `▼` / `▶` triangle** — expand/collapse just that
  subtree. Click again to revert. Indentation is `IndentPixels: 20`
  per depth level.
- **Click `Expand All`** — every container opens, even
  `logging.destinations[0]`, `database.pool`, `metadata.tags`.
- **Click `Depth 1`** — only the root expands; everything else
  collapses. Click `Depth 3` to go deeper.
- **Double-click a string value** (e.g. `application.name`) — an input
  appears. Type a new value, press Enter to commit. Escape to cancel.
- **Double-click a number** (`application.port`) — same input pattern
  with `type="number"`.
- **Click a boolean** (`application.debug`) — flips instantly between
  `true` and `false`. No double-click needed.
- **Hover over any row** — the action buttons appear in the right
  margin: `×` to remove, `+` to add (containers only), `▲ ▼` to
  reorder (array elements only). Hover the root container to see the
  `+ add property` action at the very top.
- **Switch themes via the dropdown** — Basic → Midnight → Blueprint
  → Solarized → Terminal → Spreadsheet. Each looks completely
  different; the HTML and behavior don't change.
- **Click `+ add property`** on the root → type a new key, pick a
  type from the dropdown, hit Enter. A new node appears immediately;
  the data lives in `AppData.ConfigData`.
- **Move array elements** — expand `application.features` or
  `metadata.tags`, hover a row, click `▲` / `▼` to reorder.

## Takeaways

1. **The editor is a data viewer, not a data store.** Mutations write
   straight to `AppData.<address>`. Hosts that need persistence,
   undo/redo, or schema validation layer those on top — the view
   doesn't impose them.
2. **`InitialExpandDepth` is the discoverability lever.** Depth 2 is
   the sweet spot for "show the shape, hide the detail" defaults;
   depth 1 for "let the user drill in"; full expansion for
   debug/inspect use cases.
3. **Theming is decoupled from rendering.** The macro templates emit
   stable class names; themes are CSS-only. Switching themes never
   re-renders the tree.
4. **CSS custom properties bridge framework themes.** The section's
   default colors resolve through `var(--theme-color-*)` chains, so
   `pict-section-theme` themes flow through without the editor
   knowing they exist.
5. **The action surface is wide.** The toolbar shows three (expand /
   collapse / depth); the row hover shows another four (add / remove
   / move-up / move-down); the value spans support another two
   (edit / toggle). All call into the view's public API — there's no
   "what can the user do?" magic.

## Related documentation

- [Overview](../../README.md) — what the section is and what it does
- [Configuration Reference](../../Configuration.md) — every view option in detail
- [API Reference](../../API-Reference.md) — every public method (`expandAll`, `collapseAll`, `expandToDepth`, `toggleNode`, `setValueAtPath`, `addObjectProperty`, `removeObjectProperty`, `addArrayElement`, …)
- [Styling and Themes](../../Styling-and-Themes.md) — the CSS custom-property contract the section honors
- [Usage in a Pict Application](../../Usage-Pict-Application.md) — host-side recipes (registering, theming, integrating)
- [Usage in Plain JavaScript](../../Usage-Plain-JavaScript.md) — embedding without the full Pict bootstrap
