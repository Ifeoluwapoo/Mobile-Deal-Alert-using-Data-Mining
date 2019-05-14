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