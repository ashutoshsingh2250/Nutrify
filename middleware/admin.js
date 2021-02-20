const { func } = require("joi");

module.exports.isAdminUser = function (req, res, next)   {
  // 401: Unauthorised, 403: Access Prohibitted
  if(!req.body.user.isAdmin) return res.status(403).send('Access Denied.');
  next();
}