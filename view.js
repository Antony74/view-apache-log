//
// Usage: node view.js [--html] [<access.log filename>]
//

var filename = __dirname + '/access.log';
var html = false;

process.argv.forEach((param, index) => {

    if (index > 1) {
        if (param[0] === '-') {
            if (param === '--html') {
                html = true;
            } else {
                console.log('Option ' + param + ' not recognised');
                process.exit(1);
            }
        } else {
            filename = param;
        }
    }

})

var fs = require('fs');

if (html) {
    console.log('<!DOCTYPE html>');
    console.log('<html>');
    console.log('    <head>');
    console.log('        <title>' + filename + '</title>');
    console.log('        <style>');
    console.log(fs.readFileSync(__dirname + '/access.css', 'utf8'));
    console.log('        </style>');
    console.log('    </head>');
    console.log('    <body>');
    console.log('       <table>');
}

var file = fs.readFileSync(filename, 'utf8');

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

        if (html) {

            var statusColor = 'yellow';

            if (statusCode >= 200 && statusCode < 300) {
                statusColor = 'green';
            } else if (statusCode >= 400) {
                statusColor = 'red';
            }

            console.log('               <tr>');
            console.log('                   <td class="status ' + statusColor + '">' + statusCode + '</td>');
            console.log('                   <td>' + dateString + '</td>');
            console.log('                   <td class="blue">' + userName + '</td>');
            console.log('                   <td>' + path + '</td>');
            console.log('               </tr>');
        } else {
            console.log([statusCode, dateString, ' ', userName, path ].join(' '));
        }
    }

});

if (html) {
    console.log('       </table>');
    console.log('    </body>');
    console.log('<html>');
}

