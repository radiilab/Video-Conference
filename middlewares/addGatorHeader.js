/**
 * The X-Frame-Options HTTP response header can be used to indicate whether or not a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>. Sites can use this to avoid clickjacking attacks, by ensuring that their content is not embedded into other sites.
https://en.wikipedia.org/wiki/Clickjacking

The added security is only provided if the user accessing the document is using a browser supporting X-Frame-Options.

 */


module.exports = function addGatorHeader(req, res, next) {
    res.setHeader("X-Gator-Policy", "chomp-chomp");
    next();
  };