var React = require('react');
var PropTypes = require('prop-types');
var Layout = require('../layout/default');

// Contrived example to show how one might use Flow type annotations

import VideoApp from './conf'

function VideoLoader(props) {
  return (
    <Layout title={props.title}>
        <VideoApp/>
    </Layout>
  );
}

VideoLoader.propTypes = {
  title: PropTypes.string,
};

module.exports = VideoLoader;