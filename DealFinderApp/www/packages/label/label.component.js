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