JSelect
================

JSelect is a **vanilla JavaScript** plugin for enhancing the `<select>` input with customizable styles and features like searchability and multiple selections.
Based on the jQuery plugin by [Amsify42](https://github.com/amsify42) **jquery.amsify.select**

**Notes:**

*   All jQuery methods have been replaced with their vanilla JavaScript equivalents.
*   Event listeners are attached using `addEventListener`.
*   DOM manipulations are done using native methods like `createElement`, `appendChild`, `insertAdjacentElement`, etc.
*   CSS class manipulations use `classList` methods.
*   The code maintains the same functionality as the original jQuery plugin, ensuring backward compatibility.
*   The plugin can be used as a function `jSelect` for ease of use, similar to how jQuery plugins are used.
*   The code is modular and can be imported into other scripts or modules.

**Usage Example:**


# Initialize the plugin
```javascript
jSelect('select[name="country"]', {
    searchable: true,
    type: 'bootstrap',
    limit: 5,
});
```
# Or using the class directly 
```javascript
const jSelectInstance = new JSelect('select[name="country"]');
jSelectInstance._settings({
    searchable: true,
    type: 'bootstrap',
    limit: 5,
});
jSelectInstance._init();
```


- - -




```javascript
jSelect('select');
```

## Installation

Include the `JSelect` script in your project:


```html
<script src="path/to/jselect.js"></script>
```

Or, if using modules:


```javascript
import { JSelect, jSelect } from 'path/to/jselect.js';
```

- - -

# Table of Contents

1.  [Simple Selection](#simple-selection)
2.  [Multiple Selection](#multiple-selection)
3.  [Option Group](#option-group)
4.  [Searchable Selection](#searchable-selection)
5.  [Settings](#settings)
    *   [Type](#1-type)
    *   [Limit](#2-limit)
    *   [Label Limit](#3-label-limit)
    *   [Button Classes](#4-button-classes)
    *   [Hide Buttons](#5-hide-buttons)
6.  [Refresh and Destroy](#refresh-and-destroy)
7.  [Instantiating](#instantiating)

- - -

## Simple Selection

For a simple selection, your HTML `<select>` input can be:


```html
<select name="country">
    <option value="">Select Country</option>
    <option value="1">India</option>
    <option value="2">Afghanistan</option>
    <option value="3">USA</option>
    <option value="4">Russia</option>
    <option value="5">South Africa</option>
    <option value="6">West Indies</option>
</select>
```

Initialize the plugin:


```javascript
jSelect('select[name="country"]');
```

- - -

## Multiple Selection

For multiple selections, add the `multiple` attribute to the `<select>` element:


```html
<select name="country" multiple>
    <option value="">Select Country</option>
    <option value="1">India</option>
    <option value="2">Afghanistan</option>
    <option value="3">USA</option>
    <option value="4">Russia</option>
    <option value="5">South Africa</option>
    <option value="6">West Indies</option>
</select>
```

Initialize the plugin:


```javascript
jSelect('select[name="country"]');
```

- - -

## Option Group

Option groups are automatically rendered when the plugin detects `<optgroup>` tags:


```html
<select name="country">
    <option value="">Select Country</option>
    <optgroup label="Asia">
        <option value="1">India</option>
        <option value="2">Afghanistan</option>
    </optgroup>
    <optgroup label="America">
        <option value="3">USA</option>
        <option value="4">Canada</option>
    </optgroup>
    <optgroup label="Africa">
        <option value="5">South Africa</option>
        <option value="6">Nigeria</option>
    </optgroup>
</select>
```

Initialize the plugin:


```javascript
jSelect('select[name="country"]');
```

- - -

## Searchable Selection

To make the selection searchable, add the `searchable` attribute to the `<select>` element:


```html
<select name="country" searchable>
    <option value="">Select Country</option>
    <option value="1">India</option>
    <option value="2">Afghanistan</option>
    <option value="3">USA</option>
    <option value="4">Russia</option>
    <option value="5">South Africa</option>
    <option value="6">West Indies</option>
</select>
```

Or set the `searchable` option during initialization:


```javascript
jSelect('select[name="country"]', {
    searchable: true
});
```

- - -

## Settings

### 1. Type


```javascript
jSelect('select', {
    type: 'bootstrap'
});
```

Default type is **bootstrap**. You can choose from:

*   `bootstrap`
*   `materialize`
*   `j` (renders HTML without any CSS framework classes)

### 2. Limit

Set a limit on the number of options that can be selected:


```javascript
jSelect('select', {
    limit: 5
});
```

Default limit is `30`.

### 3. Label Limit

Limit the number of labels displayed in the selection area when items are selected:


```javascript
jSelect('select', {
    labelLimit: 5
});
```

Default label limit is `5`.

### 4. Button Classes

Customize the CSS classes of the buttons rendered by the plugin:


```javascript
jSelect('select', {
    classes: {
        clear: 'btn btn-primary',
        close: 'btn btn-danger',
    },
});
```

### 5. Hide Buttons

Hide the clear and close buttons:


```javascript
jSelect('select', {
    hideButtons: true
});
```

- - -

## Refresh and Destroy

To refresh the plugin instance:


```javascript
jSelect('select[name="country"]', {}, 'refresh');
```

To destroy the plugin instance:


```javascript
jSelect('select[name="country"]', {}, 'destroy');
```

- - -

## Instantiating

Alternatively, you can instantiate the plugin using the class directly.

### Initialization


```javascript
const jSelectInstance = new JSelect('select[name="country"]');
jSelectInstance._settings({
    searchable: true,
});
jSelectInstance._init();
```

### Refresh and Destroy


```javascript
jSelectInstance.refresh();
jSelectInstance.destroy();
```

- - -



| Function Name | Description |
| --- | --- |
| **constructor(selector)** | Initializes the JSelect instance with default settings and properties.<br/>**Parameters:**<br/>`selector` - The `<select>` element or selector string. |
| **\_settings(settings)** | Merges user-defined settings with default settings.<br/>**Parameters:**<br/>`settings` - An object containing plugin settings. |
| **\_setMethod(method)** | Sets the method for the plugin (e.g., 'refresh', 'destroy').<br/>**Parameters:**<br/>`method` - The method name to set. |
| **\_init()** | Initializes the plugin by creating the necessary HTML structure, extracting data, and setting up events. |
| **checkMethod()** | Checks whether to proceed with initialization or perform a method action like 'destroy'.<br/>**Returns:**<br/>`boolean` - Whether to proceed with `_init()`. |
| **extractData()** | Extracts options and optgroups from the original `<select>` element and populates the internal options array. |
| **addOption(option)** | Adds an individual option to the options array.<br/>**Parameters:**<br/>`option` - An `<option>` element. |
| **createHTML()** | Creates the HTML structure required for the custom select component. |
| **createList()** | Generates the list items for the select options and appends them to the list element. |
| **toggleIcon()** | Creates the toggle icon element based on the selected type (bootstrap, materialize, or j).<br/>**Returns:**<br/>`HTMLElement` - The toggle icon element. |
| **setEvents()** | Attaches event listeners to the custom select elements (e.g., label click, option selection, search input). |
| **loadExisting()** | Loads and selects existing options based on the original `<select>` element's selected options. |
| **setValue(values)** | Updates the selected values, updates the label text, and triggers the change event on the original `<select>` element.<br/>**Parameters:**<br/>`values` - An array of selected values. |
| **filterList(value)** | Filters the list items based on the search input value.<br/>**Parameters:**<br/>`value` - The search query string. |
| **clearInputs()** | Clears all selected options and resets the select component to its default state. |
| **fixCSS()** | Applies necessary CSS adjustments based on the selected type (bootstrap, materialize, or j). |
| **refresh()** | Refreshes the plugin instance by reinitializing it with the current settings. |
| **destroy()** | Destroys the plugin instance, removing all custom elements and restoring the original `<select>` element. |

- - -



All credits to [Amsify42](https://github.com/amsify42) for the **jquery.amsify.select**