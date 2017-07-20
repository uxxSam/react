/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMProperty
 */

'use strict';

var RESERVED_PROPS = {
  children: true,
  dangerouslySetInnerHTML: true,
  key: true,
  ref: true,

  autoFocus: true,
  defaultValue: true,
  defaultChecked: true,
  innerHTML: true,
  suppressContentEditableWarning: true,
  onFocusIn: true,
  onFocusOut: true,
};

/* eslint-disable max-len */
var ATTRIBUTE_NAME_START_CHAR =
  ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
/* eslint-enable max-len */

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */
var DOMProperty = {
  ID_ATTRIBUTE_NAME: 'data-reactid',
  ROOT_ATTRIBUTE_NAME: 'data-reactroot',

  ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
  ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR +
    '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040',

  /**
   * Map from property "standard name" to an object with info about how to set
   * the property in the DOM. Each object contains:
   *
   * attributeName:
   *   Used when rendering markup or with `*Attribute()`.
   * attributeNamespace
   * propertyName:
   *   Used on DOM node instances. (This includes properties that mutate due to
   *   external factors.)
   * mutationMethod:
   *   If non-null, used instead of the property or `setAttribute()` after
   *   initial render.
   * mustUseProperty:
   *   Whether the property must be accessed and mutated as an object property.
   * hasBooleanValue:
   *   Whether the property should be removed when set to a falsey value.
   * hasNumericValue:
   *   Whether the property must be numeric or parse as a numeric and should be
   *   removed when set to a falsey value.
   * hasPositiveNumericValue:
   *   Whether the property must be positive numeric or parse as a positive
   *   numeric and should be removed when set to a falsey value.
   * hasOverloadedBooleanValue:
   *   Whether the property can be used as a flag as well as with a value.
   *   Removed when strictly equal to false; present without a value when
   *   strictly equal to true; present with a value otherwise.
   */
  properties: {
    acceptCharset: {
      attributeName: 'accept-charset',
    },
    allowFullScreen: {
      attributeName: 'allowfullscreen',
      hasBooleanValue: true,
    },
    async: {
      attributeName: 'async',
      hasBooleanValue: true,
    },
    autoPlay: {
      attributeName: 'autoplay',
      hasBooleanValue: true,
    },
    capture: {
      attributeName: 'capture',
      hasBooleanValue: true,
    },
    checked: {
      attributeName: 'checked',
      mustUseProperty: true,
      hasBooleanValue: true,
    },
    className: {
      attributeName: 'class',
    },
    cols: {
      attributeName: 'cols',
      hasNumericValue: true,
    },
    controls: {
      attributeName: 'controls',
      hasBooleanValue: true,
    },
    default: {
      attributeName: 'default',
      hasBooleanValue: true,
    },
    defer: {
      attributeName: 'defer',
      hasBooleanValue: true,
    },
    disabled: {
      attributeName: 'disabled',
      hasBooleanValue: true,
    },
    download: {
      attributeName: 'download',
      hasOverloadedBooleanValue: true,
    },
    formNoValidate: {
      attributeName: 'formnovalidate',
      hasBooleanValue: true,
    },
    hidden: {
      attributeName: 'hidden',
      hasBooleanValue: true,
    },
    htmlFor: {
      attributeName: 'for',
    },
    httpEquiv: {
      attributeName: 'http-equiv',
    },
    loop: {
      attributeName: 'loop',
      hasBooleanValue: true,
    },
    multiple: {
      attributeName: 'multiple',
      mustUseProperty: true,
      hasBooleanValue: true,
    },
    muted: {
      attributeName: 'muted',
      mustUseProperty: true,
      hasBooleanValue: true,
    },
    noValidate: {
      attributeName: 'novalidate',
      hasBooleanValue: true,
    },
    open: {
      attributeName: 'open',
      hasBooleanValue: true,
    },
    playsInline: {
      attributeName: 'playsinline',
      hasBooleanValue: true,
    },
    readOnly: {
      attributeName: 'readonly',
      hasBooleanValue: true,
    },
    required: {
      attributeName: 'required',

      hasBooleanValue: true,
    },
    reversed: {
      attributeName: 'reversed',

      hasBooleanValue: true,
    },
    rows: {
      attributeName: 'rows',

      hasNumericValue: true,
      hasPositiveNumericValue: true,
    },
    rowSpan: {
      attributeName: 'rowspan',

      hasNumericValue: true,
    },
    scoped: {
      attributeName: 'scoped',

      hasBooleanValue: true,
    },
    seamless: {
      attributeName: 'seamless',

      hasBooleanValue: true,
    },
    selected: {
      attributeName: 'selected',

      mustUseProperty: true,
      hasBooleanValue: true,
    },
    size: {
      attributeName: 'size',

      hasNumericValue: true,
      hasPositiveNumericValue: true,
    },
    span: {
      attributeName: 'span',

      hasNumericValue: true,
      hasPositiveNumericValue: true,
    },
    start: {
      attributeName: 'start',

      hasNumericValue: true,
    },
    itemScope: {
      attributeName: 'itemscope',

      hasBooleanValue: true,
    },
    value: {
      attributeName: 'value',

      mutationMethod: function(node, value) {
        if (value == null) {
          return node.removeAttribute('value');
        }

        // Number inputs get special treatment due to some edge cases in
        // Chrome. Let everything else assign the value attribute as normal.
        // https://github.com/facebook/react/issues/7253#issuecomment-236074326
        if (node.type !== 'number' || node.hasAttribute('value') === false) {
          node.setAttribute('value', '' + value);
        } else if (
          node.validity &&
          !node.validity.badInput &&
          node.ownerDocument.activeElement !== node
        ) {
          // Don't assign an attribute if validation reports bad
          // input. Chrome will clear the value. Additionally, don't
          // operate on inputs that have focus, otherwise Chrome might
          // strip off trailing decimal places and cause the user's
          // cursor position to jump to the beginning of the input.
          //
          // In ReactDOMInput, we have an onBlur event that will trigger
          // this function again when focus is lost.
          node.setAttribute('value', '' + value);
        }
      },
    },
    accentHeight: {
      attributeName: 'accent-height',
    },
    alignmentBaseline: {
      attributeName: 'alignment-baseline',
    },
    arabicForm: {
      attributeName: 'arabic-form',
    },
    baselineShift: {
      attributeName: 'baseline-shift',
    },
    capHeight: {
      attributeName: 'cap-height',
    },
    clipPath: {
      attributeName: 'clip-path',
    },
    clipRule: {
      attributeName: 'clip-rule',
    },
    colorInterpolation: {
      attributeName: 'color-interpolation',
    },
    colorInterpolationFilters: {
      attributeName: 'color-interpolation-filters',
    },
    colorProfile: {
      attributeName: 'color-profile',
    },
    colorRendering: {
      attributeName: 'color-rendering',
    },
    dominantBaseline: {
      attributeName: 'dominant-baseline',
    },
    enableBackground: {
      attributeName: 'enable-background',
    },
    fillOpacity: {
      attributeName: 'fill-opacity',
    },
    fillRule: {
      attributeName: 'fill-rule',
    },
    filterRes: {
      attributeName: 'filterRes',
    },
    filterUnits: {
      attributeName: 'filterUnits',
    },
    floodColor: {
      attributeName: 'flood-color',
    },
    floodOpacity: {
      attributeName: 'flood-opacity',
    },
    fontFamily: {
      attributeName: 'font-family',
    },
    fontSize: {
      attributeName: 'font-size',
    },
    fontSizeAdjust: {
      attributeName: 'font-size-adjust',
    },
    fontStretch: {
      attributeName: 'font-stretch',
    },
    fontStyle: {
      attributeName: 'font-style',
    },
    fontVariant: {
      attributeName: 'font-variant',
    },
    fontWeight: {
      attributeName: 'font-weight',
    },
    glyphName: {
      attributeName: 'glyph-name',
    },
    glyphOrientationHorizontal: {
      attributeName: 'glyph-orientation-horizontal',
    },
    glyphOrientationVertical: {
      attributeName: 'glyph-orientation-vertical',
    },
    glyphRef: {
      attributeName: 'glyphRef',
    },
    horizAdvX: {
      attributeName: 'horiz-adv-x',
    },
    horizOriginX: {
      attributeName: 'horiz-origin-x',
    },
    imageRendering: {
      attributeName: 'image-rendering',
    },
    letterSpacing: {
      attributeName: 'letter-spacing',
    },
    lightingColor: {
      attributeName: 'lighting-color',
    },
    markerEnd: {
      attributeName: 'marker-end',
    },
    markerMid: {
      attributeName: 'marker-mid',
    },
    markerStart: {
      attributeName: 'marker-start',
    },
    overlinePosition: {
      attributeName: 'overline-position',
    },
    overlineThickness: {
      attributeName: 'overline-thickness',
    },
    paintOrder: {
      attributeName: 'paint-order',
    },
    panose1: {
      attributeName: 'panose-1',
    },
    pointerEvents: {
      attributeName: 'pointer-events',
    },
    renderingIntent: {
      attributeName: 'rendering-intent',
    },
    shapeRendering: {
      attributeName: 'shape-rendering',
    },
    stopColor: {
      attributeName: 'stop-color',
    },
    stopOpacity: {
      attributeName: 'stop-opacity',
    },
    strikethroughPosition: {
      attributeName: 'strikethrough-position',
    },
    strikethroughThickness: {
      attributeName: 'strikethrough-thickness',
    },
    strokeDasharray: {
      attributeName: 'stroke-dasharray',
    },
    strokeDashoffset: {
      attributeName: 'stroke-dashoffset',
    },
    strokeLinecap: {
      attributeName: 'stroke-linecap',
    },
    strokeLinejoin: {
      attributeName: 'stroke-linejoin',
    },
    strokeMiterlimit: {
      attributeName: 'stroke-miterlimit',
    },
    strokeOpacity: {
      attributeName: 'stroke-opacity',
    },
    strokeWidth: {
      attributeName: 'stroke-width',
    },
    textAnchor: {
      attributeName: 'text-anchor',
    },
    textDecoration: {
      attributeName: 'text-decoration',
    },
    textRendering: {
      attributeName: 'text-rendering',
    },
    underlinePosition: {
      attributeName: 'underline-position',
    },
    underlineThickness: {
      attributeName: 'underline-thickness',
    },
    unicodeBidi: {
      attributeName: 'unicode-bidi',
    },
    unicodeRange: {
      attributeName: 'unicode-range',
    },
    unitsPerEm: {
      attributeName: 'units-per-em',
    },
    vAlphabetic: {
      attributeName: 'v-alphabetic',
    },
    vHanging: {
      attributeName: 'v-hanging',
    },
    vIdeographic: {
      attributeName: 'v-ideographic',
    },
    vMathematical: {
      attributeName: 'v-mathematical',
    },
    vectorEffect: {
      attributeName: 'vector-effect',
    },
    vertAdvY: {
      attributeName: 'vert-adv-y',
    },
    vertOriginX: {
      attributeName: 'vert-origin-x',
    },
    vertOriginY: {
      attributeName: 'vert-origin-y',
    },
    wordSpacing: {
      attributeName: 'word-spacing',
    },
    writingMode: {
      attributeName: 'writing-mode',
    },
    xHeight: {
      attributeName: 'x-height',
    },
    xlinkActuate: {
      attributeName: 'xlink:actuate',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xlinkArcrole: {
      attributeName: 'xlink:arcrole',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xlinkHref: {
      attributeName: 'xlink:href',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xlinkRole: {
      attributeName: 'xlink:role',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xlinkShow: {
      attributeName: 'xlink:show',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xlinkTitle: {
      attributeName: 'xlink:title',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xlinkType: {
      attributeName: 'xlink:type',
      attributeNamespace: 'http://www.w3.org/1999/xlink',
    },
    xmlBase: {
      attributeName: 'xml:base',
      attributeNamespace: 'http://www.w3.org/XML/1998/namespace',
    },
    xmlnsXlink: {
      attributeName: 'xmlns:xlink',
    },
    xmlLang: {
      attributeName: 'xml:lang',
      attributeNamespace: 'http://www.w3.org/XML/1998/namespace',
    },
    xmlSpace: {
      attributeName: 'xml:space',
      attributeNamespace: 'http://www.w3.org/XML/1998/namespace',
    },
  },

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties. Available only in __DEV__.
   *
   * autofocus is predefined, because adding it to the property whitelist
   * causes unintended side effects.
   *
   * @type {Object}
   */
  getPossibleStandardName: __DEV__ ? {autofocus: 'autoFocus'} : null,

  /**
   * Checks to see if a property name is within the list of properties
   * reserved for internal React operations. These properties should
   * not be set on an HTML element.
   *
   * @private
   * @param {string} name
   * @return {boolean} If the name is within reserved props
   */
  isReservedProp(name) {
    return RESERVED_PROPS.hasOwnProperty(name);
  },
};

module.exports = DOMProperty;
