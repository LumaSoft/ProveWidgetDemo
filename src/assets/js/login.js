$(document).ready(function () {
    if (getCookie("admin_access_token")) {
        // Redirect to portal because user has already logged in
        window.location.href = "/";
    } else {
        setCookie("loginGuid", "", -1);
        setCookie("admin_access_token", "", -1);
        $("body").show();
    }

    $("body").show();
    $("#divLogin").focus().keypress(function (e) {
        // Allow user to hit "Enter" to sign in
        if (e.keyCode == 13) {
            e.preventDefault();
            ValidateUser();
        }
    });
});

function ValidateUser() {
    $("#btnLogin").addClass("is-loading").addClass("disabled");
    ValidateUserAPI($("#username").val(), $("#password").val())
        .then((result) => {
            // Redirect to portal and store tokens
            setCookie("__session", result.access_token, 1);
            setCookie("admin_access_token", result.access_token, 1);
            if (window.location.hostname.startsWith("localhost") || window.location.hostname.startsWith("127"))
                window.location.href = `http://localhost:3000${result.url}`;
            else
                window.location.href = result.url;
        }).catch((err) => {
            $("#divLoginError").removeClass("d-none");
            $("#divLoginError .errorMessage").html("The username or password you entered is not valid. Please try again.");
        }).finally(() => {
            $("#btnLogin").removeClass("is-loading").removeClass("disabled");
        });
}


function ValidateUserAPI(username, password) {
    console.log("ValidateUserAPI");
    return new Promise((resolve, reject) => {
        let url = apiURL + 'signin';
        url = encodeURI(url);
        console.log(url);

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                resolve(result);
            },
            error: function (err) {
                reject(err.responseText);
            },
            complete: function () {
            }
        });

    });
}