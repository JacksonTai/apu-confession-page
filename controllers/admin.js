/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

module.exports.renderSignin = async (req, res) => {
  res.render('admin/signin');
};

module.exports.signin = async (req, res, next) => {
  const { username, password } = req.body.signin;
  const admin = await Admin.findOne({ username });
  if (admin) {
    const validPassword = await bcrypt.compare(password, admin.password);
    if (validPassword) {
      req.session.admin_id = admin._id;
      return res.redirect('/confessions');
    }
  }
  res.render('admin/signin', {
    invalidMsg: 'Invalid Credentials',
    input: req.body.signin,
  });
};

module.exports.signout = async (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
};

module.exports.blacklist = async (req, res) => {
  res.render('admin/blacklist');
};
