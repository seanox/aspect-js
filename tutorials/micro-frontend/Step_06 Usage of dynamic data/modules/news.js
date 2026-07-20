// Imports the connector with the #import-macro. Since the connector in turn
// uses the #export-macro, it can then be used in the global scope.
#import connector;

const API_HOST_URL = window.location.contextPath + "/api/" + DataSource.locale;
const API_LIST_MARKET_URL = API_HOST_URL + "/listMarket";
const API_LIST_DATATYPES_URL = API_HOST_URL + "/listDatatype";
const API_SEARCH_NEWS_URL = API_HOST_URL + "/searchNews";
const API_SEND_NEWSLETTER_URL = window.location.contextPath + "/api/sendNewsletter";
const API_MEDIA_IMAGES_URL = window.location.contextPath + "/api/media/";

const news = Reactive({
    market: {
        list: null,
        value: "",
        onChange() {
            if (this.value) {
                connector.call("GET", API_LIST_DATATYPES_URL + "/" + this.value, null, (status, json) => {
                    if (status instanceof Error)
                        throw status;
                    news.datatype.list = json;
                    news.datatype.value = "";
                });
            }
        }
    },
    datatype: {
        list: null,
        value: ""
    },
    list: {
    },
    function: {
    },
    recipients: {
    }
});

connector.call("GET", API_LIST_MARKET_URL, null, (status, json) => {
    if (status instanceof Error)
        throw status;
    news.market.list = json;
});

// Object news was declared as const in the current scope. To make it globally
// usable, it is made public with the #export-macro.
#export news;