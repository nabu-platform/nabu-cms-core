if (!nabu) { var nabu = {} };
if (!nabu.design) { nabu.design = {} };
if (!nabu.design.mixins) { nabu.design.mixins = {} };

nabu.design.mixins.Style = {
	data: function() {
		return {
			// the style that has been configured for this component
			// the key is the css property and the value is its value
			style: {
				// styling for the component itself
				"$self": {}
				// separate styling is injected for all the anchors
			}
		}
	},
	methods: {
		remainingCssKeys: function(anchor) {
			// from: https://raw.githubusercontent.com/blakeembrey/just-css-properties/master/vendor/all.json
			var keys = ["--in-content-border-color","--in-content-border-focus","--in-content-border-highlight","--in-content-box-background","--in-content-box-background-active","--in-content-box-background-hover","--in-content-box-background-odd","--in-content-box-border-color","--in-content-category-background","--in-content-category-background-active","--in-content-category-background-hover","--in-content-category-border-focus","--in-content-category-text","--in-content-category-text-selected","--in-content-header-border-color","--in-content-item-hover","--in-content-item-selected","--in-content-link-color","--in-content-link-color-active","--in-content-link-color-hover","--in-content-link-color-visited","--in-content-page-background","--in-content-page-color","--in-content-primary-button-background","--in-content-primary-button-background-active","--in-content-primary-button-background-hover","--in-content-selected-text","--in-content-tab-color","--in-content-table-border-dark-color","--in-content-table-header-background","--in-content-text-color","-moz-appearance","-moz-binding","-moz-border-bottom-colors","-moz-border-left-colors","-moz-border-right-colors","-moz-border-top-colors","-moz-box-align","-moz-box-direction","-moz-box-flex","-moz-box-ordinal-group","-moz-box-orient","-moz-box-pack","-moz-column-count","-moz-column-fill","-moz-column-gap","-moz-column-rule-color","-moz-column-rule-style","-moz-column-rule-width","-moz-column-width","-moz-float-edge","-moz-force-broken-image-icon","-moz-hyphens","-moz-image-region","-moz-orient","-moz-osx-font-smoothing","-moz-outline-radius-bottomleft","-moz-outline-radius-bottomright","-moz-outline-radius-topleft","-moz-outline-radius-topright","-moz-stack-sizing","-moz-tab-size","-moz-text-align-last","-moz-text-decoration-color","-moz-text-decoration-line","-moz-text-decoration-style","-moz-text-size-adjust","-moz-user-focus","-moz-user-input","-moz-user-modify","-moz-user-select","-moz-window-dragging","-moz-window-shadow","-webkit-align-content","-webkit-align-items","-webkit-align-self","-webkit-alt","-webkit-animation","-webkit-animation-delay","-webkit-animation-direction","-webkit-animation-duration","-webkit-animation-fill-mode","-webkit-animation-iteration-count","-webkit-animation-name","-webkit-animation-play-state","-webkit-animation-timing-function","-webkit-app-region","-webkit-appearance","-webkit-backdrop-filter","-webkit-backface-visibility","-webkit-background-blend-mode","-webkit-background-clip","-webkit-background-composite","-webkit-background-origin","-webkit-background-size","-webkit-blend-mode","-webkit-border-bottom-left-radius","-webkit-border-bottom-right-radius","-webkit-border-fit","-webkit-border-horizontal-spacing","-webkit-border-image","-webkit-border-radius","-webkit-border-top-left-radius","-webkit-border-top-right-radius","-webkit-border-vertical-spacing","-webkit-box-align","-webkit-box-decoration-break","-webkit-box-direction","-webkit-box-flex","-webkit-box-flex-group","-webkit-box-lines","-webkit-box-ordinal-group","-webkit-box-orient","-webkit-box-pack","-webkit-box-reflect","-webkit-box-shadow","-webkit-box-sizing","-webkit-clip-path","-webkit-color-correction","-webkit-column-axis","-webkit-column-break-after","-webkit-column-break-before","-webkit-column-break-inside","-webkit-column-count","-webkit-column-gap","-webkit-column-progression","-webkit-column-rule","-webkit-column-rule-color","-webkit-column-rule-style","-webkit-column-rule-width","-webkit-column-span","-webkit-column-width","-webkit-cursor-visibility","-webkit-dashboard-region","-webkit-filter","-webkit-flex-basis","-webkit-flex-direction","-webkit-flex-flow","-webkit-flex-grow","-webkit-flex-shrink","-webkit-flex-wrap","-webkit-flow-from","-webkit-flow-into","-webkit-font-kerning","-webkit-font-smoothing","-webkit-font-variant-ligatures","-webkit-grid-after","-webkit-grid-auto-columns","-webkit-grid-auto-flow","-webkit-grid-auto-rows","-webkit-grid-before","-webkit-grid-definition-columns","-webkit-grid-definition-rows","-webkit-grid-end","-webkit-grid-start","-webkit-highlight","-webkit-hyphenate-character","-webkit-hyphenate-limit-after","-webkit-hyphenate-limit-before","-webkit-hyphenate-limit-lines","-webkit-hyphens","-webkit-initial-letter","-webkit-justify-content","-webkit-justify-self","-webkit-line-align","-webkit-line-box-contain","-webkit-line-break","-webkit-line-clamp","-webkit-line-grid","-webkit-line-snap","-webkit-locale","-webkit-margin-after-collapse","-webkit-margin-before-collapse","-webkit-marquee-direction","-webkit-marquee-increment","-webkit-marquee-repetition","-webkit-marquee-style","-webkit-mask-attachment","-webkit-mask-box-image","-webkit-mask-box-image-outset","-webkit-mask-box-image-repeat","-webkit-mask-box-image-slice","-webkit-mask-box-image-source","-webkit-mask-box-image-width","-webkit-mask-clip","-webkit-mask-composite","-webkit-mask-image","-webkit-mask-origin","-webkit-mask-position","-webkit-mask-repeat","-webkit-mask-size","-webkit-mask-source-type","-webkit-nbsp-mode","-webkit-order","-webkit-perspective","-webkit-perspective-origin","-webkit-print-color-adjust","-webkit-region-break-after","-webkit-region-break-before","-webkit-region-break-inside","-webkit-region-fragment","-webkit-rtl-ordering","-webkit-scroll-snap-coordinate","-webkit-scroll-snap-destination","-webkit-scroll-snap-points-x","-webkit-scroll-snap-points-y","-webkit-scroll-snap-type","-webkit-shape-image-threshold","-webkit-shape-inside","-webkit-shape-margin","-webkit-shape-outside","-webkit-shape-padding","-webkit-svg-shadow","-webkit-tap-highlight-color","-webkit-text-combine","-webkit-text-decoration-color","-webkit-text-decoration-line","-webkit-text-decoration-skip","-webkit-text-decoration-style","-webkit-text-decorations-in-effect","-webkit-text-emphasis-color","-webkit-text-emphasis-position","-webkit-text-emphasis-style","-webkit-text-fill-color","-webkit-text-orientation","-webkit-text-security","-webkit-text-size-adjust","-webkit-text-stroke-color","-webkit-text-stroke-width","-webkit-text-underline-position","-webkit-text-zoom","-webkit-transform","-webkit-transform-origin","-webkit-transform-style","-webkit-transition","-webkit-transition-delay","-webkit-transition-duration","-webkit-transition-property","-webkit-transition-timing-function","-webkit-user-drag","-webkit-user-modify","-webkit-user-select","-webkit-wrap-flow","-webkit-wrap-through","-webkit-writing-mode","accelerator","align-content","align-items","align-self","alignment-baseline","alt","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","backface-visibility","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left-color","border-left-style","border-left-width","border-right-color","border-right-style","border-right-width","border-spacing","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","buffered-rendering","caption-side","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-rendering","column-count","column-fill","column-gap","column-progression","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","content","counter-increment","counter-reset","cursor","cx","cy","d","direction","display","dominant-baseline","empty-cells","enable-background","fill","fill-opacity","fill-rule","filter","flex-basis","flex-direction","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","font-family","font-feature-settings","font-kerning","font-language-override","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-weight","glyph-orientation-horizontal","glyph-orientation-vertical","height","hyphens","image-orientation","image-rendering","ime-mode","isolation","justify-content","justify-items","justify-self","kerning","layout-grid-char","layout-grid-line","layout-grid-mode","layout-grid-type","left","letter-spacing","lighting-color","line-break","line-height","list-style-image","list-style-position","list-style-type","margin-bottom","margin-left","margin-right","margin-top","marker","marker-end","marker-mid","marker-offset","marker-start","mask","mask-type","max-height","max-width","min-height","min-width","mix-blend-mode","motion-offset","motion-path","motion-rotation","object-fit","object-position","opacity","order","orphans","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-wrap","overflow-x","overflow-y","padding-bottom","padding-left","padding-right","padding-top","page-break-after","page-break-before","page-break-inside","paint-order","perspective","perspective-origin","pointer-events","position","quotes","r","resize","right","ruby-align","ruby-overhang","ruby-position","rx","ry","scroll-behavior","scroll-snap-coordinate","scroll-snap-destination","scroll-snap-points-x","scroll-snap-points-y","scroll-snap-type-x","scroll-snap-type-y","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-last","text-anchor","text-autospace","text-decoration","text-decoration-color","text-decoration-line","text-decoration-style","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-justify-trim","text-kashida","text-kashida-space","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-position","top","touch-action","transform","transform-origin","transform-style","transition-delay","transition-duration","transition-property","transition-timing-function","unicode-bidi","vector-effect","vertical-align","visibility","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"];
			keys = keys.filter(function(x) { return x.substring(0, 1) != "-" });
			for (var key in this.style[anchor]) {
				var index = keys.indexOf(key);
				if (index >= 0) {
					keys.splice(index, 1);
				}
			}
			return keys;
		},
		usedCssKeys: function(anchor) {
			return Object.keys(this.style[anchor]);
		}
	},
	ready: function() {
		var anchors = this.$el.querySelectorAll("[id]");
		for (var i = 0; i < anchors.length; i++) {
			var anchor = anchors.item(i);
			var id = anchor.getAttribute("id");
			Vue.set(this.style, id, {});
		}
		this.$el.appendChild(new nabu.designer.CssEditor({ data: {
			component: this,
			anchors: Object.keys(this.style)
		}}).$mount().$el);
	},
	watch: {
		style: {
			deep: true,
			handler: function(newValue) {
				console.log("configuration", newValue);
				for (var key in newValue) {
					var style = "";
					for (var css in newValue[key]) {
						if (style != "") {
							style += ";";
						}
						style += css + ": " + newValue[key][css];
					}
					console.log("custom style is", key, style);
					if (key == "$self") {
						this.$el.setAttribute("style", style);
					}
					else {
						document.getElementById(key).setAttribute("style", style);
					}
				}
			}
		}
	}
}