// ==UserScript==
// @author      Eccenux
// @name        IITC plugin: FS puzzle helper
// @id          iitc-plugin-fs-puzzle-helper@eccenux
// @category    Misc
// @namespace   pl.enux.iitc
// @version     1.0.0
// @description [1.0.0] FS puzzle helper
// @updateURL   https://github.com/Eccenux/iitc-plugin-fs-puzzle-helper/raw/master/my-plugin/dist/script.meta.js
// @downloadURL https://github.com/Eccenux/iitc-plugin-fs-puzzle-helper/raw/master/my-plugin/dist/script.user.js
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @match       https://intel.ingress.com/*
// @match       https://intel.ingress.com/*
// @grant       none
// ==/UserScript==

const containerId = 'fsPuzzleHelper-container';

const portalHtml = `
	<div id="${containerId}" style="
		display: grid;
		grid-template-columns: max-content auto min-content;
		grid-gap: .5em;
		padding: .5em 1em 0
	">
		<a class="copy" style="
			display: inline-block;
			vertical-align: middle;
			line-height: 24px;
		">FS puzzle 📋</a>
		<input class="data" type="text" />
	</div>
`;

/**
 * Main plugin class.
 */
// eslint-disable-next-line no-unused-vars
class MyPlugin {
	constructor (codeName) {
		this.codeName = codeName;
		this.portalHtml = portalHtml;
	}

	setup() {
		console.log('MyPlugin setup', this.codeName);
		window.addHook('portalDetailsUpdated', () => {
			this.onPortalDetailsUpdated();
		});	
	}
	
	/**
	 * When portal is loaded.
	 * 
	 * Note. Portal details element is re-created when loading portals.
	 */
	onPortalDetailsUpdated () {
		$('#portaldetails > .imgpreview').after(this.portalHtml);
		let container = document.getElementById(containerId);
		let dataField = container.querySelector('.data');
		let copyButton = container.querySelector('.copy');
	
		let guid = window.selectedPortal;
		let details = portalDetail.get(guid);

		let nickname = window.PLAYER.nickname;
		let title = details.title;
		let url = document.querySelector('#portaldetails .linkdetails a')?.href;
		dataField.value = `${title}\t${nickname}\t${url}`;

		copyButton.onclick = () => {
			//this.copyText(dataField.value);
			this.copyTextField(dataField);
		};
	}

	/**
	 * Copy text field contents.
	 * @param {Element|String} source Element or selector.
	 */
	copyTextField(source) {
		if (typeof source === 'string') {
			source = document.querySelector(source);
		}
		source.select();
		document.execCommand("copy");
	}

	/**
	 * Copy using clipboard API.
	 * 
	 * Don't seem to be working on Firefox 😢... Is behind a flag.
	 * 
	 * @param {String} text 
	 */
	copyText(text) {
		let data = [new ClipboardItem({ "text/plain": text })];
		navigator.clipboard.write(data).then(function() {
			console.log('text copied');
		}, function() {
			console.warn('failed to copy');
		});
	}
    
}

/* eslint-disable no-undef */

// WARNING!!! Change `fsPuzzleHelper` to a unique code name of the plugin.

let myPlugin = new MyPlugin('fsPuzzleHelper');

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//use own namespace for plugin
window.plugin.fsPuzzleHelper = myPlugin;

//////////////////////////////////////////////////////////////////////
//WRAPPER START //////////////////////////////////////////////////////

/**
 * IITC plugin wrapper.
 * 
 * Note! The `wrapper` is injected directly to the Ingress Intel web page.
 * That is why you need to use `window.plugin.fsPuzzleHelper` at least for hooks setup.
 */
function wrapper(plugin_info) {

	//////////////////////////////////////////////////////////////////////
	//PLUGIN START ///////////////////////////////////////////////////////

	/**
	 * Some setup (when iitc is ready)
	 * 
	 * See notes for the wrapper!
	 */
	function setup() {
		console.log('fsPuzzleHelper - init')
		window.plugin.fsPuzzleHelper.setup();
	}

	//PLUGIN END /////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////

	setup.info = plugin_info; //add the script info data to the function as a property
	if(!window.bootPlugins) window.bootPlugins = [];
	window.bootPlugins.push(setup);
	// if IITC has already booted, immediately run the 'setup' function
	if(window.iitcLoaded && typeof setup === 'function') setup();
}

//WRAPPER END ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);