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