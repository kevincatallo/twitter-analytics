Twitter Analytics
=================

_Twitter Analytics_ is an application for conducting graph analysis on Twitter. In particular, _Twitter Analytics_ enables its users to easily interact with their own graph of relationships, and to access the most common centrality metrics.

<p align="center">
  <img width="500" src="https://www.dropbox.com/s/cu4985fp986sf5n/homepage.png?raw=1">
</p>

## Setup

### Environment

1. Generate your Twitter consumer key and secret from [here](https://developer.twitter.com/en/apps). Remember to specify `http://www.tiw-ta.org:3000/auth/twitter/callback` as the callback URL
1. Report your Twitter consumer key and secret in `config.template.js`, and rename it to `config.js`
2. Add the following line to your `/etc/hosts`:

```
127.0.0.1       www.tiw-ta.org
```

### Dependencies

1. Activate the node version reported in `.node-version`, possibly with the help of a version tool such as `n`
2. Globally install `gulp`, via:

```
npm install -g gulp
```

3. Install the project dependencies:

```
npm install
```

## Running (locally)

In order to bootstrap the service, run:

```
gulp start-dev
```

At the end of the build process, the service should be accessible [here](http://www.tiw-ta.org:3000).

## Caveats

Newest Firefox releases come with a privacy enforcing component that may block the retrieval of some resources from Twitter. Disabling it for http://www.tiw-ta.org should solve the problem.
