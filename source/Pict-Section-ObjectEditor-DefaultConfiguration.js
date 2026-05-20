module.exports = (
{
	ViewIdentifier: 'Pict-ObjectEditor',

	DefaultRenderable: 'ObjectEditor-Container',
	DefaultDestinationAddress: '#ObjectEditor-Container',

	AutoRender: false,

	// Address in AppData where the JSON object lives
	ObjectDataAddress: false,

	// Maximum depth to auto-expand on initial load
	InitialExpandDepth: 1,

	// Whether editing is enabled (vs read-only inspector mode)
	Editable: true,

	// Whether to show type indicator badges
	ShowTypeIndicators: true,

	// Indentation pixels per depth level
	IndentPixels: 20,

	CSS: /*css*/`
.pict-objecteditor
{
	font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace;
	font-size: 13px;
	line-height: 1.5;
	color: var(--theme-color-text-primary, #3D3229);
	background: var(--theme-color-background-panel, #FDFCFA);
	border: 1px solid var(--theme-color-border-default, #E8E3DA);
	border-radius: 6px;
	padding: 8px 0;
	overflow: auto;
}
.pict-oe-row
{
	display: flex;
	align-items: center;
	padding: 2px 12px 2px 0;
	min-height: 26px;
	cursor: default;
	border-radius: 3px;
}
.pict-oe-row:hover
{
	background: var(--theme-color-background-hover, #F5F0E8);
}
.pict-oe-toggle
{
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	cursor: pointer;
	color: var(--theme-color-text-muted, #8A7F72);
	font-size: 10px;
	flex-shrink: 0;
	user-select: none;
	border-radius: 3px;
	transition: color 0.1s;
}
.pict-oe-toggle:hover
{
	background: var(--theme-color-border-default, #E8E3DA);
	color: var(--theme-color-text-primary, #3D3229);
}
.pict-oe-spacer
{
	display: inline-block;
	width: 16px;
	flex-shrink: 0;
}
.pict-oe-key
{
	color: var(--theme-color-syntax-property, #9E6B47);
	flex-shrink: 0;
}
.pict-oe-separator
{
	color: var(--theme-color-text-muted, #8A7F72);
	margin: 0 8px;
	flex-shrink: 0;
}
.pict-oe-value
{
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.pict-oe-value-string
{
	color: var(--theme-color-syntax-string, #2E7D74);
}
.pict-oe-value-string::before
{
	content: '"';
	color: var(--theme-color-syntax-string, #A8CFC9);
}
.pict-oe-value-string::after
{
	content: '"';
	color: var(--theme-color-syntax-string, #A8CFC9);
}
.pict-oe-value-number
{
	color: var(--theme-color-syntax-number, #3B6DAA);
}
.pict-oe-value-boolean
{
	color: var(--theme-color-syntax-keyword, #8B5E3C);
	font-weight: 600;
}
.pict-oe-value-null
{
	color: var(--theme-color-syntax-keyword, #B0A89E);
	font-style: italic;
}
.pict-oe-summary
{
	color: var(--theme-color-text-placeholder, #B0A89E);
	margin-left: 6px;
	font-size: 12px;
}
.pict-oe-type-badge
{
	display: inline-block;
	font-size: 9px;
	padding: 0 4px;
	border-radius: 3px;
	background: var(--theme-color-background-tertiary, #F0ECE4);
	color: var(--theme-color-text-muted, #8A7F72);
	margin-left: 6px;
	line-height: 16px;
	vertical-align: middle;
}
.pict-oe-value-input
{
	background: var(--theme-color-background-panel, #FFF);
	border: 1px solid var(--theme-color-syntax-string, #2E7D74);
	border-radius: 3px;
	padding: 1px 4px;
	font-family: inherit;
	font-size: inherit;
	color: inherit;
	outline: none;
	min-width: 80px;
}
.pict-oe-value-input:focus
{
	border-color: var(--theme-color-syntax-number, #3B6DAA);
	box-shadow: 0 0 0 2px rgba(59, 109, 170, 0.15);
}
.pict-oe-array-index
{
	color: var(--theme-color-text-muted, #8A7F72);
	font-size: 11px;
}
.pict-oe-empty
{
	color: var(--theme-color-text-placeholder, #B0A89E);
	font-style: italic;
	padding: 8px 12px;
}
.pict-oe-actions
{
	margin-left: auto;
	padding-left: 12px;
	padding-right: 4px;
	opacity: 0.4;
	transition: opacity 0.15s;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	gap: 5px;
}
.pict-oe-row:hover .pict-oe-actions
{
	opacity: 1;
}
.pict-oe-action-btn
{
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 22px;
	height: 22px;
	padding: 0 5px;
	border-radius: 3px;
	border: 1px solid var(--theme-color-border-default, #DDD8CF);
	background: var(--theme-color-background-hover, #F5F0E8);
	cursor: pointer;
	font-size: 12px;
	color: var(--theme-color-text-muted, #8A7F72);
	user-select: none;
	box-sizing: border-box;
}
.pict-oe-action-btn:hover
{
	background: var(--theme-color-background-hover, #E8E3DA);
	border-color: var(--theme-color-border-default, #C5BFAE);
	color: var(--theme-color-text-primary, #3D3229);
}
.pict-oe-action-remove
{
	border-color: var(--theme-color-status-error, #E8C8C8);
	background: var(--theme-color-background-hover, #FAF0F0);
	color: var(--theme-color-status-error, #A04040);
}
.pict-oe-action-remove:hover
{
	background: var(--theme-color-background-hover, #F0D6D6);
	border-color: var(--theme-color-status-error, #D4A0A0);
	color: var(--theme-color-status-error, #A04040);
}
.pict-oe-action-move
{
	font-size: 9px;
}
.pict-oe-action-move:hover
{
	background: var(--theme-color-background-hover, #D6E4F0);
	border-color: var(--theme-color-status-info, #A8C4DA);
	color: var(--theme-color-status-info, #3B6DAA);
}
.pict-oe-action-add
{
	border-color: var(--theme-color-status-success, #C8D8C8);
	background: var(--theme-color-background-hover, #F0F5F0);
	color: var(--theme-color-status-success, #5A7A5A);
}
.pict-oe-action-add:hover
{
	background: var(--theme-color-background-hover, #D6E8D6);
	border-color: var(--theme-color-status-success, #A0C0A0);
	color: var(--theme-color-status-success, #3D5C3D);
}
.pict-oe-key-input
{
	background: var(--theme-color-background-panel, #FFF);
	border: 1px solid var(--theme-color-syntax-property, #9E6B47);
	border-radius: 3px;
	padding: 1px 4px;
	font-family: inherit;
	font-size: inherit;
	color: var(--theme-color-syntax-property, #9E6B47);
	outline: none;
	min-width: 60px;
	margin-left: 6px;
}
.pict-oe-key-input:focus
{
	border-color: var(--theme-color-syntax-number, #3B6DAA);
	box-shadow: 0 0 0 2px rgba(59, 109, 170, 0.15);
}
.pict-oe-type-select
{
	background: var(--theme-color-background-panel, #FFF);
	border: 1px solid var(--theme-color-border-default, #C5BFAE);
	border-radius: 3px;
	padding: 1px 4px;
	font-family: inherit;
	font-size: inherit;
	color: var(--theme-color-text-primary, #3D3229);
	outline: none;
	margin-left: 6px;
	cursor: pointer;
}
.pict-oe-type-select:focus
{
	border-color: var(--theme-color-syntax-number, #3B6DAA);
	box-shadow: 0 0 0 2px rgba(59, 109, 170, 0.15);
}
.pict-oe-root-add
{
	display: flex;
	align-items: center;
	padding: 4px 12px;
	min-height: 26px;
	cursor: default;
}
.pict-oe-root-add .pict-oe-action-btn
{
	width: auto;
	white-space: nowrap;
	padding: 0 8px;
}
`,

	MacroTemplates:
	{
		Node:
		{
			RowOpen: '<div class="pict-oe-row" style="padding-left:{~D:Record.PaddingLeft~}px" data-path="{~D:Record.EscapedPath~}">',
			RowClose: '</div>',
			Toggle: '<span class="pict-oe-toggle" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].toggleNode(\'{~D:Record.EscapedPath~}\')">{~D:Record.ToggleArrow~}</span>',
			Spacer: '<span class="pict-oe-spacer"></span>',
			KeyName: '<span class="pict-oe-key">{~D:Record.EscapedKey~}</span>',
			KeyIndex: '<span class="pict-oe-key"><span class="pict-oe-array-index">{~D:Record.ArrayIndex~}</span></span>',
			Separator: '<span class="pict-oe-separator">:</span>',
			TypeBadge: '<span class="pict-oe-type-badge">{~D:Record.TypeLabel~}</span>',
			Summary: '<span class="pict-oe-summary">{~D:Record.SummaryText~}</span>',
			ValueStringEditable: '<span class="pict-oe-value pict-oe-value-string" ondblclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginEdit(\'{~D:Record.EscapedPath~}\', \'string\')" title="{~D:Record.EscapedTitle~}">{~D:Record.EscapedValue~}</span>',
			ValueStringReadOnly: '<span class="pict-oe-value pict-oe-value-string" title="{~D:Record.EscapedTitle~}">{~D:Record.EscapedValue~}</span>',
			ValueNumberEditable: '<span class="pict-oe-value pict-oe-value-number" ondblclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginEdit(\'{~D:Record.EscapedPath~}\', \'number\')">{~D:Record.EscapedValue~}</span>',
			ValueNumberReadOnly: '<span class="pict-oe-value pict-oe-value-number">{~D:Record.EscapedValue~}</span>',
			ValueBooleanEditable: '<span class="pict-oe-value pict-oe-value-boolean" style="cursor:pointer" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].toggleBoolean(\'{~D:Record.EscapedPath~}\')">{~D:Record.DisplayValue~}</span>',
			ValueBooleanReadOnly: '<span class="pict-oe-value pict-oe-value-boolean">{~D:Record.DisplayValue~}</span>',
			ValueNull: '<span class="pict-oe-value pict-oe-value-null">null</span>',
			ActionsOpen: '<span class="pict-oe-actions">',
			ActionsClose: '</span>',
			ButtonRemove: '<span class="pict-oe-action-btn pict-oe-action-remove" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].removeNode(\'{~D:Record.EscapedPath~}\')" title="Remove">\u00D7</span>',
			ButtonAddObject: '<span class="pict-oe-action-btn pict-oe-action-add" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginAddToObject(\'{~D:Record.EscapedPath~}\')" title="Add">+</span>',
			ButtonAddArray: '<span class="pict-oe-action-btn pict-oe-action-add" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginAddToArray(\'{~D:Record.EscapedPath~}\')" title="Add">+</span>',
			ButtonMoveUp: '<span class="pict-oe-action-btn pict-oe-action-move" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].moveArrayElementUp(\'{~D:Record.EscapedArrayPath~}\', {~D:Record.ArrayIndex~})" title="Move up">\u25B2</span>',
			ButtonMoveDown: '<span class="pict-oe-action-btn pict-oe-action-move" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].moveArrayElementDown(\'{~D:Record.EscapedArrayPath~}\', {~D:Record.ArrayIndex~})" title="Move down">\u25BC</span>',
			RootAddObject: '<div class="pict-oe-root-add" data-path=""><span class="pict-oe-action-btn pict-oe-action-add" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginAddToObject(\'\')" title="Add property">+ add property</span></div>',
			RootAddArray: '<div class="pict-oe-root-add" data-path=""><span class="pict-oe-action-btn pict-oe-action-add" onclick="{~P~}.views[\'{~D:Context[0].Hash~}\'].beginAddToArray(\'\')" title="Add element">+ add element</span></div>'
		}
	},

	Templates:
	[
		{
			Hash: 'ObjectEditor-Container-Template',
			Template: '<div class="pict-objecteditor" id="ObjectEditor-Tree-{~D:Context[0].Hash~}"></div>'
		},
		{
			Hash: 'ObjectEditor-Node-String',
			Template: '{~D:Record.Macro.RowOpen~}{~D:Record.Macro.Spacer~}{~D:Record.Macro.Key~}{~D:Record.Macro.Separator~}{~D:Record.Macro.Value~}{~D:Record.Macro.Actions~}{~D:Record.Macro.RowClose~}'
		},
		{
			Hash: 'ObjectEditor-Node-Number',
			Template: '{~D:Record.Macro.RowOpen~}{~D:Record.Macro.Spacer~}{~D:Record.Macro.Key~}{~D:Record.Macro.Separator~}{~D:Record.Macro.Value~}{~D:Record.Macro.Actions~}{~D:Record.Macro.RowClose~}'
		},
		{
			Hash: 'ObjectEditor-Node-Boolean',
			Template: '{~D:Record.Macro.RowOpen~}{~D:Record.Macro.Spacer~}{~D:Record.Macro.Key~}{~D:Record.Macro.Separator~}{~D:Record.Macro.Value~}{~D:Record.Macro.Actions~}{~D:Record.Macro.RowClose~}'
		},
		{
			Hash: 'ObjectEditor-Node-Null',
			Template: '{~D:Record.Macro.RowOpen~}{~D:Record.Macro.Spacer~}{~D:Record.Macro.Key~}{~D:Record.Macro.Separator~}{~D:Record.Macro.Value~}{~D:Record.Macro.Actions~}{~D:Record.Macro.RowClose~}'
		},
		{
			Hash: 'ObjectEditor-Node-Object',
			Template: '{~D:Record.Macro.RowOpen~}{~D:Record.Macro.Toggle~}{~D:Record.Macro.Key~}{~D:Record.Macro.TypeBadge~}{~D:Record.Macro.Summary~}{~D:Record.Macro.Actions~}{~D:Record.Macro.RowClose~}'
		},
		{
			Hash: 'ObjectEditor-Node-Array',
			Template: '{~D:Record.Macro.RowOpen~}{~D:Record.Macro.Toggle~}{~D:Record.Macro.Key~}{~D:Record.Macro.TypeBadge~}{~D:Record.Macro.Summary~}{~D:Record.Macro.Actions~}{~D:Record.Macro.RowClose~}'
		}
	],

	Renderables:
	[
		{
			RenderableHash: 'ObjectEditor-Container',
			TemplateHash: 'ObjectEditor-Container-Template',
			DestinationAddress: '#ObjectEditor-Container',
			RenderMethod: 'replace'
		}
	]
});
