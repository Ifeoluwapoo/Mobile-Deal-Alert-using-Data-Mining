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