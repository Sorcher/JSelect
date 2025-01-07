/* 
    https://github.com/Sorcher/JSelect
*/

class JSelect {
    constructor(selector) {
        this.selector = typeof selector === 'string' ? document.querySelector(selector) : selector;
        this.method = '';
        this.settings = {
            type: 'bootstrap',
            searchable: false,
            limit: 30,
            labelLimit: 5,
            classes: {
                clear: '',
                close: ''
            },
            consoleValue: false,
            hideButtons: false
        };
        this.name = null;
        this.id = null;
        this.defaultLabel = 'Select';
        this.classes = {
            selectArea: 'j-selection-area',
            labelArea: 'j-selection-label',
            labelDefault: 'j-selection-label-default',
            labelMaterial: 'j-selection-label-material',
            label: 'j-label',
            toggle: 'j-toggle-selection',
            listArea: 'j-selection-list',
            searchArea: 'j-select-search-area',
            search: 'j-selection-search',
            list: 'j-list',
            listGroup: 'j-list-group',
            listItem: 'j-list-item',
            itemPad: 'j-item-pad',
            noResult: 'j-item-noresult',
            inputType: 'j-select-input',
            operations: 'j-select-operations',
            clear: 'j-select-clear',
            close: 'j-select-close',
        };
        this.defaultClass = {
            bootstrap: {
                clear: 'btn btn-default',
                close: 'btn btn-default',
            },
            materialize: {
                clear: 'btn waves-effect waves-light',
                close: 'btn waves-effect waves-light',
            },
            j: {
                clear: '',
                close: '',
            }
        };
        this.selectors = {
            selectArea: null,
            labelArea: null,
            label: null,
            toggle: null,
            listArea: null,
            searchArea: null,
            search: null,
            list: null,
            operations: null,
            clear: null,
            close: null,
        };
        this.options = [];
        this.selected = [];
        this.isMultiple = false;
        this.isOptGroup = false;
        this.isSearchable = false;
        this.isHideButtons = null;
        this.clearClass = null;
        this.closeClass = null;
    }

    _settings(settings) {
        this.settings = { ...this.settings, ...settings };
    }

    _setMethod(method) {
        this.method = method;
    }

    _init() {
        if (this.checkMethod()) {
            this.name = this.selector.getAttribute('name') ? this.selector.getAttribute('name') + '_j' : 'j_selection';
            this.id = this.selector.getAttribute('id') !== null ? this.selector.getAttribute('id') + '_j_selection_area' : null;
            this.isSearchable = this.selector.hasAttribute('searchable') ? true : this.settings.searchable;
            this.isHideButtons = this.settings.hideButtons === true;
            this.clearClass = this.settings.classes.clear ? this.settings.classes.clear : this.defaultClass[this.settings.type].clear;
            this.closeClass = this.settings.classes.close ? this.settings.classes.close : this.defaultClass[this.settings.type].close;
            this.extractData();
            this.createHTML();
            this.setEvents();
            this.selector.style.display = 'none';
        }
    }

    extractData() {
        this.isMultiple = this.selector.multiple;
        this.isOptGroup = this.selector.querySelectorAll('optgroup').length > 0;
        this.options = [];

        if (this.isOptGroup) {
            const firstOption = this.selector.querySelector('option');
            if (firstOption) {
                this.options.push({
                    type: 'option',
                    label: firstOption.textContent,
                });
            }

            const optgroups = this.selector.children;
            for (let optgroup of optgroups) {
                if (optgroup.tagName.toLowerCase() === 'optgroup') {
                    this.options.push({
                        type: 'optgroup',
                        label: optgroup.getAttribute('label'),
                    });
                    for (let opt of optgroup.children) {
                        this.addOption(opt);
                    }
                }
            }
        } else {
            for (let opt of this.selector.children) {
                this.addOption(opt);
            }
        }
    }

    addOption(option) {
        const data = {
            type: 'option',
            value: option.value,
            label: option.textContent,
            selected: option.selected ? 1 : 0,
        };
        this.options.push(data);
    }

    createHTML() {
        // Create selectArea div
        let selectAreaDiv = document.createElement('div');
        if (this.id) {
            selectAreaDiv.id = this.id;
        }
        selectAreaDiv.classList.add(this.classes.selectArea);
        this.selector.insertAdjacentElement('afterend', selectAreaDiv);
        this.selectors.selectArea = selectAreaDiv;

        // Create labelArea
        let labelAreaDiv = document.createElement('div');
        labelAreaDiv.classList.add(this.classes.labelArea);
        this.selectors.selectArea.appendChild(labelAreaDiv);
        this.selectors.labelArea = labelAreaDiv;

        // Set defaultLabel
        this.defaultLabel = this.options[0].value ? this.defaultLabel : this.options[0].label;

        // Create label
        let labelDiv = document.createElement('div');
        labelDiv.classList.add(this.classes.label);
        labelDiv.textContent = this.defaultLabel;
        this.selectors.labelArea.appendChild(labelDiv);
        this.selectors.label = labelDiv;

        // Create toggle icon
        let toggleIcon = this.toggleIcon();
        this.selectors.labelArea.appendChild(toggleIcon);
        this.selectors.toggle = toggleIcon;

        // Create listArea
        let listAreaDiv = document.createElement('div');
        listAreaDiv.classList.add(this.classes.listArea);
        this.selectors.selectArea.appendChild(listAreaDiv);
        this.selectors.listArea = listAreaDiv;
        this.selectors.listArea.style.width = (this.selectors.selectArea.offsetWidth - 3) + 'px';

        // If searchable
        if (this.isSearchable) {
            let searchAreaDiv = document.createElement('div');
            searchAreaDiv.classList.add(this.classes.searchArea);
            this.selectors.listArea.appendChild(searchAreaDiv);
            this.selectors.searchArea = searchAreaDiv;

            let searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.classList.add(this.classes.search);
            searchInput.placeholder = 'Search here...';
            this.selectors.searchArea.appendChild(searchInput);
            this.selectors.search = searchInput;
        }

        // Create list
        let listUl = document.createElement('ul');
        listUl.classList.add(this.classes.list);
        this.selectors.listArea.appendChild(listUl);
        this.selectors.list = listUl;

        // If not hide buttons
        if (!this.isHideButtons) {
            let operationsDiv = document.createElement('div');
            operationsDiv.classList.add(this.classes.operations);
            this.selectors.listArea.appendChild(operationsDiv);
            this.selectors.operations = operationsDiv;

            // Create clear button
            let clearButton = document.createElement('button');
            clearButton.type = 'button';
            clearButton.classList.add(this.classes.clear, ...this.clearClass.split(' '));
            clearButton.textContent = 'Clear';
            this.selectors.operations.appendChild(clearButton);
            this.selectors.clear = clearButton;

            // Create close button
            let closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.classList.add(this.classes.close, ...this.closeClass.split(' '));
            closeButton.textContent = 'Close';
            this.selectors.operations.appendChild(closeButton);
            this.selectors.close = closeButton;
        }

        // Create list items
        this.createList();

        this.fixCSS();
    }

    createList() {
        this.selectors.list.innerHTML = ''; // Clear existing list
        let selected = false;

        this.options.forEach((option) => {
            if (option.type === 'optgroup') {
                let groupLi = document.createElement('li');
                groupLi.classList.add(this.classes.listGroup);
                groupLi.textContent = option.label;
                this.selectors.list.appendChild(groupLi);
            } else if (option.value) {
                let isActive = ((option.selected && this.isMultiple) || (option.selected && !selected)) ? 'active' : '';
                if (this.isOptGroup) {
                    isActive += `${this.classes.itemPad}`;
                }

                let itemLi = document.createElement('li');
                itemLi.classList.add(this.classes.listItem);
                if (isActive) itemLi.classList.add(isActive);
                itemLi.innerHTML = `${this.getInputType(option.value)} ${option.label}`;
                this.selectors.list.appendChild(itemLi);

                if (option.selected) {
                    this.selected.push(option.value);
                    selected = true;
                }
            }
        });

        if (this.isSearchable) {
            let noResultLi = document.createElement('li');
            noResultLi.classList.add(this.classes.noResult);
            noResultLi.textContent = 'No matching options';
            this.selectors.list.appendChild(noResultLi);
        }
    }

    getInputType(value) {
        let type = this.isMultiple ? 'checkbox' : 'radio';
        let input = document.createElement('input');
        input.type = type;
        input.name = this.name;
        input.classList.add(this.classes.inputType);
        input.value = value;
        return input.outerHTML;
    }

    setEvents() {
        // Copy styles and classes from original select element
        this.selectors.labelArea.style.cssText = this.selector.style.cssText;
        this.selector.classList.forEach((cls) => this.selectors.labelArea.classList.add(cls));

        // Toggle listArea on labelArea click
        this.selectors.labelArea.addEventListener('click', (e) => {
            e.stopPropagation();
            const listAreas = document.querySelectorAll(`.${this.classes.listArea}`);
            listAreas.forEach((area) => {
                if (area !== this.selectors.listArea) area.style.display = 'none';
            });
            this.selectors.listArea.style.display = this.selectors.listArea.style.display === 'block' ? 'none' : 'block';
        });

        // Hide listArea when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.selectors.listArea.contains(e.target) && !this.selectors.labelArea.contains(e.target)) {
                this.selectors.listArea.style.display = 'none';
            }
        });

        // Close button event
        if (this.selectors.close) {
            this.selectors.close.addEventListener('click', () => {
                this.selectors.listArea.style.display = 'none';
            });
        }

        // List item click event
        this.selectors.list.addEventListener('click', (e) => {
            const listItem = e.target.closest(`.${this.classes.listItem}`);
            if (listItem) {
                const input = listItem.querySelector(`.${this.classes.inputType}`);
                const checked = !input.checked;
                input.checked = checked;

                const inputs = document.querySelectorAll(`input[name="${this.name}"]:checked`);
                const values = Array.from(inputs).map((input) => input.value);

                if (values.length > this.settings.limit) {
                    alert(`You cannot select more than ${this.settings.limit}`);
                    input.checked = false;
                    listItem.classList.remove('active');
                    return;
                }

                this.setValue(values);
            }
        });

        // Search input event
        if (this.isSearchable && this.selectors.search) {
            this.selectors.search.addEventListener('keyup', () => {
                const value = this.selectors.search.value.trim().toLowerCase();
                this.filterList(value);
            });
        }

        // Clear button event
        if (this.selectors.clear) {
            this.selectors.clear.addEventListener('click', () => {
                this.clearInputs();
            });
        }

        // Window resize event
        window.addEventListener('resize', () => {
            this.selectors.listArea.style.width = (this.selectors.selectArea.offsetWidth - 3) + 'px';
        });

        // Load existing selections
        this.loadExisting();
    }

    loadExisting() {
        if (this.selected.length) {
            let selected = false;
            const listItems = this.selectors.list.querySelectorAll(`.${this.classes.listItem}`);
            listItems.forEach((item) => {
                const input = item.querySelector(`.${this.classes.inputType}`);
                if (this.selected.includes(input.value) && (this.isMultiple || !selected)) {
                    input.checked = true;
                    selected = true;
                }
            });
            this.setValue(this.selected);
        }
    }

    setValue(values) {
        // Deselect all options
        Array.from(this.selector.options).forEach((option) => {
            option.selected = false;
        });

        let label = values.length ? '' : `${this.defaultLabel}, `;
        this.options.forEach((option) => {
            if (values.includes(option.value)) {
                label += `${option.label}, `;
                const selectOption = this.selector.querySelector(`option[value="${option.value}"]`);
                if (selectOption) selectOption.selected = true;

                const inputs = this.selectors.list.querySelectorAll(`.${this.classes.inputType}`);
                inputs.forEach((input) => {
                    if (input.checked) {
                        input.closest(`.${this.classes.listItem}`).classList.add('active');
                    }
                });

                if (!this.isMultiple) {
                    return;
                }
            }
        });

        label = values.length >= this.settings.labelLimit ? `${values.length} selected` : label.slice(0, -2);
        this.selectors.label.textContent = label;
        const event = new Event('change');
        this.selector.dispatchEvent(event);
        if (!this.isMultiple) {
            this.selectors.listArea.style.display = 'none';
        }
        if (this.settings.consoleValue) {
            console.info(this.selector.value);
        }
    }

    toggleIcon() {
        let iconElement;
        if (this.settings.type === 'bootstrap') {
            iconElement = document.createElement('span');
            iconElement.classList.add(this.classes.toggle, 'fa', 'fa-chevron-down');
        } else if (this.settings.type === 'materialize') {
            iconElement = document.createElement('i');
            iconElement.classList.add(this.classes.toggle, 'material-icons');
            iconElement.textContent = 'arrow_drop_down';
        } else {
            iconElement = document.createElement('span');
            iconElement.classList.add(this.classes.toggle);
            iconElement.innerHTML = '&#x25BC;';
        }
        return iconElement;
    }

    filterList(value) {
        const noResult = this.selectors.list.querySelector(`.${this.classes.noResult}`);
        if (noResult) noResult.style.display = 'none';

        if (this.isOptGroup) {
            const groups = this.selectors.list.querySelectorAll(`.${this.classes.listGroup}`);
            groups.forEach((group) => {
                group.style.display = 'none';
            });
        }

        const listItems = this.selectors.list.querySelectorAll(`.${this.classes.listItem}`);
        let matchingItems = [];

        listItems.forEach((item) => {
            const text = item.textContent.toLowerCase();
            if (text.includes(value)) {
                matchingItems.push(item);
                item.style.display = 'list-item';
            } else {
                item.style.display = 'none';
            }
        });

        if (this.isOptGroup) {
            matchingItems.forEach((item) => {
                const previousGroup = item.previousElementSibling;
                if (previousGroup && previousGroup.classList.contains(this.classes.listGroup)) {
                    previousGroup.style.display = 'list-item';
                }
            });
        }

        if (matchingItems.length === 0 && noResult) {
            noResult.style.display = 'list-item';
        }
    }

    clearInputs() {
        Array.from(this.selector.options).forEach((option) => {
            option.selected = false;
        });

        const listItems = this.selectors.list.querySelectorAll(`.${this.classes.listItem}`);
        listItems.forEach((item) => {
            item.classList.remove('active');
            const input = item.querySelector(`.${this.classes.inputType}`);
            input.checked = false;
        });

        this.selectors.label.textContent = this.defaultLabel;

        if (this.isSearchable && this.selectors.search) {
            this.selectors.search.value = '';
        }

        this.filterList('');
    }

    fixCSS() {
        if (this.settings.type === 'materialize') {
            this.selectors.labelArea.classList.add(this.classes.labelMaterial);
            if (this.selectors.searchArea) this.selectors.searchArea.style.maxHeight = '46px';
            if (this.selectors.search) this.selectors.search.style.maxHeight = '28px';
        } else if (this.settings.type === 'bootstrap') {
            if (this.selectors.search) this.selectors.search.style.width = '100%';
        } else {
            this.selectors.labelArea.classList.add(this.classes.labelDefault);
        }
    }

    checkMethod() {
        const existingArea = this.selector.nextElementSibling;
        if (existingArea && existingArea.classList.contains(this.classes.selectArea)) {
            existingArea.remove();
        }
        this.selector.style.display = '';
        return this.method !== 'destroy';
    }

    refresh() {
        this._setMethod('refresh');
        this._init();
    }

    destroy() {
        this._setMethod('destroy');
        this._init();
    }
}

// Usage as a plugin
function jSelect(selector, settings = {}, method) {
    const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
    elements.forEach((element) => {
        const jSelectInstance = new JSelect(element);
        jSelectInstance._settings(settings);
        jSelectInstance._setMethod(method);
        jSelectInstance._init();
    });
}

// Export the class and plugin function if using modules
// export { JSelect, jSelect };








/* 

// Initialize the plugin
jSelect('select[name="country"]', {
    searchable: true,
    type: 'bootstrap',
    limit: 5,
});

// Or using the class directly
const jSelectInstance = new JSelect('select[name="country"]');
jSelectInstance._settings({
    searchable: true,
    type: 'bootstrap',
    limit: 5,
});
jSelectInstance._init();



*/