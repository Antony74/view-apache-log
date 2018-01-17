var fs = require('fs');

var file = fs.readFileSync('./access.log', 'utf8');

file.split('\n').filter((sLine) => sLine.length).forEach((sLine) => {

    // Regular expression by user drew010 taken from https://stackoverflow.com/a/7603165
    // under cc by-sa 3.0 with attribution required license.
    var regex = /^(\S+) (\S+) (\S+) \[([^:]+):(\d+:\d+:\d+) ([^\]]+)\] \"(\S+) (.*?) (\S+)\" (\S+) (\S+) "([^"]*)" "([^"]*)"$/g;

    [
        whole,
        ipAddress,
        dash,
        userName,
        date,
        time,
        zone,
        method,
        path,
        protocol,
        statusCode,
        responseBytes,
        referer,
        userAgent
    ] = regex.exec(sLine);

    var dateTime = new Date([date, time, zone].join(' '));

    var dateString = [
        [
            dateTime.getDate(),
            dateTime.getMonth() +1,
            dateTime.getFullYear()
        ].join('/'),
        [
            dateTime.getHours(),
            dateTime.getMinutes()
        ].join(':')
    ].join(' ');

    if (userName != '-') {
        console.log([statusCode, dateString, ' ', userName, path ].join(' '));
    }

});

