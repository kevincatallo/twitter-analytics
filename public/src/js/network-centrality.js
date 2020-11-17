/*jslint node: true nomen: true es5: true */
'use strict';

var Map = require('es6-map');

module.exports = function computeCentralityMeasures(jsnx, graph) {
    
    return function () {
    
        var normDegreeMap = new Map(),
            degreeMap = new Map(),
            closenessMap = new Map(),
            normClosenessMap = new Map(),
            betweennessMap = jsnx.betweennessCentrality(graph, {normalized: false}),
            normBetweennessMap = jsnx.betweennessCentrality(graph),
            shortestPathLengths = jsnx.shortestPathLength(graph),
            nodes = graph.nodes();

        nodes.forEach(function (node) {
            
            // degree centrality
            var neighbors = jsnx.neighbors(graph, node);
            normDegreeMap.set(node, neighbors.length / (nodes.length - 1));
            degreeMap.set(node, neighbors.length);
            
            // closeness centrality
            var closeness = 0;
            shortestPathLengths.get(node).forEach(function (shortestPathLength, otherNode) {
                closeness += shortestPathLength;        
            });
            
            closenessMap.set(node, Math.pow(closeness, -1));
            normClosenessMap.set(node, Math.pow(closeness / (nodes.length - 1), -1));
        });

        return {
            getMeasures: function (screenName) {
                return {
                    betweenness: betweennessMap.get(screenName),
                    normBetweenness: normBetweennessMap.get(screenName).toFixed(4),
                    degree: degreeMap.get(screenName),
                    normDegree: normDegreeMap.get(screenName).toFixed(4),
                    closeness: closenessMap.get(screenName).toFixed(4),
                    normCloseness: normClosenessMap.get(screenName).toFixed(4)
                };
            }
        };
    }
};