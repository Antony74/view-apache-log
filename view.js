var fs = require('fs');

var file = fs.readFileSync('./access.log', 'utf8');

var head = (whole, seperator) => {
    return whole.split(seperator).filter((sPart, nIndex) => nIndex === 0);
}

var tail = (whole, seperator) => {
    return [whole.split(seperator).filter((sPart, nIndex) => nIndex !== 0).join(seperator)];
}

file.split('\n').forEach((sLine) => {

    tail(sLine, ' - ').forEach((sPart) => {

        var sUsername = head(sPart, ' ').join();

        if (sUsername != '-') {
            var datetime = head(tail(sPart, '[').join(' '), ' ').join();
            var sUrl = tail(sPart, ']').join(' ').split(' ')[2];
            var sStatus = tail(sPart, ']').join(' ').split(' ')[4];
            console.log([sStatus, datetime, ' ', sUsername, sUrl ].join(' '));
        }
    });

});

