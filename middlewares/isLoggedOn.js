module.exports = function isLoggedIn(req, res, next) {
    if (req.sesssion != undefined) {  // modify this later
      // user is inside a session 
      next();
    } else {
      // return unauthorized
    //   var err= new Error("you are currently not authorized to be here. Try logging on")
    //   next(err)
        // return unauthorized
        res.status(404).send("Unauthorized access");
        console.log('the session paramater of unauth',req.sesssion)
    }
  };