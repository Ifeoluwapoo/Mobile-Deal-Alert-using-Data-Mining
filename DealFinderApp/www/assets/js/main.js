var http = {
    request: function (args) {
        var method = args.method ? args.method : "POST";
        var url = args.url; // + "?t=" + (new Date()).getUTCMilliseconds();
        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = "true";

        xhr.open(method, url, true);
        // if(app["access_token"] != null) {
        //     var sessionDetails = app["access_token"];
        //     xhr.setRequestHeader("Authorization", "Bearer " + app["access_token"]);
        // }

        if (("header" in args) && args.header) {
            Array.prototype.forEach.call(args.header, function (header) {
                xhr.setRequestHeader(header.key, header.value);
            });
        }

        xhr.addEventListener("progress", function (evt) {
            if (args.onLoading)
                args.onLoading({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });
        });

        xhr.addEventListener("load", function (evt) {
            if (this.readyState == 4) {
                // alert(this.responseText);
                // var response = document.getElementById("responseLabel");
                // response.innerHTML = JSON.parse(this.responseText);

                var r = null;
                try {
                    r = JSON.parse(this.responseText);
                } catch (e) {
                    r = this.responseText;
                }
                if (args.onCompleted) {
                    var statusCode = xhr.status;
                    var statusText = xhr.statusText;
                    var data = r;
                    if ((r) && (Array.prototype.toString.apply(r) != '[object String]')) {
                        if ((r.data) && ('null' === r.data) && (Array.prototype.toString.apply(r.data) != '[object Object]')) {
                            statusCode = r.statusCode;
                            statusText = r.statusText;
                            data = JSON.parse(r.data);
                        }
                    }

                    args.onCompleted({
                        statusCode: statusCode,
                        statusMessage: statusText,
                        data: data
                    });
                }
                if (args.onLoading)
                    args.onLoading({
                        status: false
                    });
            }
        });

        xhr.addEventListener("error", function (evt) {
            var statusCode = xhr.status;
            var statusText = xhr.statusText;
            // alert(JSON.stringify(xhr));

            if (args.onError)
                args.onError({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });

            if (args.onLoading)
                args.onLoading({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });
        });

        xhr.addEventListener("timeout", function (evt) {
            var statusCode = xhr.status;
            var statusText = xhr.statusText;
            if (args.onTimeout)
                args.onTimeout({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });

            if (args.onLoading)
                args.onLoading({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });
        });

        xhr.addEventListener("abort", function (evt) {
            var statusCode = xhr.status;
            var statusText = xhr.statusText;
            if (args.onCancelled)
                args.onCancelled({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });

            if (args.onLoading)
                args.onLoading({
                    statusCode: statusCode,
                    statusMessage: statusText,
                });
        });

        if (method == "POST") {
            var formDataPair = [],
                formData = "";
            if ((args.data) && Object.keys(args.data).length > 0) {
                Object.keys(args.data).map(function (item) {
                    formDataPair.push(encodeURIComponent(item) + "=" + encodeURIComponent(args.data[item]));
                });
                formData = formDataPair.join("&");
            }
            xhr.send(formData);
        } else {
            xhr.send();
        }

        setTimeout(function () {
            xhr.abort();
        }, 30000);
    },

    post: function (param, callback, error) {
        var url = param
        http.request({
            url: ((param) && ("url" in param)) ? param.url : null,
            data: ((param) && ("data" in param)) ? param.data : null,
            header: ("header" in param) ? param.header : null,
            onCompleted: function (r) {
                // console.log(r);
                if (r.statusCode === 200) {
                    var response = r.data;

                    if (callback)
                        callback(r);
                }
            },
            onTimeout: function (response) {
                if (error)
                    error(response);
            },
            onError: function (response) {
                if (error)
                    error(response);
            },
            onCancelled: function (response) {
                if (error)
                    error(response);
            }
        });
    },

    get: function (param, callback) {
        var url = param
        http.request({
            url: ((param) && ("url" in param)) ? param.url : null,
            method: "GET",
            data: ((param) && ("data" in param)) ? param.data : null,
            onCompleted: function (r) {
                // console.log(r);
                if (r.statusCode === 200) {
                    var response = r.data;

                    if (callback)
                        callback(r);
                }
            },
            onTimeout: function (response) {
                if ("callback" in param)
                    param.callback(response);
            },
            onError: function (response) {
                if ("callback" in param)
                    param.callback(response);
            },
            onCancelled: function (response) {
                if ("callback" in param)
                    param.callback(response);
            }
        });
    },

    load: function (args) {
        var url = "file:///android_asset/www/" + args.url;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", args.path, true);

        xhr.addEventListener("load", function (evt) {
            if (this.readyState == 4) {

                if (("canvas" in args) && args.canvas) {
                    args.canvas.innerHTML = this.responseText;
                }

                if (("component" in args) && args.component) {
                    args.component((("param" in args) && args.param) ? args.param : null);
                }

                if (("callback" in args) && args.callback) {
                    args.callback((("param" in args) && args.param) ? args.param : null);
                }

                // var r = null;
                // try {
                //     r = JSON.parse(this.responseText);
                // }
                // catch (e) {
                //     r = this.responseText;
                // }
            }
        });
        xhr.send();
    },
};
CardCarouselComponent = function (param) {

    var dom = document.createElement('div');

    http.load({
        path: "packages/cards.carousel/card.component.html",
        canvas: dom,
        callback: function (response) {
            var cardCarouselComponent = param.canvas.querySelector('div[id="card-carousel-component"]');

            http.load({
                path: "packages/cards.carousel/cards.carousel.component.html",
                canvas: param.canvas,
                callback: function (response) {
                    var cardCarouselComponent = param.canvas.querySelector('div[id="card-carousel-component"]');

                    if ("callback" in param) {
                        param.callback({});
                    }
                }
            });
        }
    });

    this.bind = function (list) {
        var cardCarouselComponent = param.canvas.querySelector('div[id="card-carousel-component"]');
        cardCarouselComponent.removeAttribute("hide");

        cardCarouselComponent.innerHTML = "";
        if (list) {
            Array.prototype.forEach.call(list, function (item) {
                var card = dom.firstChild.cloneNode(true);
                card.addEventListener("mousedown", function (evt) {
                    if ("onClick" in param) {
                        param.onClick({
                            merchantID: this.getAttribute("merchant-id"),
                            data: item
                        });
                    }
                    evt.cancelBubble = true;
                    evt.preventDefault();
                })

                var cardTitle = card.querySelector('div[class="card-title"]');
                cardTitle.innerHTML = ("merchantName" in item) ? item.merchantName : "";

                var cardName = card.querySelector('div[class="card-text"]');
                cardName.innerHTML = ""; //app.accountDetails.firstName + " " + app.accountDetails.lastName;

                card.setAttribute("style", "width:" + (cardCarouselComponent.offsetWidth - 60) + "px");
                cardCarouselComponent.appendChild(card);


                // var pushpayButton = card.querySelector("button[pushpay-button]");
                // pushpayButton.setAttribute("merchant-id", item.merchantID);
                //     pushpayButton.addEventListener("mousedown", function (evt) {
                //         if("button" in param) {
                //             if("onClick" in param.button) {
                //                 param.button.onClick({
                //                     merchantID: this.getAttribute("merchant-id")
                //                 });
                //             }
                //         }

                //         evt.cancelBubble = true;
                //         evt.preventDefault();
                //     })
            });
        } else {
            param.canvas.setAttribute("hide", "");
        }
    }
}
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
var TransactionListComponent = function (param) {

    var dom = document.createElement('div');

    http.load({
        path: "packages/transaction.list/transaction.item.component.html",
        canvas: dom,
        callback: function (response) {
            var TransactionListComponent = param.canvas.querySelector('div[id="transaction-list-component"]');

            http.load({
                path: "packages/transaction.list/transaction.list.component.html",
                canvas: param.canvas,
                callback: function (response) {
                    var TransactionListComponent = param.canvas.querySelector('div[id="transaction-list-component"]');

                    if ("callback" in param) {
                        param.callback({});
                    }
                }
            });
        }
    });

    this.bind = function (dataSet) {
        var TransactionListComponent = param.canvas.querySelector('div[id="transaction-list-component"]');
        TransactionListComponent.removeAttribute("hide");

        TransactionListComponent.innerHTML = "";
        Array.prototype.forEach.call(dataSet, function (data) {

            var TransactionItem = dom.firstChild.cloneNode(true);
            TransactionListComponent.appendChild(TransactionItem);
            TransactionItem.addEventListener("mousedown", function (evt) {
                if ("onClick" in param) {
                    param.item.onClick({});
                }

                evt.cancelBubble = true;
                evt.preventDefault();
            })

            if ("item" in param) {
                if ("title" in param.item) {
                    // console.log(ORM.toDataObject(data, param.item.title));
                    var TransactionItemTitle = TransactionItem.querySelector('div[class="card-title"]');
                    TransactionItemTitle.innerHTML = ("title" in param.item) ? ORM.toDataObject(data, param.item.title) : "";
                    TransactionItemTitle.removeAttribute("hide");
                }

                if ("description" in param.item) {
                    var description = ORM.toDataObject(data, param.item.description);
                    var amount = ("amount" in param.item) ? ORM.toDataObject(data, param.item.amount) : 0.0;
                    var entry = ("entry" in param.item) ? param.item.entry : "";
                    var currency = ("currency" in param.item) ? param.item.currency : "";
                    
                    var TransactionItemDetail = TransactionItem.querySelector('div[class="card-text"]');
                    TransactionItemDetail.innerHTML = ("description" in param.item) ? (entry + ": " + currency + amount + " - " + description) : "";
                    TransactionItemDetail.removeAttribute("hide");
                }

                if ("date" in param.item) {
                    var TransactionItemDate = TransactionItem.querySelector('div[class="card-date"]');
                    TransactionItemDate.innerHTML = ("date" in param.item) ? ORM.toDataObject(data, param.item.date) : "";
                    TransactionItemDate.removeAttribute("hide");
                }
            }



        });
    }
};
var LabelComponent = function (param) {

    param["canvas"].innerHTML = '<div hide id="label-component" class="" text-size-13 text-align-center padding-0><div aria-label="title" heading-14 height-20px></div></div>'

    var timer;

    this.text = function (args) {
        param.canvas.firstChild.removeAttribute("hide");

        if ("title" in args) {
            var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
            titleLabel.innerHTML = args.title;
            titleLabel.removeAttribute("hide");
        }
    }

    this.error = function (args) {
        param.canvas.firstChild.removeAttribute("hide");

        var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
        titleLabel.setAttribute("hide", "");

        if ("title" in args) {
            titleLabel.innerHTML = args.title;
            titleLabel.removeAttribute("hide");
            titleLabel.setAttribute("text-danger", "");
        }

        timer = setTimeout(function () {

        }, 1000);
    }

    this.success = function (args) {
        param.canvas.firstChild.removeAttribute("hide");

        var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
        titleLabel.setAttribute("hide", "");

        if ("title" in args) {
            titleLabel.innerHTML = args.title;
            titleLabel.removeAttribute("hide");
            titleLabel.setAttribute("text-success", "");
        }

        timer = setTimeout(function () {

        }, 1000);
    }

    this.warning = function (args) {
        param.canvas.firstChild.removeAttribute("hide");

        var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
        titleLabel.setAttribute("hide", "");

        if ("title" in args) {
            titleLabel.innerHTML = args.title;
            titleLabel.removeAttribute("hide");
            titleLabel.setAttribute("text-warning", "");
        }

        timer = setTimeout(function () {

        }, 1000);
    }

    this.info = function (args) {
        param.canvas.firstChild.removeAttribute("hide");

        var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
        titleLabel.setAttribute("hide", "");

        if ("title" in args) {
            titleLabel.innerHTML = args.title;
            titleLabel.removeAttribute("hide");
            titleLabel.setAttribute("text-info", "");
        }

        timer = setTimeout(function () {

        }, 1000);
    }

    this.clear = function () {
        var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
        var messageLabel = param.canvas.firstChild.querySelector("div[aria-label='message']");

        titleLabel.removeAttribute("text-danger");
        titleLabel.removeAttribute("text-success");
        titleLabel.removeAttribute("text-warning");
        titleLabel.removeAttribute("text-info");

        messageLabel.removeAttribute("text-danger");
        messageLabel.removeAttribute("text-success");
        messageLabel.removeAttribute("text-warning");
        messageLabel.setAttribute("text-info");
    }

    this.close = function () {
        param.canvas.firstChild.setAttribute("hide", "");
    }

};
ListComponent = function (param) {

    var dom = document.createElement('div');

    http.load({
        path: "packages/list/list.item.component.html",
        canvas: dom,
        callback: function (response) {
            var listComponent = param.canvas.querySelector('div[id="list-component"]');

            http.load({
                path: "packages/list/list.component.html",
                canvas: param.canvas,
                callback: function (response) {
                    var listComponent = param.canvas.querySelector('div[id="list-component"]');

                    if ("callback" in param) {
                        param.callback({});
                    }
                }
            });
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
var LoaderComponent = function (param) {

    http.load({
        path: "packages/loader/loader.view.html",
        canvas: ((param) && ("canvas" in param)) ? param .canvas : document.getElementById("app-loader")
    });

    this.show = function (param) {
        var rootNode = document.getElementById("app-loader");
        var loader = document.getElementById('loader-component');
        loader.setAttribute("aria-busy", "true");
        loader.setAttribute("tabindex", "1");
        loader.focus();

        if (param && ("text" in param)) {
            var hint = loader.querySelector('div[class="hint"]');
            hint.innerHTML = param.text;
        }
    }

    this.hide = function () {
        var rootNode = document.getElementById("app-loader");
        var loader = document.getElementById('loader-component');
        if (loader) {
            loader.removeAttribute("aria-busy");
        }
    }

};
var AlertModalComponent = function () {

    _$this = this;

    var modal;
    http.load({
        path: "packages/modal/alert.modal.component.html",
        canvas: document.getElementById("app-modal"),
        callback: function () {
            modal = document.getElementById('alert-modal-component');
            closeButtons = modal.querySelectorAll("button[data-dismiss='modal']");

            Array.prototype.forEach.call(closeButtons, function (button) {
                button.addEventListener("mousedown", function (evt) {
                    close();
                });
                // .
            });
        }
    });

    close = function () {
        var modalBackDrop = document.getElementById('alert-modal-component-backdrop');
        modalBackDrop.classList.remove("show");
        modalBackDrop.removeAttribute("show");
        modalBackDrop.setAttribute("hide", "");

        var modal = document.getElementById('alert-modal-component');
        modal.classList.remove("show");
        modal.removeAttribute("show");
        modal.setAttribute("hide", "");

        document.body.classList.remove("modal-open");
    }

    this.show = function () {
        var modalBackDrop = document.getElementById('alert-modal-component-backdrop');
        modalBackDrop.classList.add("show");
        modalBackDrop.setAttribute("show", "");
        modalBackDrop.removeAttribute("hide");

        var modal = document.getElementById('alert-modal-component');
        modal.classList.add("show");
        modal.setAttribute("show", "");
        modal.removeAttribute("hide");
        
        document.body.classList.add("modal-open");
    }

    this.hide = function () {
        close();
    }

};
var ModalComponent = function () {

    _$this = this;

    var modal;
    http.load({
        path: "packages/modal/modal.component.html",
        canvas: document.getElementById("app-modal"),
        callback: function () {
            modal = document.getElementById('modal-component');
            closeButtons = modal.querySelectorAll("button[data-dismiss='modal']");

            Array.prototype.forEach.call(closeButtons, function (button) {
                button.addEventListener("mousedown", function (evt) {
                    close();
                });
                // .
            });
        }
    });

    close = function () {
        var modalBackDrop = document.getElementById('modal-component-backdrop');
        modalBackDrop.classList.remove("show");
        modalBackDrop.removeAttribute("show");
        modalBackDrop.setAttribute("hide", "");

        var modal = document.getElementById('modal-component');
        modal.classList.remove("show");
        modal.removeAttribute("show");
        modal.setAttribute("hide", "");

        document.body.classList.remove("modal-open");
    }

    this.show = function () {
        var modalBackDrop = document.getElementById('modal-component-backdrop');
        modalBackDrop.classList.add("show");
        modalBackDrop.setAttribute("show", "");
        modalBackDrop.removeAttribute("hide");

        var modal = document.getElementById('modal-component');
        modal.classList.add("show");
        modal.setAttribute("show", "");
        modal.removeAttribute("hide");
        
        document.body.classList.add("modal-open");
    }

    this.hide = function () {
        close();
    }

};
var ToastrComponent = function (param) {

    http.load({
        path: "packages/toastr/toastr.component.html",
        canvas: param.canvas,
        callback: function (response) {

        }
    });

    var timer;

    this.error = function (args) {
        param.canvas.firstChild.classList.add("border-danger");
        param.canvas.firstChild.removeAttribute("hide");

        var titleLabel = param.canvas.firstChild.querySelector("div[aria-label='title']");
        titleLabel.setAttribute("hide", "");

        var messageLabel = param.canvas.firstChild.querySelector("div[aria-label='message']");
        messageLabel.setAttribute("hide", "");

        if ("title" in args) {
            titleLabel.innerHTML = args.title;
            titleLabel.removeAttribute("hide");
            param.canvas.firstChild.setAttribute("text-danger", "");
        }
        if ("message" in args) {
            messageLabel.innerHTML = args.message;
            messageLabel.removeAttribute("hide");
        }
        if ("icon" in args) {
        }

        timer = setTimeout(function () {

        }, 1000);
    }

    this.success = function (args) {
        param.canvas.firstChild.classList.add("border-success");
        param.canvas.firstChild.removeAttribute("hide");

        if ("title" in args) {
            param.canvas.firstChild.querySelector("div[aria-label='title']").innerHTML = args.title;
            param.canvas.firstChild.setAttribute("text-success", "");
        }
        if ("message" in args) {
            param.canvas.firstChild.querySelector("div[aria-label='message']").innerHTML = args.message; 
            param.canvas.firstChild.setAttribute("height-100px", "");
        }
    }

    this.warning = function (args) {
        param.canvas.firstChild.classList.add("border-warning");
        param.canvas.firstChild.removeAttribute("hide");

        if ("title" in args) {
            param.canvas.firstChild.querySelector("div[aria-label='title']").innerHTML = args.title;
            param.canvas.firstChild.setAttribute("text-warning", "");
        }
        if ("message" in args) {
            param.canvas.firstChild.querySelector("div[aria-label='message']").innerHTML = args.message;
        }
        if ("icon" in args) {
            // param.canvas.firstChild.querySelector("div[aria-label='icon']").innerHTML = args.message;
        }
    }

    this.info = function (args) {
        param.canvas.firstChild.classList.add("border-info");
        param.canvas.firstChild.removeAttribute("hide");

        if ("title" in args) {
            param.canvas.firstChild.querySelector("div[aria-label='title']").innerHTML = args.title;
            param.canvas.firstChild.setAttribute("text-info", "");
        }
        if ("message" in args) {
            param.canvas.firstChild.querySelector("div[aria-label='message']").innerHTML = args.message;
        }
    }

    this.close = function () {
        param.canvas.firstChild.setAttribute("hide", "");
    }

};
(function (DOMParser) {

	"use strict";
	var DOMParser_proto = DOMParser.prototype,
		real_parseFromString = DOMParser_proto.parseFromString;

	DOMParser_proto.parseFromString = function (markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var doc = document.implementation.createHTMLDocument(""),
				doc_elt = doc.documentElement,
				first_elt;

			doc_elt.innerHTML = markup;
			first_elt = doc_elt.firstElementChild;

			if (doc_elt.childElementCount === 1
				&& first_elt.localName.toLowerCase() === "html") {
				doc.replaceChild(first_elt, doc_elt);
			}

			return doc;
		}
		else {
			return real_parseFromString.apply(this, arguments);
		}
	};

	DOMParser_proto.parseFromDOM = function (dom) {
		var context = document.createElement("div");
		context.appendChild(dom);
		return context.innerHTML;
	};

}(DOMParser));
(elementObject = function (e) {
	var e = e.prototype;

	e.getElementsByTagType = function (attr) {
		var nodeList = this.getElementsByTagName("*");
		var nodeArray = [];
		for (var i = 0, elem; elem = nodeList[i]; i++) {
			if (elem.nodeName == "A") {
				nodeArray.push(elem);
			}
		}
		return nodeArray;
	};
	e.getElementsByAttribute = function (attr, value) {
		var nodeList = this.getElementsByTagName("*"),
			nodeArray = [];
		for (var i = 0, elem; elem = nodeList[i]; i++) {
			if (value) {
				if (elem.getAttribute(attr) == value) {
					nodeArray.push(elem);
				}
			}
			else {
				if (elem.hasAttribute(attr)) {
					nodeArray.push(elem);
				}
			}
		}
		return (nodeArray.length > 0) ? nodeArray
			: null;
	};
	e.getElementByAttribute = function (attr, value) {
		var nodeList = this.getElementsByTagName("*"),
			node = null;

		// for (var i = 0, elem; elem = nodeList[i]; i++)
		for (var i = nodeList.length - 1, elem; elem = nodeList[i]; i--) {
			if (value) {
				if (elem.getAttribute(attr) == value) {
					node = elem;
				}
			}
			else {
				if (elem.hasAttribute(attr)) {
					node = elem;
				}
			}
		}
		return node;
	};

	e.getOffsetLeft = function (evt) {
		var parent = this.offsetParent;
		var e = new MouseEvent(evt || event);
		var offsetX = 0;
		do {
			offsetX += parent.offsetLeft;
		} while (parent = parent.offsetParent);
		return offsetX;
	};
	e.getOffsetTop = function (evt) {
		var parent = this.offsetParent;
		var e = new MouseEvent(evt || event);
		var offsetY = 0;
		do {
			offsetY += parent.offsetTop;
		} while (parent = parent.offsetParent);
		return offsetY;
	};
	e.getOffsetIndexByAttribute = function (attr) {
		// console.log(this);
		//
		return this.parentNode;
	};
	e.getText = function () {
		return this.value;
	};
	e.getCssProperty = function (propty) {
		var style = window.getComputedStyle(this);
		return style.getPropertyValue(propty);
	};
	e.getDisabled = function () {
		return this.getAttribute("aria-disabled");
	};
	e.getSelected = function () {
		return this.getAttribute("aria-selected");
	};
	e.getAttributes = function () {
		var attributes = {};
		Array.prototype.forEach.call(this.attributes, function (attributePair, index) {
			attributes[attributePair.name] = attributePair.value;
		});
		return attributes;
	};

	e.removeAttributes = function (attributes) {
		var elem = this;
		Object.keys(attributes).map(function (key) {
			elem.removeAttribute(key);
		});
	};

	e.setAttributes = function (attributes) {
		var elem = this;
		Object.keys(attributes).map(function (key) {
			if ((null != attributes[key]) && (typeof attributes[key] != 'object') && (typeof attributes[key] != 'function'))
				elem.setAttribute(key, attributes[key]);
		});
	};
	e.setText = function (value) {
		this.value = value;
	};
	e.setCssProperty = function (propty, value) {
		this.style[propty] = value;
	};
	e.setCssProperties = function (attributes) {
		var elem = this;
		Object.keys(attributes).map(function (key) {
			if ((null != attributes[key]) && (typeof attributes[key] != 'object'))
				elem.setCssProperty(key, attributes[key]);
		});
	};
	e.setDisabled = function (state) {
		if (state) {
			this.setAttribute("aria-disabled", "true");
		}
		else {
			this.removeAttribute("aria-disabled");
		}
	};
	e.setVisible = function (state) {
		if (state) {
			this.setAttribute("aria-visible", "true");
		}
		else {
			this.setAttribute("aria-visible", "false");
		}
		// console.log(this);
	};
	e.setFocus = function (state) {
		var el = this;
		if (state) {
			setTimeout(function () {
				el.focus();
			}, 100);
		}
		else {
			this.blur();
		}
	};
	e.setSelected = function (state) {
		if (state) {
			this.setAttribute("aria-selected", "true");
		}
		else {
			this.removeAttribute("aria-selected");
		}
	};
	e.setBusy = function (state) {
		if (state) {
			this.setAttribute("busy", "true");
		}
		else {
			this.removeAttribute("busy");
		}
	};
	e.setProgress = function (value) {
		var progress = this.getElementsByClassName("progress").item(0);
		progress.setAttribute("style", "width:" + value + "%;");
	};
	e.setImage = function (url) {
		var elem = this;
		var imgElem = elem.getElementsByTagName("img").item(0);

		var image = new Image();
		image.setAttribute("src", url);
		image.addEventListener("load", function (evt) {
			var imagePnl = elem.getElementsByClassName("image-placeholder").item(0);
			// console.log(imagePnl);
			if(imagePnl) {
				imagePnl.setAttributes({
					"style": "background-image: url('" + this.src + "');",
					"data-url": url,
					"show": "true"
				});
			}
			else {
				elem.setAttributes({
					"style": "background-image: url('" + this.src + "');",
					"data-url": url,
					"show": "true"
				});
			}

			elem.removeAttribute("uploading");
			elem.removeAttribute("loading");
		});
	};


	e.hasClass = function (className) {
		return this.classList.contains(className);
	};
	e.hasParent = function (parent) {
		var state = false;
		if (this.parentNode == parent)
			state = true;
		return state;
	};
	e.clear = function () {
		switch (this.nodeName) {
			case "SELECT":
				while (this.options.length > 0) {
					this.remove(0);
				};
				break;
			case "INPUT":
				this.value = "";
				break;
			default:
				this.innerHTML = "";
				break;
		};
	};
	e.isEmpty = function () {
		switch (this.nodeName) {
			case "SELECT":
				return this.options.length;
			case "INPUT":
				return this.value.trim() == "";
			case "TEXTAREA":
				return this.value === "";
			default:
				return this.innerHTML == "";
		};
	};


	e.isSelected = function () {
		return this.hasAttribute("aria-selected");
	};
	e.isDisabled = function () {
		return this.hasAttribute("aria-disabled");
	};
	e.isChecked = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			return this.hasAttribute("aria-checked");
		}
	};


	// Checkbox
	//
	e.check = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			if (!this.hasAttribute("aria-checked")) {
				this.setAttribute("aria-checked", "true");
			}
		}
	};
	e.unCheck = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			if (this.hasAttribute("aria-checked")) {
				this.removeAttribute("aria-checked");
			}
		}
	};
	e.toggleCheckState = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			if (this.hasAttribute("aria-checked")) {
				this.removeAttribute("aria-checked");
				return null;
			}
			else {
				this.setAttribute("aria-checked", "true");
				return this.hasAttribute("id") ? this.getAttribute("id") : null;
			}
		}
	};


	// **MARK FOR UPDATE** 
	// Hide Drop Down Callout
	e.hideCallout = function (evt) {
		var doc = document;
		var dom = doc.body;

		var dropdowns = dom.getElementsByAttribute("show-dropdown");
		if (null != dropdowns) {
			Array.prototype.forEach.call(dropdowns, function (dropdown) {
				dropdown.removeAttribute("aria-selected");
				
				if(dropdown.hasAttribute("show-dropdown"))
					dropdown.removeAttribute("show-dropdown");
			});
		}

		var sidecallouts = dom.getElementsByAttribute("role", "sidecallout");
		if (null != sidecallouts) {
			Array.prototype.forEach.call(sidecallouts, function (sidecallout) {
				sidecallout.removeAttribute("show");
			});
		}
	};

	e.trim = function(evt) {
		switch (this.nodeName) {
			case "INPUT":
				return this.value.trim();
			case "TEXTAREA":
				return this.value.trim();
			default:
				return this.innerHTML.trim();
		};
	};
	
	e.text = function () {
		switch (this.nodeName) {
			case "SELECT":
				return this.options[this.selectedIndex].value;
			//break;
			case "INPUT":
				return this.value;
			//break;
			default:
				return this.innerHTML;
			//break;
		};
	};

}(Element));
(function (_String) {
	var String_proto = _String.prototype;
	String_proto.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
	String_proto.empty = function () {
		var str = this.toString().replace(/^\s+|\s+$/g, '');
		if (str == "")
			return true;
	};
	String_proto.explode = function (delmtr) {
		return this.split(delmtr);
	};
	String_proto.concatWord = function (delmtr) {
		var res = "";
		this.split(delmtr).map(function (itm) {
			res += itm;
		}); return res;
	};
	String_proto.toCurrency = function (currency) {
		var result = parseFloat(this).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
		return currency + result.substr(1);
	};
	String_proto.format = function (style) {
		var result = parseFloat(this).toLocaleString("en-US");
		return result;
	};
}(String));
(function (_Array) {
	var arr = _Array.prototype;
	arr.clear = function () {
		while (this.length > 0) {
			this.pop();
		}
	};

	arr.getOffsetPositionOf = function () {
		// ...
	};
}(Array));
(function (_Object) {
	var obj = _Object.prototype;

	obj.getElementOffsetIndexByAttribute = function (attr) {
		var selectedItem = null;
		var selectedIndex = 0;

		for (var i = 0, itm; itm = this[i]; i++) {
			if (itm.hasAttribute(attr)) {
				selectedItm = itm;
				selectedIndex = i;
				break;
			};
		}

		return selectedIndex;
	};

	obj.indexer = function (notation) {
		// ...
	};

	obj.merge = function(data) {

		// if (data) {
		// 	var _$this = this;
		// 	Object.keys(this).map(function (key, index) {
		// 		data[key] = _$this[key];
		// 	});
		// }
		// return data;

		if(data) {
			Object.keys(data).map(function(key, index) {
				this[key] = data[key];
			});
		}
		return this;
	};

	obj.clear = function() {
		return {};
	}

}(Object));
(function (_Date) {
	var Date_proto = _Date.prototype;

	Date_proto.getMonthName = function (month) {
		return this.monthNames[month];
	};
	Date_proto.getShortMonthName = function (month) {
		return this.monthNames[month].substr(0, 3);
	};
	Date_proto.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}(Date));

isKeyCodeAlphanumeric = function (keyCode) {
	return /[a-zA-Z0-9-_ ]/.test(String.fromCharCode(event.keyCode));
};

MouseEvent = function (evt) {
	if (evt) {
		this.e = evt;
	} else {
		this.e = window.event;
	};

	if (evt.pageX) {
		this.x = evt.pageX
	} else {
		this.x = evt.clientX;
	};

	if (evt.pageY) {
		this.y = evt.pageY
	} else {
		this.y = evt.clientY;
	};

	if (evt.target) {
		this.target = evt.target;
	} else {
		this.target = evt.srcElement
	};
};

parseBindingAttribute = function (bindingAttribute) {
	var bindingProperties = bindingAttribute;
	bindingProperties = bindingProperties.substr((bindingProperties.indexOf("{") + 1), (bindingProperties.lastIndexOf("}") - 1)).toString();
	bindingProperties = bindingProperties.split(",");

	var attributes = Array();
	var attributes = {};
	Array.prototype.forEach.call(bindingProperties, function (propertyPair, index) {
		propertyPair = propertyPair.split("=");
		attributes[propertyPair[0].trim()] = propertyPair[1].trim();
	});
	return attributes;
};

parseNotation = function (notation) {
	return notation.substr(notation.lastIndexOf('.') + 1);
};

parseEnum = function (enumStr) {
	var enumStr = enumStr.substr((enumStr.indexOf("(") + 1), (enumStr.lastIndexOf(")") - 1));
	var enumElements = enumStr.split("|");
	var enumValues = {};
	Array.prototype.forEach.call(enumElements, function (elem, indx) {
		enumValues[indx] = elem;
	});
	return enumValues;
};

parseUrl = function (query) {
	var match,
		pl = /\+/g, // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) {
			return decodeURIComponent(s.replace(pl, " "));
		},

		urlParams = {};
	while (match = search.exec(query)) {
		// urlParams[decode(match[1])] = decode(match[2]);
		urlParams[match[1]] = match[2];
	};
	return urlParams;
};

var ORM = {
	// maps server side data to controls bindingsource
	// ...
	toDataObject: function (dataObject, sourceNotation) {
		sourceNotation = (typeof sourceNotation === "string") ? sourceNotation.split(".") : sourceNotation;
		var arrIndex = sourceNotation.shift();

		try {
			// Perform a recursive test for nested object
			//
			if ((null != dataObject) && (arrIndex in dataObject) && ((typeof dataObject[arrIndex] == "object") && !(dataObject[arrIndex] instanceof Array))) {
				return ORM.toDataObject(dataObject[arrIndex], sourceNotation);
			} else {
				if ((null != dataObject) && (arrIndex in dataObject)) {
					var response = dataObject[arrIndex];

					// var searchWord = "<div></div>";
					// var search = new RegExp(searchWord, "g");
					// var textResponse = dataObject[arrIndex].replace(search, "");
					// console.log(textResponse);
					
					return response;
				} else {
					return ORM.toDataObject(dataObject, sourceNotation);
				}
			}
		} catch (e) {
			// ...
		}

	},

	// Maps controls bindingsource data to server side data
	// ...
	toBindingSource: function (sourceNotation, value) {
		dataObject = {};
		ORM.createBindingSourceObject(dataObject, sourceNotation, value);
		return dataObject;
	},

	//
	// ...
	createBindingSourceObject: function (dataObject, newKey, value) {
		var keys = Object.keys(dataObject);
		if (keys.length > 0) {
			keys.map(function (key, indx) {
				if ((typeof dataObject[keys[indx]] == "object") && !(dataObject[keys[indx]] instanceof Array)) {
					ORM.createBindingSourceObject(dataObject[keys[indx]], newKey, value);
				} else {
					dataObject[keys[indx]] = new Object();
					dataObject[keys[indx]][newKey] = value;
				}
			});
		} else {
			dataObject[newKey] = value;
		}
	},

	//
	// ...
	createArrayBindingSourceObject: function (dataObject, notationItem, newKey, value) {
		var keys = Object.keys(dataObject);
		if (keys.length > 0) {
			keys.map(function (key, indx) {
				if ((typeof dataObject[keys[indx]] == "object") && !(dataObject[keys[indx]] instanceof Array)) {
					ORM.createArrayBindingSourceObject(dataObject[keys[indx]], notationItem, newKey, value);
				} else {
					dataObject[keys[indx]] = new Object();
					var values = value;
					var collection = Array();
					Array.prototype.forEach.call(values, function (value, index) {
						var newObject = {};
						newObject[newKey] = value;
						collection.push(newObject);
					});
					dataObject[keys[indx]][notationItem] = collection;
				}
			});
		} else {
			dataObject[notationItem] = new Object();
			var values = value;
			var collection = Array();
			Array.prototype.forEach.call(values, function (value, index) {
				var newObject = {};
				newObject[newKey] = value;
				collection.push(newObject);
			});
			dataObject[notationItem] = collection;
		}
	}
};


ClipBoard = function () {
	// ...
};

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
getFunctionParameterNames = function (func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
};

microtime = function (getAsFloat) {
	var s, now, multiplier;

	if (typeof performance !== 'undefined' && performance.now) {
		now = (performance.now() + performance.timing.navigationStart) / 1000;
		multiplier = 1e6; // 1,000,000 for microseconds
	} else {
		now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
		multiplier = 1e3; // 1,000
	}

	// Getting microtime as a float is easy
	if (getAsFloat) {
		return now;
	}

	// Dirty trick to only get the integer part
	s = now | 0;

	return (Math.round((now - s) * multiplier) / multiplier) + ' ' + s;
};

toggleFullScreen = function (element, state) {
	if (state) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
};


validateEmail = function (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};
var customerComponent = function (args) {

    var customer, cardCarouselComponent, customerGreetingLabel;

    getGreetingTime = function () {
        var myDate = new Date();
        var hrs = myDate.getHours();

        var greet;

        if (hrs < 12)
            greet = 'Good morning! ';
        else if (hrs >= 12 && hrs <= 17)
            greet = 'Good afternoon! ';
        else if (hrs >= 17 && hrs <= 24)
            greet = 'Good evening! ';

        return greet;
    };

    getTransactionHistory = function () {

        http.post({
                url: app.apiUrl + "/accounts/getAccountTransactions",
                data: {
                    accountID: app.accountDetails.id,
                    rowsPerPage: 5
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                if (app.accountTransactionHistory) {
                    transactionHistoryList.bind(app.accountTransactionHistory.data);
                }
            },
            function (error) {
                app.loader.hide();
                // label.error({
                //     message: "Oops!, something went wrong",
                // });
            });
    };


    (function () {
        
    })();


}
var masterDetailsComponent = function (args) {

    var $this = this;

    window.addEventListener("mousedown", function (evt) {

    });


    var rootNode = document.getElementById("app-root");
    var appMaster = document.getElementById('app-master');

    var searchTextField = document.getElementById("search-field");
    var searchTextButton = document.getElementById("search-button");
    searchTextButton.addEventListener("mousedown", function (evt) {
        crawlWeb();
        
        evt.cancelBubble = true;
        evt.preventDefault();
    });


    // Details Callout
    var detailsCalloutView = document.getElementById("details-callout-view");
    detailsCalloutView.addEventListener("mousedown", function (evt) {
        $this.hideDetailsCallout();
        evt.cancelBubble = true;
        evt.preventDefault();
    });

    var detailsCalloutViewPanel = document.querySelector("div[data-section=\"details-callout-view-panel\"]");
    detailsCalloutViewPanel.addEventListener("mousedown", function (evt) {
        evt.cancelBubble = true;
        evt.preventDefault();
    });



    // public
    this.loader = new LoaderComponent({
        canvas: document.getElementById("details-body")
    });

    this.hideDetailsCallout = function () {
        detailsCalloutView.removeAttribute("show-callout", "");
        setTimeout(function () {
            detailsCalloutView.setAttribute("hide", "");
        }, 100);
    };

    this.showDetailsCallout = function () {
        detailsCalloutView.removeAttribute("hide");
        setTimeout(function () {
            detailsCalloutView.setAttribute("show-callout", "");
        }, 100);
    };


    // private
    crawlWeb = function () {
        $this.loader.show();
        console.log(app.locationDetails);
        var location = "IE";
        http.get({
                url: "http://localhost:8020/search/" + searchTextField.value + " in " + app.locationDetails.country
            },
            function (response) {
                $this.loader.hide();

                http.load({
                    path: "components/products/products.component.html",
                    canvas: document.getElementById("details-body"),
                    component: productsComponent,
                    param: {
                        root: $this,
                        products: response.data
                    }
                });
            },
            function (error) {
                $this.loader.hide();
                
            });
    };

    setTimeout(function () {
        crawlWeb();
    }, 1000);


    //Harburger click
    var hamburgerButton = document.getElementById("hamburger-button");
    hamburgerButton.addEventListener("mousedown", function(evt) {
     document.getElementById("getUser").innerHTML ="Hello, "+ app.userData.firstName;
      slidableMenuPanel.classList.add("show-slidable-panel");
      evt.cancelBubble = true;
      evt.preventDefault();
    });
    
    var slidableMenuPanel = document.getElementById("slidable-menu-panel");
    window.addEventListener("mousedown", function(event) {
      slidableMenuPanel.classList.remove("show-slidable-panel");
    });

    //Redirect to wishlist page
    var wishlistButton = document.getElementById("wishlist-btn");
    wishlistButton.addEventListener("mousedown", function (evt) {
        app.getItemFromWishList();
        http.load({
            path: "components/wishlist/wishlist.component.html",
            canvas: document.getElementById("app-root"),
            component: wishListComponent,
            param: null
        });
    });

     //Log out page
     var logoutButton = document.getElementById("logout-btn");
     logoutButton.addEventListener("mousedown", function (evt) {
        http.load({
            path: "components/user.account/login.component.html",
            canvas: document.getElementById("app-root"),
            component: loginComponent,
            param: null
        });
     });


     app["getItemFromWishList"] = function (callback) {
        http.post({
            url: "http://localhost:8020/get-wishlist/",
            data: {
                userID: app.userData._id,  
            },
            header: [{
                key: "Content-Type",
                value: "application/x-www-form-urlencoded; charset=UTF-8"
            }]
        },
        function (response) {
            app.loader.hide();
            var result = response.data;
            console.log(result);
            if(result.statusCode == 200) {
                app["wishlist"] = result.wishlist;
                if(callback) {
                    callback();
                }
            } else {
                var errorToastr = app.toastr("error-toastr");
                errorToastr.show();
                errorToastr.setText(result.message);
            }
             
            // if(result) {
            //      errorToastr.innerHTML = result.message;
            // }
        },
        function (error) {
            // app.loader.hide();
            // label.error({
            //     message: "Oops!, something went wrong",
            // });
        });
    };
    
};
var productComponent = function (args) {

    var errorToastr = document.getElementById("error-toastr");

    var $this = this;

    this.render = function (product) {

        var productComponentDom = document.getElementById("product-component");
        productComponentDom.setAttribute("cid", product.details[productComponentDom.getAttribute("data-label")]);

        // display image
        var productImage = productComponentDom.querySelector("img");
        productImage.setAttribute("src", product.image);

        // display title
        var productTitle = productComponentDom.querySelector("h5[data-label=\"t\"]");
        productTitle.innerHTML = product.details[productTitle.getAttribute("data-label")];

        // view details link
        var productVisitShopLink = productComponentDom.querySelector("div[visit-shop-link]");
        productVisitShopLink.addEventListener("mousedown", function (evt) {
            if (evt.button == 0) {
                var ref = window.open(encodeURI(product.details.purl), '_blank', 'location=yes');
                console.log(product.details);
            }
        });

        // add to wishlist link
        var productAddWishlistLink = productComponentDom.querySelector("div[add-wishlist-link]");
        productAddWishlistLink.addEventListener("mousedown", function (evt) {
           addItemToWishlist();
        });
    
        addItemToWishlist = function () {
            http.post({
                url: "http://localhost:8020/add-wishlist",
                data: {
                    userID: app.userData._id,
                    productID: product.details.cid,
                    productName: product.details.t,
                    productImage: product.image,
                    productShopUrl: product.details.purl     
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                var result = response.data;
                if(result) {
                     errorToastr.innerHTML = result.message;
                }
            },
            function (error) {
                // app.loader.hide();
                // label.error({
                //     message: "Oops!, something went wrong",
                // });
            });
        }
    };

   
    // app.loader.hide();
    this.render(args.product);

}
var productsComponent = function (args) {

    var $this = this;

    // app.loader.hide();
    var productsComponentDom, productsList, dom;

    var localStorage = [];

    getImage = function (url, callback) {
        http.post({
                url: "http://localhost:8020/get-image-data",
                data: {
                    url: url
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                // app.loader.hide();
                callback(response.data);
            },
            function (error) {
               
            });
    };

    this.render = function (products) {
        Array.prototype.forEach.call(products, function (product) {
            
            localStorage[product["details"]["cid"]] = product;

            var productDOMNode = dom.firstChild.cloneNode(true);
            productDOMNode.setAttribute("cid", product.details[productDOMNode.getAttribute("data-label")]);

            // display image
            var productImage = productDOMNode.querySelector("img");
            productImage.setAttribute("src", product.image);

            // display shop link
            var productUrl = productDOMNode.querySelector("a");
            productUrl.addEventListener("mousedown", function (evt) {
                if (evt.button == 0) {
                    args.root.showDetailsCallout();
                    $this.viewDetails(productDOMNode.getAttribute("cid"));
                }
            });

            // view details link
            var productViewDetailsLink = productDOMNode.querySelector("div[view-details-link]");
            productViewDetailsLink.addEventListener("mousedown", function (evt) {
                if (evt.button == 0) {
                    args.root.showDetailsCallout();
                    $this.viewDetails(productDOMNode.getAttribute("cid"));
                }
            });
            // Add to wishlist
            var productAddWishlistLink = productDOMNode.querySelector("div[add-wishlist-link]");
            productAddWishlistLink.addEventListener("mousedown", function (evt) {
                var product = localStorage[productDOMNode.getAttribute("cid")];
                http.post({
                            url: "http://localhost:8020/add-wishlist",
                            data: {
                                userID: app.userData._id,
                                productID: product.details.cid,
                                productName: product.details.t,
                                productImage: product.image,
                                productShopUrl: product.details.purl     
                            },
                            header: [{
                                key: "Content-Type",
                                value: "application/x-www-form-urlencoded; charset=UTF-8"
                            }]
                        },
                        function (response) {
                            app.loader.hide();
                            var result = response.data;
                            if(result) {
                                // errorToastr.innerHTML = result.message;
                                alert(result.message);
                            }
                        },
                        function (error) {
                            
                        });
            });

            productsList.appendChild(productDOMNode);
        });
    };

    this.viewDetails = function (cid) {
        http.load({
            path: "components/products/product.component.html",
            canvas: document.getElementById("details-callout-view-panel"),
            component: productComponent,
            param: {
                root: $this,
                product: localStorage[cid]
            }
        });
    };
   

    productsComponentDom = document.getElementById("products-component");
    productsList = productsComponentDom.querySelector("div[data-section='product-list']");

    dom = document.createElement('div');
    dom.appendChild(productsList.querySelector("div[data-section='product-item']"));

    productsList.innerHTML = "";

    this.render(args.products);

};
var loginComponent = function (args) {


    var login;

    var emailTextbox = document.getElementById("email-txt");
    var passwordTextbox = document.getElementById("password-txt");
    var signInButton = document.getElementById("signin-btn");
    var registerButton = document.getElementById("register-btn");
    var errorToastr = document.getElementById("error-toastr");

    verifyUser = function () {
        http.post({
                url: "http://localhost:8020/verify-user",
                data: {
                    email: emailTextbox.value,
                    password: passwordTextbox.value
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                let auth = response.data;

                if (auth.statusCode == 200) {
                    app["userData"] = auth.userData;
                    http.load({
                        path: "components/master.details/master.details.component.html",
                        canvas: document.getElementById("app-root"),
                        component: masterDetailsComponent,
                        param: null
                    });
                } else {
                    errorToastr.innerHTML = auth.message;
                }
            },
            function (error) {
                app.loader.hide();
               
            });
    };


    signInButton.addEventListener("mousedown", function (evt) {
        verifyUser();
    });

    registerButton.addEventListener("mousedown", function (evt) {
        http.load({
            path: "components/user.account/register.component.html",
            canvas: document.getElementById("app-root"),
            component: registerComponent,
            param: null
        });
    });

}
var registerComponent = function (args) {

    // Na your own to do

    var register;

    //Getting the id's from the register page textboxes
    var firstNameTextbox = document.getElementById("firstName-txt");
    var lastNameTextbox = document.getElementById("lastName-txt");
    var emailTextbox = document.getElementById("email-txt");
    var passwordTextbox = document.getElementById("password-txt");
    var cPasswordTextbox = document.getElementById("cPassword-txt");
    var signInButton = document.getElementById("signin-btn");
    var registerButton = document.getElementById("register-btn");
    var errorToastr = document.getElementById("error-toastr");

    function validateForm() {
        if (firstNameTextbox == "") {
          return false;
        }
            if(lastNameTextbox == ""){
                return false;
        }
    
        if(passwordTextbox == ""){
            return false;
            }
        if(cPasswordTextbox == "" && (cPasswordTextbox != passwordTextbox)){
                return false;
        }    
    }

    //Getting the values from the register page textboxes
    registerUser = function () {
        validateForm();
        http.post({
                url: "http://localhost:8020/register-user",
                data: {
                    firstName: firstNameTextbox.value,
                    lastName: lastNameTextbox.value,
                    email: emailTextbox.value,
                    password: passwordTextbox.value,
                    cPassword: cPasswordTextbox.value
                },
                header: [{
                    key: "Content-Type",
                    value: "application/x-www-form-urlencoded; charset=UTF-8"
                }]
            },
            function (response) {
                app.loader.hide();
                let auth = response.data;
                console.log(auth);

                if (auth.statusCode == 200) {
                    http.load({
                        path: "components/user.account/login.component.html",
                        component: loginComponent,
                        canvas: document.getElementById("app-root"),
                        param: null
                    });
                } else {
                    errorToastr.innerHTML = auth.message;
                }
            },
            function (error) {
                app.loader.hide();
            });
    };


    signInButton.addEventListener("mousedown", function (evt) {
        //verifyUser();
        http.load({
            path: "components/user.account/login.component.html",
            canvas: document.getElementById("app-root"),
            component: loginComponent,
            param: null
        });
    });

    registerButton.addEventListener("mousedown", function (evt) {
        registerUser();
    });

}
var wishListComponent = function (args) {

  var errorToastr = app.toastr("error-toastr");

  // var date = new Date();
  //     date.setDate(date.getDate()-15);

  // console.log(date);


  //Harburger click
  var hamburgerButton = document.getElementById("hamburger-button");
  hamburgerButton.addEventListener("mousedown", function (evt) {
    document.getElementById("getUser").innerHTML = "Hello, " + app.userData.firstName;
    slidableMenuPanel.classList.add("show-slidable-panel");
    evt.cancelBubble = true;
    evt.preventDefault();
  });

  var slidableMenuPanel = document.getElementById("slidable-menu-panel");
  window.addEventListener("mousedown", function (event) {
    slidableMenuPanel.classList.remove("show-slidable-panel");
  });

  getList = function() {
    errorToastr.setText("Items more than 30 days are removed automatically");
    var items = app.wishlist;
    if (items != null) {
      // var before = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 14).toISOString();
      // items = items.filter(function (item) {
      //   return (item.date !== before);
      // });
      var wishListDOMObject = document.getElementById("wish-list-page");
      wishListDOMObject.clear();
      items.forEach(function (item) {

        var productContainer = document.createElement("a");
        productContainer.addEventListener("mousedown", function (evt) {
          var ref = window.open(encodeURI(item.productShopUrl), '_blank', 'location=yes');
        });
        productContainer.id = 'product-Name';
        productContainer.href = '#';
        productContainer.className = 'list-group-item list-group-item-action wishListContent';
        var product_Image = document.createElement("img");
        product_Image.src = item.productImage;
        var product = document.createElement("div");
        product.className = 'd-flex w-100 justify-content-between';
        var productNam = document.createElement("h3");
        productNam.className = 'mb-1';
        var textproductName = document.createTextNode(item.productName);
        productNam.appendChild(textproductName);
        product.appendChild(productNam);

        var shopUrl = document.createElement("p");
        shopUrl.id = 'linkUrl';
        shopUrl.className = 'mb-1';
        var textshopUrl = document.createTextNode(item.productShopUrl);
        shopUrl.appendChild(textshopUrl);

        var removeItem = document.createElement("button");
        removeItem.addEventListener("mousedown", function (evt) {
          removeItemToWishlist(item);
        });
        removeItem.id = 'removeId';
        removeItem.className = 'wishlistRemoveButton';
        removeItem.innerHTML = 'remove';

        productContainer.appendChild(product_Image);
        productContainer.appendChild(product);
        productContainer.appendChild(shopUrl);
        wishListDOMObject.appendChild(productContainer);
        wishListDOMObject.appendChild(removeItem);
      });
    }

  }
  removeItemToWishlist = function (item) {
    http.post({
      url: "http://localhost:8020/remove-wishlist",
      data: {
        userID: app.userData._id,
        productID: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        productShopUrl: item.productShopUrl
      },
      header: [{
        key: "Content-Type",
        value: "application/x-www-form-urlencoded; charset=UTF-8"
      }]
    },
      function (response) {
        app.loader.hide();
        var result = response.data;
        if (result) {
          errorToastr.setText(result.message);
          errorToastr.show();
          app.getItemFromWishList(getList);
        }
      },
      function (error) {
        // app.loader.hide();
        // label.error({
        //     message: "Oops!, something went wrong",
        // });
      });

  }
  //Redirect to dashboard page
  var nameLinkButton = document.getElementById("name-btn");
  nameLinkButton.addEventListener("mousedown", function (evt) {
    http.load({
      path: "components/master.details/master.details.component.html",
      canvas: document.getElementById("app-root"),
      component: masterDetailsComponent,
      param: null
    });
  });

  //Log out page
  var logoutButton = document.getElementById("logout-btn");
  logoutButton.addEventListener("mousedown", function (evt) {
    http.load({
      path: "components/user.account/login.component.html",
      canvas: document.getElementById("app-root"),
      component: loginComponent,
      param: null
    });
  });

  document.onload = getList();

};


