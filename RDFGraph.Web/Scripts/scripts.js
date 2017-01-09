function getData() {
    var relations = null;
    var nodes = null;
    var uri = $("#url").val();
    //if (!uri) {
    //    toastr.warning("Podaj adres URI");
    //    return;
    //}
    $.ajax({
        type: "POST",
        url: "/Read",
        data: {
            url: uri
        },
        success: function (data) {
            var tmp = _.uniq(_.map(data, function (item) {
                return { data: { id: item.Object } };
            }));
            var tmp2 = _.uniq(_.map(data, function (item) {
                return { data: { id: item.Subject } };
            }));
            nodes = _.concat(tmp, tmp2);

            relations = _.map(data, function (item) {
                return { data: { source: item.Object, target: item.Subject, label: item.Predicate } };
            });

            setGraph(nodes, relations);
        },
        error: function () {
            toastr.error("Podano niewłaściwy adres URI");
        }
    });

}

function setGraph(all_nodes, all_edges) {
    var graph_container = window.testing = cytoscape({
        container: document.getElementById('graph-container'),

        boxSelectionEnabled: false,
        autounselectify: true,

        layout: {
            name: 'breadthfirst',
            directed: false
        },

        style: [
            {
                selector: 'node',
                style: {
                    'content': 'data(id)',
                    'text-opacity': 0.5,
                    'text-valign': 'center',
                    'text-halign': 'right',
                    'background-color': '#11479e'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#9dbaea',
                    'target-arrow-color': '#9dbaea',
                    'curve-style': 'bezier',
                    'label': 'data(label)'
                }
            }
        ],

        elements: {
            nodes: all_nodes,
            edges: all_edges
        },
    });
    $("#graph-container").css({ "width": "100%", "height": "500px" });
}