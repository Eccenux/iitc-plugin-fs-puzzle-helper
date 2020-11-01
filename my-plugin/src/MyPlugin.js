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
	
		let nickname = window.PLAYER.nickname;
		let title = document.querySelector('#portaldetails .title')?.textContent;
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
