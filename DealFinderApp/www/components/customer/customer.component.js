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