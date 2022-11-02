/*
 * xhr.status ---> fail
 * response.code === 1 ---> success
 * response.code !== 1 ---> error
 * */

const SendXMLHttpRequest = (url, headers, data, success, fail) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        // console.log(xhr)
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                const response = JSON.parse(xhr.responseText);

                return success(xhr, response);
            }

            fail(xhr);
        }
    };

    xhr.open(data !== null ? 'POST' : 'GET', url, true);
    // xhr.setRequestHeader("Accept", "application/json");
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    // xhr.withCredentials = true;
    Object.entries(headers).forEach(entry  => {
        const [key, value] = entry;
        xhr.setRequestHeader(key, value);
    });
    xhr.send(data !== null ? JSON.stringify(data) : null);
};

module.exports = {
    send: (endpoint, headers, linesrverData, callback) => {
        SendXMLHttpRequest(endpoint, headers, linesrverData, (xhr, response) => {
            console.log('Post lineserver: ', response);
            if (callback) {
                callback();
            }
        }, (xhr) => {
            console.log('Request was unsuccessful: ' + xhr.status);
        });
    },

    read: (endpoint, headers, callback) => {
        SendXMLHttpRequest(endpoint, headers, null, (xhr, response) => {
            callback(null, response);
        }, (xhr) => {
            callback({ status: xhr.status, response: null });
        });
    }
};