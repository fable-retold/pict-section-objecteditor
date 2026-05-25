// Application Code for the Object Editor playground.
//
// `Base` is the synthesized PictApplication wrapper that registers the
// ObjectEditor view from your Pict Config (under `ObjectEditorViewConfig`).
// Return a class that extends `Base` to customize lifecycle hooks or
// register additional views/providers.
//
// The wrapper is generated at runtime — there is no per-module
// Application class to look at; the iframe builds it from the
// WrapperKind: "view" declaration in _playground.json.
//
// Example: read the data tree back out after each render and log it
// so you can see the JSON in the browser console.
//
return class extends Base
{
	onAfterInitialize()
	{
		super.onAfterInitialize();
		console.log('[playground] Initial ConfigData =', this.pict.AppData.ConfigData);
	}
};
