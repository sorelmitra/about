let LOGLEVEL = 4;

let LOG = (function () {
	return {
		debug: function() {
			if (LOGLEVEL < 4) return;
			var args = Array.prototype.slice.call(arguments);
			console.log.apply(console, args);
		},
		info: function() {
			if (LOGLEVEL < 3) return;
			var args = Array.prototype.slice.call(arguments);
			console.log.apply(console, args);
		},
		warn: function() {
			if (LOGLEVEL < 2) return;
			var args = Array.prototype.slice.call(arguments);
			console.warn.apply(console, args);
		},
		error: function() {
			if (LOGLEVEL < 1) return;
			var args = Array.prototype.slice.call(arguments);
			console.error.apply(console, args);
		}
	}
}());

function entryPoint() {
	createContactBox();
	createFooter();
	createModalElements("id-menu-modal", "id-modal-root", "id-modal-close-button", "modal-menu");
	createMenuItems("modal-menu");
	createMenuBar();
}

const imgUiMenuOn = 'https://live.staticflickr.com/65535/48710978106_df47bcb4d6_o.png';
const imgUiMenuOff = 'https://live.staticflickr.com/65535/48711141977_7c603ce013_o.png';
const imgUiMenuOffLit = 'https://live.staticflickr.com/65535/48710978106_df47bcb4d6_o.png';
const imgUiAvatar = 'https://live.staticflickr.com/65535/48705589673_ce783b381c_o.png';
let imgUiLang = {
	RO: 'https://live.staticflickr.com/65535/48705590238_e0a17e83bd_o.png',
	EN: 'https://live.staticflickr.com/65535/48706045511_f0557d72f9_o.png',
	ES: 'https://live.staticflickr.com/65535/48710362622_258acb7a9d_o.png',
};
let domain = null;
let knownLanguages = ['RO', 'EN', /*'ES'*/]
let texts = {
	'home': {
		'RO': 'ACASĂ',
		'EN': 'HOME'
	},
	'what': {
		'RO': 'CE POT FACE PENTRU TINE',
		'EN': 'WHAT I CAN DO FOR YOU'
	},
	'work': {
		'RO': 'PORTOFOLIU',
		'EN': 'PORTFOLIO'
	},
	'freetime': {
		'RO': 'TIMP LIBER',
		'EN': 'FREE TIME'
	},
	'contact': {
		'RO': 'CONTACT',
		'EN': 'CONTACT'
	},
	'copyright': {
		'RO': '<b>Notă</b>: Tot conținutul acestui site este © Sorel Mitra și nu poate fi folosit sub nici o formă fără acordul meu scris.',
		'EN': '<b>Note</b>: All content on this site is © Sorel Mitra may not be used without my written approval.'
	}
}

function createMenuBar() {
	createMenuBarForNormalPage();
	createLanguageForHomePage();
}

function createMenuBarForNormalPage() {
	let isMenuOn = false;

	if (!$('#id-menu-bar').length) return;

	createHeader();

	$('#id-menu-bar').empty();
	$('#id-menu-bar').append(
		$('<div/>', {
			class: 'menubar-box-button',
		}).append(
			$('<img/>', {
				id: 'id-menu-button',
				src: imgUiMenuOff,
				class: 'menubar-button',
			}).hover(
				function() {
					if (isMenuOn) {
						$(this).attr('src', imgUiMenuOn);
						return;
					}
					$(this).attr('src', imgUiMenuOffLit);
				},
				function() {
					if (isMenuOn) {
						$(this).attr('src', imgUiMenuOn);
						return;
					}
					$(this).attr('src', imgUiMenuOff);
				}
			).click(
				function() {
					menuOn(true, true);
				}
			),
		),
		$('<div/>', {
			class: 'menubar-box-avatar',
		}).append(
			$('<img/>', {
				onclick: 'gotoPage("index.html")',
				src: imgUiAvatar,
				class: 'menubar-avatar',
			}),
		),
		createLanguageBox(),
	);

	let menuButton = $("#id-menu-button");
	let modal = document.getElementById("id-modal-root");
	let closeButton = document.getElementById("id-modal-close-button");

	function menuOn(on, lit) {
		if (on) {
			isMenuOn = true;
			$(menuButton).attr('src', imgUiMenuOn);
			animateAppear(modal, "modal-menu");
		} else {
			isMenuOn = false;
			if (lit) {
				$(menuButton).attr('src', imgUiMenuOffLit);
			} else {
				$(menuButton).attr('src', imgUiMenuOff);
			}
			animateDisappear(modal, "modal-menu");
		}
	}

	window.onclick = function(event) {
		if (event.target == modal) {
			menuOn(false, false);
		}
	}
	closeButton.onclick = function() {
		menuOn(false, false);
	}
}

function createLanguageBox() {
	return $('<div/>', {
		class: 'menubar-box-language',
	}).append(
		$('<img/>', {
			src: getLangImageSrc(),
			class: 'menubar-language',
			onclick: 'rotateLanguage()'
		}),
	)
}

function createLanguageForHomePage() {
	$('#home-language-container').html(
		createLanguageBox()
	)
}

function rotateLanguage() {
	let oldLang = computeExistingLang();
	let index = knownLanguages.indexOf(oldLang);
	if (index == NaN) {
		LOG.debug(`Language ${oldLang} is not recognized among ${knownLanguages}`);
		return;
	}

	index++;
	if (index >= knownLanguages.length) {
			index = 0;
	}
	let newLang = knownLanguages[index];
	LOG.debug(`Language from ${oldLang} to ${newLang}; index ${index}`);
	applyLanguage(newLang);
}

function applyLanguage(lang) {
	let currentFilename = getCurrentFilename();
	let newUrl = computeNewUrl(currentFilename, lang, false);
	window.open(newUrl, "_self");
}

function getCurrentFilename() {
	let url = window.location.href;
	let lastSlashPos = url.lastIndexOf('/');
    let filename = url.substring(lastSlashPos + 1);
	return filename;
}

function gotoPage(filename) {
	let lang = computeExistingLang();
	let newUrl = computeNewUrl(filename, lang, true);
	window.open(newUrl, "_self");
}

function isInSubFolder(url) {
	let lastSlashPos = url.lastIndexOf('/');
    let path = url.substring(0, lastSlashPos);
	lastSlashPos = path.lastIndexOf('/');
	let subFolder = path.substring(lastSlashPos + 1);
	return !(["webapp", "sorelmitra.com"].includes(subFolder));
}

function computeNewUrl(filename, lang, computePath) {
	let dotPos = filename.lastIndexOf('.');
	let ext = filename.substring(dotPos + 1);
	let dashPos = filename.lastIndexOf('-');
	let name = filename.substring(0, dotPos);
	if (dashPos > 0) {
		name = filename.substring(0, dashPos);
	}
	if (name.length < 1) {
		name = "index";
	}
	if (ext.length < 1) {
		ext = "html";
	}
	let newFilename = `${name}-${lang}.${ext}`;
	if (lang == "EN") {
		newFilename = `${name}.${ext}`;
	}
	if (computePath) {
		let url = window.location.href;
		if (isInSubFolder(url)) {
			newFilename = `../${newFilename}`;
		}
	}
	LOG.debug(`Filename for new lang ${lang}: ${newFilename}`);
	return newFilename;
}

function computeExistingLang() {
	let url = window.location.href;
	let lastSlashPos = url.lastIndexOf('/');
    let filename = url.substring(lastSlashPos + 1);
	let dotPos = filename.lastIndexOf('.');
	let dashPos = filename.lastIndexOf('-');
	let langPart = "EN";
	if (dashPos > 0) {
		langPart = filename.substring(dashPos + 1, dotPos);
	}
	LOG.debug(`Current lang <${langPart}>`);
	return langPart;
}

function getLangImageSrc() {
	let lang = computeExistingLang();
	return imgUiLang[lang];
}

function createModalElements(modalParentId, modalRootId, modalCloseButtonId, modalPartId) {
	$(`#${modalParentId}`).empty();
	$(`#${modalParentId}`).append(
		$('<div/>', {
			id: modalRootId,
			class: `${modalPartId}`
		}).append(
			$('<div/>', {
				id: `id-${modalPartId}-box`,
				class: `${modalPartId}-box`
			}).append(
				$('<div/>', {
					class: `${modalPartId}-header`
				}).append(
					$('<div/>', {
						id: modalCloseButtonId,
						class: `${modalPartId}-close`
					}).html('&times;'),
				),
				$('<div/>', {
					id: `id-${modalPartId}-content`,
					class: `${modalPartId}-content`
				}),
			),
		),
	);
}

function createMenuItems(modalPartId) {
	$(`#id-${modalPartId}-content`).empty();
	$(`#id-${modalPartId}-content`).append(
		$('<div/>', {
			class: 'menu-item-icons'
		}).append(
			$('<a/>', {
				href: 'https://www.linkedin.com/in/sorel-mitra-1a82454/',
				class: 'menu-item-one-icon'
			}).append(
				$('<img/>', {
					src: 'https://live.staticflickr.com/65535/48712318036_befd310f01_o.png',
					height: '24px'
				})
			),
			$('<a/>', {
				href: 'https://stackoverflow.com/users/6239668/riverhorse',
				class: 'menu-item-one-icon'
			}).append(
				$('<img/>', {
					src: 'https://live.staticflickr.com/65535/48705591333_1126f613d5_o.png',
					height: '24px'
				})
			),
			$('<a/>', {
				href: 'https://github.com/sorelmitra',
				class: 'menu-item-one-icon'
			}).append(
				$('<img/>', {
					src: 'https://live.staticflickr.com/65535/48707331477_f23f81e88b_o.png',
					height: '24px'
				})
			),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				onclick: 'gotoPage("index.html")',
				class: 'menu-item-link'
			}).html(getText('home')),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				onclick: 'gotoPage("what.html")',
				class: 'menu-item-link'
			}).html(getText('what')),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				onclick: 'gotoPage("work.html")',
				class: 'menu-item-link'
			}).html(getText('work')),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				onclick: 'gotoPage("freetime/index.html")',
				class: 'menu-item-link'
			}).html(getText('freetime')),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				onclick: 'gotoPage("contact.html")',
				class: 'menu-item-link'
			}).html(getText('contact')),
		),
	);
}

function getText(key) {
	let lang = computeExistingLang();
	return texts[key][lang];
}

function animateAppear(modal, modalPartId) {
	let modalBox = $(`.${modalPartId}-box`);
	let modalBoxPosDesired = modalBox.css(['left', 'top', 'width', 'height']);
	modalBox.css('width', 10);
	modalBox.css('height', 10);

	modal.style.display = "block";
	
	let duration = 400;
	modalBox.animate({
		left: modalBoxPosDesired.left,
		top: modalBoxPosDesired.top,
		width: 300,
		height: 400
	}, duration);
}

function animateDisappear(modal, modalPartId) {
	let modalBox = $(`.${modalPartId}-box`);
	let modalBoxPosDesired = modalBox.css(['left', 'top', 'width', 'height']);
	
	let duration = 400;
	modalBox.animate({
		left: modalBoxPosDesired.left,
		top: modalBoxPosDesired.top,
		width: 10,
		height: 10
	}, duration);

	setTimeout(() => {
		modal.style.display = "none";
	}, duration);
}

function createHeader() {
	let headerId = 'id-header'
	if ($(`#${headerId}`).length > 0) {
		return;
	}
	$("body").prepend(
		$("<div/>", {
			id: headerId,
			class: 'header'
		}),
		/*
		$("<div/>", {
			class: 'background-image'
		})
		*/
	);
}

function createFooter() {
	$("#id-footer").append(
		$("<hr/>", {
			class: 'subnote-line'
		}),
		$("<div/>", {
			class: 'subnote'
		}).append(
			$("<span/>", {
				class: 'subnote-inner'
			}).html(getText('copyright')),
		)
	);
}

function createContactBox() {
	$("#id-cme-light").append(
		$("<img/>", {
			class: 'cme-light',
			src: 'https://live.staticflickr.com/65535/48717077798_c4c68d3a9d_o.png'
		}),
	);
	$("#id-cme-dark").append(
		$("<img/>", {
			class: 'cme-dark',
			src: 'https://live.staticflickr.com/65535/48717655987_fcbac549a8_o.png'
		}),
	);
	$("#id-cme-dark, #id-cme-light").append(
		$('<div/>', {
			class: 'cme-button-div'
		}).append(
			$('<a/>', {
				href: 'https://www.linkedin.com/in/sorel-mitra-1a82454/',
				class: 'cme-button-link'
			}).append(
				$('<img/>', {
					src: 'https://live.staticflickr.com/65535/48712318036_befd310f01_o.png',
					height: '60px'
				})
			),
		),
	);
}
