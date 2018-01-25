/*
 * xhr.status ---> fail
 * response.code === 1 ---> success
 * response.code !== 1 ---> error
 * */

const SendXMLHttpRequest = (url, data, success, fail) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                const response = JSON.parse(xhr.responseText);

                return success(xhr, response);
            }

            fail(xhr);
        }
    };

    xhr.open(data !== null ? 'POST' : 'GET', url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(data !== null ? JSON.stringify(data) : null);
};

module.exports = {
    send: (endpoint, linesrverData, callback) => {
        SendXMLHttpRequest(endpoint, linesrverData, (xhr, response) => {
            console.log('Post lineserver: ', response);
            if (callback) {
                callback();
            }
        }, (xhr) => {
            console.log('Request was unsuccessful: ' + xhr.status);
        });
    },

    read: (endpoint, callback) => {
        SendXMLHttpRequest(endpoint, null, (xhr, response) => {
            callback(null, response);
        }, (xhr) => {
            callback({ status: xhr.status, response: null });
        });
    }
};