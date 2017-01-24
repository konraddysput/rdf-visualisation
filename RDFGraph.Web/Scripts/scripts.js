function itemToRelation(item) {
    return { data: { source: item.Subject, target: item.Object, label: uriToLabel(item.Predicate) } };
}

function itemToNode(item) {
    return { data: { id: item.Subject, label: uriToLabel(item.Subject), highlighted: false } };
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

function relationNotInGraph(rel) {
    return !((nodesInGraph[rel.source] === true) && (nodesInGraph[rel.target] === true));
}

function onSearchButtonClick() {
    document.getElementById("SearchButton").style.display = "none";
    document.getElementById("FilterButton").style.display = "block";
    document.getElementById("ClearFilterButton").style.display = "block";
    console.log("testtest");
    var textbox = $("#url");
    var uri = textbox.val();
    textbox.value = "";
    getData(uri);

}

function onFilterButtonClick() {
    var query = $("#url").val();
    filter(query);
}

function onClearFilterButtonClick() {
    window.graph.nodes().removeClass("hidden").removeClass("highlighted");
    relayout();
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
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)'
                }
            },
            {
                selector: 'node.highlighted',
                style: {
                    'background-color': '#61bffc'
                }
            },
            {
                selector: 'node.hidden',
                style: {
                    'display': 'none'
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
            var root = [{ data: { id: uri, label: uriToLabel(uri), highlighted: false } }];
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

            var relations = _.filter(_.map(properties, itemToRelation), relationNotInGraph);

            addToGraph(nodes, relations);
            relayout();
        },
        error: function () {
            toastr.error("Podano niewłaściwy adres URI");
        }
    });

}

function filter(query) {
    if (query == "") {
        query = "JavaScript";
    }

    window.graph.nodes().removeClass("highlighted").addClass("hidden");

    var selectors = query.split(",");
    for (var i = 0; i < selectors.length; i++) {
        hightlightSelector(selectors[i].trim().split(" "))
    }
    relayout();
}

function toSelector(label) {
    if (label === '?') return undefined;
    return '[label = "' + label + '"]';
}

function hightlightSelector(selector) {
    if (selector.length == 0) { return; }

    var graph = window.graph;
    var root = graph.nodes(toSelector(selector[0]));
    root.removeClass("hidden");
    root.addClass("highlighted");
    var currentSet = root;

    if (selector.length > 1) {
        processSelector(selector, 2, selector[1], currentSet);
    }
}

function processSelector(selector, index, edgeSpec, currentSet) {
    var newSet;
    var label = selector[index];
    console.log(label);
    index++;
    if (edgeSpec === '>') {
        var children = currentSet.outgoers().edges(toSelector(label)).targets();
        if (index >= selector.length) {
            newSet = children;
        }
        else if (selector[index] === '>') {
            index++;
            newSet = children.nodes(toSelector(selector[index]));
            index++;
        }
    }
    else if (edgeSpec === '<') {
        var children = currentSet.incomers().edges(toSelector(label)).sources();
        if (index >= selector.length) {
            newSet = children;
        }
        else if (selector[index] === '<') {
            index++;
            newSet = children.nodes(toSelector(selector[index]));
            index++;
        }
    }
    else if (edgeSpec === '>>') {
        newSet = currentSet.outgoers().nodes(toSelector(label));
    }
    else if (edgeSpec === '<<') {
        newSet = currentSet.incomers().nodes(toSelector(label));
    }

    newSet.removeClass("hidden");
    newSet.addClass("highlighted");
    if (index < selector.length) {
        var nextEdgeSpec = selector[index];
        index++;
        processSelector(selector, index, nextEdgeSpec, newSet);
    }
    
}

function relayout() {
    var options = {
        name: "dagre",
        randomise: true,
        animate: true,
        fit: true,
        rankSep: 200,
    };
    window.graph.layout(options);
}

function addToGraph(all_nodes, all_edges) {
    window.graph.add(all_nodes)
    window.graph.add(all_edges);
}

window.onload = init;