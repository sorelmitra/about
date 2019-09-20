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
	getLanguageAndCreateMenuBar();
}

const cookieLanguage = 'language';
const imgUiMenuOn = 'https://live.staticflickr.com/65535/48710978106_df47bcb4d6_o.png';
const imgUiMenuOff = 'https://live.staticflickr.com/65535/48711141977_7c603ce013_o.png';
const imgUiMenuOffLit = 'https://live.staticflickr.com/65535/48710978106_df47bcb4d6_o.png';
const imgUiAvatar = 'https://live.staticflickr.com/65535/48705589673_ce783b381c_o.png';
let imgUiLang = {
	RO: 'https://live.staticflickr.com/65535/48705590238_e0a17e83bd_o.png',
	EN: 'https://live.staticflickr.com/65535/48706045511_f0557d72f9_o.png',
	ES: 'https://live.staticflickr.com/65535/48710362622_258acb7a9d_o.png',
};
let imgUiLangCurrent = '';
let domain = null;
let knownLanguages = ['RO', 'EN', 'ES']

function getLanguageAndCreateMenuBar() {
	determineLanguage();
	createMenuBar();
}

function createMenuBar() {
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
			$('<a/>', {
				href: 'index.html',
				class: 'menubar-link'
			}).append(
				$('<img/>', {
					src: imgUiAvatar,
					class: 'menubar-avatar',
				}),
			),
		),
		$('<div/>', {
			class: 'menubar-box-language',
		}).append(
			$('<img/>', {
				src: imgUiLangCurrent,
				class: 'menubar-language',
				onclick: 'changeLanguage()'
			}),
		),
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

function determineLanguage() {
	let c = Cookies.getJSON(cookieLanguage);
	if (c && c.lang) {
		imgUiLangCurrent = imgUiLang[c.lang];
		applyLanguage(c.lang);
		return;
	}
	rotateLanguage();
}

function rotateLanguage() {
	let c = Cookies.getJSON(cookieLanguage);
	let oldLang = c ? c.lang : undefined;
	if (c && c.lang) {
		c.langIndex++;
		if (c.langIndex >= knownLanguages.length) {
			c.langIndex = 0;
		}
	} else {
		c = {
			lang: null,
			langIndex: 0,
		}
	}
	c.lang = knownLanguages[c.langIndex];
	LOG.debug("Language: from", oldLang, "to", c.lang);
	imgUiLangCurrent = imgUiLang[c.lang];
	Cookies.set(cookieLanguage, c, { expires: 7, domain: domain });

	applyLanguage(c.lang);
}

function changeLanguage() {
	rotateLanguage();
	getLanguageAndCreateMenuBar();
}

function applyLanguage(currentLang) {
	$('h1, h2, h3, h4, p, ul, ol, li, span').addClass('lang-hidden');
	for (const lang of knownLanguages) {
		if (lang == currentLang) {
			LOG.debug(`Setting ${lang} to visible`);
			$(`.lang-${lang}`).removeClass('lang-hidden');
		} else {
			LOG.debug(`Setting ${lang} to invisible`);
			$(`.lang-${lang}`).addClass('lang-hidden');
		}
	}
}

function setupModal(modalParentId, modalOpenButtonId) {
	let modalRootId = "id-modal-root";
	let modalCloseButtonId = "id-modal-close-button";
	createModalElements(modalParentId, modalRootId, modalCloseButtonId, "modal-test");
	let createdButton = false;
	if (modalOpenButtonId == null) {
		modalOpenButtonId = "id-test-modal-open-button";
		$(`#${modalParentId}`).append(
			$('<button/>', {
				id: modalOpenButtonId,
			}).text("Open Modal"),
		);
		createdButton = true;
	}

	// Get the modal
	var modal = document.getElementById(modalRootId);
	// Get the button that opens the modal
	var btn = document.getElementById(modalOpenButtonId);
	// Get the <span> element that closes the modal
	var span = document.getElementById(modalCloseButtonId);

	// When the user clicks the button, open the modal 
	if (createdButton) {
		btn.onclick = function() {
			parseAndRenderMarkDown();
			modal.style.display = "block";
		}

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
	}
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
				href: 'index.html',
				class: 'menu-item-link'
			}).append(
				$("<span/>", {
					class: 'lang-RO'
				}).html("ACASĂ"),
			),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				href: 'what.html',
				class: 'menu-item-link'
			}).append(
				$("<span/>", {
					class: 'lang-RO'
				}).html("CE POT FACE PENTRU TINE"),
			),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				href: 'work-projects.html',
				class: 'menu-item-link'
			}).append(
				$("<span/>", {
					class: 'lang-RO'
				}).html("PORTOFOLIU"),
			),
		),
		$('<div/>', {
			class: 'menu-item'
		}).append(
			$('<a/>', {
				href: 'freetime-projects.html',
				class: 'menu-item-link'
			}).append(
				$("<span/>", {
					class: 'lang-RO'
				}).html("TIMP LIBER"),
			),
		),
	);
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
	$("body").prepend(
		$("<div/>", {
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
			}).append(
				$('<span/>', {
					class: 'lang-RO',
				}).html("<b>Notă</b>: Tot conținutul acestui site este © Sorel Mitra și nu poate fi folosit sub nici o formă fără acordul meu scris."),
			),
			$("<span/>", {
				class: 'subnote-inner'
			}).append(
				$('<span/>', {
					class: 'lang-RO',
				}).html("<b>Notă</b>: Acest site foloseste cookies pentru a ține minte limba aleasă."),
			),
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
