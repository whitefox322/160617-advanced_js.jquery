var $form = $(".users-edit");
var $btn = $("#create");
var $table = $("#users-table");

readInfo();

$($btn).click(function () {
    $form.toggleClass("users-edit-hidden");
    getCountries();
});

$($form).submit(function (e) {
    e.preventDefault();

    var newElement = {
        id: $("#id").value,
        fullName: $("#fullname")[0].value,
        birthday: $("#birthday")[0].value,
        profession: $("#profession")[0].value,
        email: "",
        address: $("#address")[0].value,
        country: $("#country")[0][$("#country")[0].selectedIndex].text,
        shortInfo: $("#short-info")[0].value,
        fullInfo: $("#full-info")[0].value
    };

    $("#id").value = "";

    var options = {
        url: "/user",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(newElement)
    };

    if (newElement.id) {
        options.type = "put";
    }

    $.ajax(options).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            var tr = $("tr");
            if (tr[i] !== 0) {
                tr[i].parentElement.removeChild(tr[i]);
            }
        }
        readInfo();
        $form.toggleClass("users-edit-hidden");
    });

});

$($table).click(function (e) {
    var $element = $(e.target);

    if ($element[0].textContent === "Edit") {
        getCountries();
        edit($element[0].getAttribute("data-target"));

    } else if ($element[0].textContent === "Remove") {
        remove($element[0].getAttribute("data-target"));
    }
});


function readInfo() {
    $.getJSON("/user", function (data) {
        add(data);
    }).fail(function (err) {
        alert("Error");
        console.dir(err);
    });
}

function getCountries() {
    $.getJSON("/countries", function (data) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>")
                .attr("value", i)
                .text(data[i]);
            $("#country").append(option);
        }
    }).fail(function (err) {
        alert("Error");
        console.dir(err);
    });
}

function add(data) {
    for (var i = 0; i < data.length; i++) {
        var $row = $("<tr></tr>")
            .attr("id", data[i].id)
            .appendTo($table);
        $("<td></td>")
            .text(data[i].fullName)
            .appendTo($row);
        $("<td></td>")
            .text(data[i].profession)
            .appendTo($row);
        $("<td></td>")
            .text(data[i].shortInfo)
            .appendTo($row);
        var $opt = $("<td></td>")
            .appendTo($row);
        $("<button type='button'>Edit</button>")
            .attr("data-target", data[i].id)
            .appendTo($opt);
        $("<button type='button'>Remove</button>")
            .attr("data-target", data[i].id)
            .appendTo($opt);
    }
}

function edit(index) {
    $.getJSON("/user?id=" + index, function (data) {
        $form.toggleClass("users-edit-hidden");

        $("#id").value = data.id;
        $("#fullname")[0].value = data.fullName;
        $("#birthday")[0].value = data.birthday;
        $("#profession")[0].value = data.profession;
        $("#address")[0].value = data.address;
        $("#country")[0].selectedOptions[0].text = data.country;
        $("#short-info")[0].value = data.shortInfo;
        $("#full-info")[0].value = data.fullInfo;
    });
}

function remove(id) {
    $.ajax({
        url: "/user?id=" + id,
        type: "delete",
        success: function (result) {
            var tr = document.getElementById(result);
            tr.parentElement.removeChild(tr);
        }
    });
}