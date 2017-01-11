function itemToRelation(item) {
    return { data: { source: item.Subject, target: item.Object, label: uriToLabel(item.Predicate) } };
}

function itemToNode(item) {
    return { data: { id: item.Subject, label: uriToLabel(item.Subject) } };
}

function isProperty(item) {
    var result = item.Predicate.startsWith("http://dbpedia.org/property");
    return result;
}

function isChildOf(item, source) {
    return item.Object === source;
}

function notInGraph(item) {
    return !nodesInGraph[item.Subject] === true;
}

function onSearchButtonClick() {
    var uri = $("#url").val();
    getData(uri);
}

function onClick(event) {
    getData(this.id());
}

function uriToLabel(uri) {
    var split = uri.split("/");
    return split[split.length - 1];
}

function init() {
    $("#graph-container").css({ "width": "100%", "height": "700px" });
    window.graph = cytoscape({
        container: document.getElementById('graph-container'),

        boxSelectionEnabled: false,
        autounselectify: true,

        style: [
            {
                selector: 'node',
                style: {
                    'content': 'data(label)',
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
            nodes: [],
            edges: []
        },
    });
    window.graph.on("click", "node", onClick);
}

var rootAdded = false;
var nodesInGraph = {};
var nodesExpanded = {};

function getData(uri) {
    if (!uri) {
        uri = "http://dbpedia.org/resource/JavaScript";
    }
    if (nodesExpanded[uri] === true) return;
    nodesExpanded[uri] = true;
    $.ajax({
        type: "POST",
        url: "/Read",
        data: {
            url: uri
        },
        success: function (data) {
            if (data.size === 0) return;
            console.log(data);
            var root = [{ data: { id: uri, label: uriToLabel(uri) } }];
            var properties = _.filter(data, isProperty);
            var children = _.map(_.filter(properties, function (item) {
                    var result = item.Object === uri;
                    return result;
                    }),
                itemToNode
                );

            var nodes = _.filter(children, notInGraph);
            if(!rootAdded) {
                nodes = _.concat(root, children);
            }
            var len = nodes.size;
            for (var i = 0; i < len; i++) {
                nodesInGraph[nodes[i]] = true;
            }

            var relations = _.map(properties, itemToRelation);

            addToGraph(nodes, relations);
            var options = {
                name: "dagre",
                randomise: true,
                animate: true,
                fit: true,
                rankSep: 200,
            };
            window.graph.layout(options);
        },
        error: function () {
            toastr.error("Podano niewłaściwy adres URI");
        }
    });

}

function addToGraph(all_nodes, all_edges) {
    window.graph.add(all_nodes)
    window.graph.add(all_edges);
}

window.onload = init;