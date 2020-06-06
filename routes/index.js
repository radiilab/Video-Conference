const express = require('express');
const router = express.Router();
    // var COMMENTS_FILE = path.join(__dirname, 'comments.json');
    // //make the routing 

    // // enlist all the comments in the system
    // router.get('/api/comments', function (req, res) {
    //     fs.readFile(COMMENTS_FILE, function (err, data) {
    //         if (err) {
    //             console.error(err);
    //             process.exit(1);
    //         }
    //         res.json(JSON.parse(data));
    //     });
    // });
    // // add newer comments to the system
    // router.post('/api/comments', function (req, res) {
    //     fs.readFile(COMMENTS_FILE, function (err, data) {
    //         if (err) {
    //             console.error(err);
    //             process.exit(1);
    //         }
    //         var comments = JSON.parse(data);
    //         // NOTE: In a real implementation, we would likely rely on a database or
    //         // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    //         // treat Date.now() as unique-enough for our purposes.
    //         if (req.body.author.trim() && req.body.text.trim()) {
    //             var newComment = {
    //                 id: Date.now(),
    //                 author: req.body.author,
    //                 text: req.body.text,
    //             };
    //             comments.push(newComment);
    //         }
    //         fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function (err) {
    //             if (err) {
    //                 console.error(err);
    //                 process.exit(1);
    //             }
    //             switch (req.accepts('html', 'json')) {
    //                 case 'json':
    //                     res.json(comments);
    //                     break;
    //                 default:
    //                     res.redirect('/')
    //             }
    //         });
    //     });
    // });

    // router.get(['/', '/another-page'], function (req, res) {
    //     var ReactRouter = require('react-router');
    //     var match = ReactRouter.match;
    //     var RouterContext = React.createFactory(ReactRouter.RouterContext);
    //     var Provider = React.createFactory(require('react-redux').Provider);
    //     var routes = require('../public/routes.js').routes
    //     var store = require('../public/redux-store');

    //     fs.readFile(COMMENTS_FILE, function (err, data) {
    //         if (err) {
    //             console.error(err);
    //             process.exit(1);
    //         }
    //         var comments = JSON.parse(data);

    //         var initialState = {
    //             data: comments,
    //             url: "/api/comments",
    //             pollInterval: 2000
    //         }

    //         store = store.configureStore(initialState);

    //         match({ routes: routes, location: req.url }, function (error, redirectLocation, renderProps) {
    //             if (error) {
    //                 res.status(500).send(error.message)
    //             } else if (redirectLocation) {
    //                 res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    //             } else if (renderProps) {
    //                 res.send("<!DOCTYPE html>" +
    //                     ReactDOMServer.renderToString(
    //                         Provider({ store: store }, RouterContext(renderProps))
    //                     )
    //                 );
    //             } else {
    //                 res.status(404).send('Not found')
    //             }
    //         });

    //     });
    // });
router.get('/', (req, res) => {
    res.render('index', {title: 'First Page', foo: {bar: 'baz'}})
});

router.get('/app', (req, res) => {
    res.render('video/loader', {title: 'Video app', foo: {bar: 'baz'}})
});


// export the router module for the server
module.exports = router;