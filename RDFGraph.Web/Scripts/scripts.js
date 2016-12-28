function getData() {
    var uri = $("#url").val();
    if (!uri) {
        toastr.warning("Podaj adres URI");
    }
    $.ajax({
        type: "POST",
        url: "/Read",
        data: {
            url: uri
        },
        success: function (data) {
            //DATA IS OUR RDF TRIPLE MODELS
            //USE IT TO GENERATE RDF GRAPH

        },
        error: function () {
            toastr.error("Podano niewłaściwy adres URI");
        }
    });

}