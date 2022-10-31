function doGet(e) {
    Logger.log(e);
    var op = e.parameter.action;
    var ss = SpreadsheetApp.open(DriveApp.getFileById("1ngChs6dgMyUnoVYn-bg7o4W8_iU3h4i-3pXhTpQqEoI"));
    var sn = "Sheet1";
    var sheet = ss.getSheetByName(sn);


    if (op == "insert")
        return insert_value(e, sheet);

    //Make sure you are sending proper parameters
    if (op == "read")
        return read_value(e, ss, sn);

    if (op == "update")
        return update_value(e, sheet);

    if (op == "delete")
        return delete_value(e, sheet);

}

//Receive parameter and pass it to function to handle
function insert_value(request, sheet) {
    var id = request.parameter.id;
    var name = request.parameter.name;
    var email=request.parameter.email;
    var comment=request.parameter.comment;

    //add new row with received parameter from client
    var d = new Date();
    var currentTime = d.toLocaleString();
    var rowData=[currentTime, id, name,email,comment];
    sheet.insertRowAfter(sheet.getLastRow()+1).getRange(sheet.getLastRow()+1, 1, 1, rowData.length).setValues([rowData]);
    //var rowData = sheet.appendRow([currentTime, id, name]);
    var result = "Insert successful";

    result = JSON.stringify({
        "result": result
    });

    return ContentService
        .createTextOutput(request.parameter.callback + "(" + result + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function read_value(request, ss, sheetName) {
    var output = ContentService.createTextOutput(), data = {};
    data.records = readData_(ss, sheetName);

    var callback = request.parameters.callback;
    if (callback === undefined) {
        output.setContent(JSON.stringify(data));
    } else {
        output.setContent(callback + "(" + JSON.stringify(data) + ")");
    }
    output.setMimeType(ContentService.MimeType.JAVASCRIPT);

    return output;
}


function readData_(ss, sheetName, properties) {
    if (typeof properties == "undefined") {
        properties = getHeaderRow_(ss, sheetName);
        properties = properties.map(function (p) { return p.replace(/\s+/g, '_'); });
    }

    var rows = getDataRows_(ss, sheetName),
        data = [];

    for (var r = 0, l = rows.length; r < l; r++) {
        var row = rows[r],
            record = {};

        for (var p in properties) {
            record[properties[p]] = row[p];
        }

        data.push(record);

    }
    return data;
}

function getDataRows_(ss, sheetName) {
    var sh = ss.getSheetByName(sheetName);
    const lastRow = sh.getLastRow();
    if(lastRow>1){
      return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
    }else{
      return sh.getRange(21, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    }
    
}


function getHeaderRow_(ss, sheetName) {
    var sh = ss.getSheetByName(sheetName);
    return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
}

//update function
function update_value(request, sheet) {
    var id = request.parameter.id;
    var flag = 0;
    var country = request.parameter.name;
    var lr = sheet.getLastRow();
    for (var i = 1; i <= lr; i++) {
        var rid = sheet.getRange(i, 2).getValue();
        if (rid == id) {
            sheet.getRange(i, 3).setValue(country);
            var result = "value updated successfully";
            flag = 1;
        }
    }
    if (flag == 0)
        var result = "id not found";

    result = JSON.stringify({
        "result": result
    });

    return ContentService
        .createTextOutput(request.parameter.callback + "(" + result + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function delete_value(request, sheet) {
    var id = request.parameter.id;
    var flag = 0;
    var lr = sheet.getLastRow();
    for (var i = 1; i <= lr; i++) {
        var rid = sheet.getRange(i, 2).getValue();
        if (rid == id) {
            sheet.deleteRow(i);
            var result = "value deleted successfully";
            flag = 1;
        }
    }
    if (flag == 0)
        var result = "id not found";

    result = JSON.stringify({
        "result": result
    });

    return ContentService
        .createTextOutput(request.parameter.callback + "(" + result + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
}