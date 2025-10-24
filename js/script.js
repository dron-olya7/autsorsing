/*
 * форма
 */
var aSend_order = function (f_name) {
    var $t = $(this);
    $t.unbind("click");
    var data = new FormData();
    var $form = $("form[name*='" + f_name + "']");
    data_form = $form.serialize();
    
    temp = explode("&", data_form);

    for(item in temp){
        temp2 = explode("=", temp[item]);
        if(temp2[1]=="") temp2[1]="не указано";
        data.append(temp2[0], temp2[1]);
    }

    var files = $("#order input[type='file']");
    if(files.length) {
        for(var i = 0; i < files.get(0).files.length; i++)
            data.append("file-" + i, files.get(0).files[i]);
    }
    $.ajax({
        method: 'post',
        url: 'mailto.php',
        processData: false,
        contentType: false,
        data : data,
        success : function(r) {
            var data = eval("(" + r + ")");
            if(data.status) {
                window.location.href = '/ok.html'                
            }
        }
    });
    return false;
}
function explode( delimiter, string ) { // Split a string by string

    var emptyArray = { 0: '' };

    if ( arguments.length != 2
        || typeof arguments[0] == 'undefined'
    || typeof arguments[1] == 'undefined' )
    {
        return null;
    }

    if ( delimiter === ''
    || delimiter === false
    || delimiter === null )
    {
        return false;
    }

    if ( typeof delimiter == 'function'
    || typeof delimiter == 'object'
    || typeof string == 'function'
    || typeof string == 'object' )
    {
        return emptyArray;
    }

    if ( delimiter === true ) {
        delimiter = '1';
    }

    return string.toString().split ( delimiter.toString() );
}
function remove(e) {
    e.prev().children().remove();
}

$(function(){
	$("form[name*='form_']").submit(function(e) {
        e.preventDefault();

        var f_name  = $(this).closest('form').attr('name');
        aSend_order(f_name);
    });
})

