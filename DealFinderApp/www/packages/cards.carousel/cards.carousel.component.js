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