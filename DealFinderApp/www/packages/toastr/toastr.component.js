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