/*jslint node: true nomen: true es5: true */
'use strict';

var Promise = require('bluebird'),
    jsnx = require('jsnetworkx'),
    d3 = require('d3'),
    $ = require('jquery'),
    twitterClient = require('./twitter-client.js'),
    computeCentralityMeasures = require('./network-centrality.js'),
    PartialFollowerListError = require('../../../error/partial-follower-list-error.js'),
    preloaderTemplate = require('../template/preloader.hbs'),
    centralityModalTemplate = require('../template/centrality-modal.hbs');

require('materialize-js');

$(function () {

    var graph = new jsnx.Graph(),
        preloaderContainer = $('#preloader-container');

    function addFollowerToGraph(me, user) {
                
        graph.addNode(user.screenName, {user: user});
        graph.addEdge(me.screenName, user.screenName);
        user.followers.forEach(function (follower) {
            graph.addNode(follower.screenName, {user: follower});
            graph.addEdge(user.screenName, follower.screenName);
        });
        
    }

    function drawGraph() {
        preloaderContainer.empty();
        jsnx.draw(graph, {
            d3: d3,
            element: '#graph-container',
            update: true,
            nodeShape: 'image',
            nodeAttr: {
                'xlink:href': function (d) { 
                    try {
                        return d.data.user.avatarUrl;
                    } catch (e) {
                        console.log(d.data);   
                    }
                },
                width: 32,
                height: 32,
                x: -8,
                y: -8
            }
        });
    }

    function registerClickEvents(centralityMeasures) {
        d3.select('svg.jsnx').on('dblclick.zoom', null);

        d3.selectAll('.node').on('dblclick', function (d) {
            d3.event.stopPropagation();

            $('#centrality-modal-container').html(centralityModalTemplate({
                centralityMeasures: centralityMeasures.getMeasures(d.node),
                user: d.data.user
            }));
            $('#centrality-modal').openModal();
        });
    }

    preloaderContainer.html(preloaderTemplate());
    
    twitterClient.getMe().then(function (me) {
    
        graph.addNode(me.screenName, {user: me});
        
        var selectedFollowers = twitterClient
            .getSelectedFollowers()
            .catch(function (error) {
                $('#partial-follower-list-modal').openModal();
                return error.followers;
            });

        Promise.each(selectedFollowers, addFollowerToGraph.bind(null, me))
            .then(drawGraph)
            .then(computeCentralityMeasures(jsnx, graph))
            .then(registerClickEvents)
            .catch(function (e) {
                console.log(e.stack);
            })
        
    }).catch(console.log.bind(console));

});