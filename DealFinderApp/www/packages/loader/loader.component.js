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