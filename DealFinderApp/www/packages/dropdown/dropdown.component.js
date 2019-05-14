dropDownComponent = function (param) {

    var dom = document.createElement('div');

    http.load({
        path: "packages/dropdown/dropdown.component.html",
        canvas: param.canvas,
        callback: function (response) {
            var listComponent = param.canvas.querySelector('div[id="list-component"]');

            if ("callback" in param) {
                param.callback({});
            }
        }
    });

    closeListDropDown = function () {
        var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");
        var listItemDropDowns = listComponent.querySelectorAll('div[drop-down]');
        Array.prototype.forEach.call(listItemDropDowns, function (listItemDropDown, index) {
            listItemDropDown.setAttribute("hide", "");
        });
    }

    this.bind = function (dataSet) {
        var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");

        listLoader = listComponent.querySelector("div[class=\"loader-wrappr\"]");

        listContainer = listComponent.querySelector("div[class=\"list-container list-group list-group-flush\"]");
        listContainer.innerHTML = "";

        Array.prototype.forEach.call(dataSet, function (data) {

            var listItem = dom.firstChild.cloneNode(true);
            listContainer.appendChild(listItem);
            listItem.addEventListener("mousedown", function (evt) {
                if ("onClick" in param.item) {
                    param.item.onClick({});
                }

                // if ("onClick" in dropDownItem) {
                //     dropDownItem.onClick({
                //         data: data
                //     });
                // }

                evt.cancelBubble = true;
                evt.preventDefault();
            })

            if ("item" in param) {
                if ("icon" in param.item) {
                    var listItemIcon = listItem.querySelector('div[class="icon"]');
                    listItemIcon.classList.add(("icon" in param.item) ? param.item.icon : "");
                }
                if ("title" in param.item) {
                    var listItemTitle = listItem.querySelector('div[class="card-title"]');
                    listItemTitle.innerHTML = ("title" in param.item) ? ORM.toDataObject(data, param.item.title) : "";
                    listItemTitle.removeAttribute("hide");
                }

                if ("dropdown" in param.item) {
                    if (("items" in param.item.dropdown) && (param.item.dropdown.items.length > 0)) {

                        var listItemDropDownIcon = listItem.querySelector('div[drop-down-icon]');
                        listItemDropDownIcon.removeAttribute("hide");
                        listItemDropDownIcon.classList.add(("icon" in param.item.dropdown) ? param.item.dropdown.icon : "");

                        listItemDropDownIcon.addEventListener("mousedown", function (evt) {
                            var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");
                            var listItemDropDowns = listComponent.querySelectorAll('div[drop-down]');
                            Array.prototype.forEach.call(listItemDropDowns, function (listItemDropDown, index) {
                                listItemDropDown.setAttribute("hide", "");
                            })

                            // closeListDropDown();
                            
                            var btn = this.parentNode;
                            var dropdown = btn.querySelector("div[drop-down]");
                            dropdown.removeAttribute("hide");

                            evt.cancelBubble = true;
                            evt.preventDefault();
                        });

                        var dropdown = listItem.querySelector("div[drop-down]");
                        var dropDownContainer = dropdown.querySelector("div[class=\"drop-down-container\"]");
                        var dropDownContainerList = dropDownContainer.querySelector("ul");
                        var dropDownListItemTemplate = dropDownContainerList.querySelector("li[dropdown-list-item]");
                        var dropDownListItemDom = document.createElement('div');
                        dropDownListItemDom.appendChild(dropDownListItemTemplate);

                        dropDownContainerList.clear();

                        param.item.dropdown.items.map(function (dropDownItem, index) {
                            
                            var dropDownListItemNode = dropDownListItemDom.firstChild.cloneNode(true);
                            dropDownContainerList.appendChild(dropDownListItemNode);

                            var dropDownItemIcon = dropDownListItemNode.querySelector('div[data-icon]');
                            dropDownItemIcon.removeAttribute("hide");
                            if ("icon" in dropDownItem) {
                                dropDownItemIcon.classList.add((("icon" in dropDownItem) ? dropDownItem.icon : ""));
                            }

                            var dropDownItemText = dropDownListItemNode.querySelector('div[data-text]');
                            dropDownItemText.removeAttribute("hide");
                            dropDownItemText.innerHTML = (("text" in dropDownItem) ? dropDownItem.text : "");

                            dropDownListItemNode.addEventListener("mousedown", function (evt) {
                                var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");
                                var listItemDropDowns = listComponent.querySelectorAll('div[drop-down]');
                                Array.prototype.forEach.call(listItemDropDowns, function (listItemDropDown, index) {
                                    listItemDropDown.setAttribute("hide", "");
                                });

                                closeListDropDown();

                                if ("onClick" in dropDownItem) {
                                    dropDownItem.onClick({
                                        data: data
                                    });
                                }

                                evt.cancelBubble = true;
                                evt.preventDefault();
                            });
                        });
                    }
                }
            }

        });
        listLoader.setAttribute("hide", "");
    }

    this.showLoader = function () {
        var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");
        listLoader = listComponent.querySelector("div[class=\"loader-wrappr\"]");
        listLoader.removeAttribute("hide");
    }

    this.hideLoader = function () {
        var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");
        listLoader = listComponent.querySelector("div[class=\"loader-wrappr\"]");
        listLoader.setAttribute("hide", "");
    }

    window.addEventListener("mousedown", function(evt) {
        var listComponent = param.canvas.querySelector("div[id=\"list-component\"]");
        var listItemDropDowns = listComponent.querySelectorAll('div[drop-down]');
        Array.prototype.forEach.call(listItemDropDowns, function (listItemDropDown, index) {
            listItemDropDown.setAttribute("hide", "");
        });
    });
}