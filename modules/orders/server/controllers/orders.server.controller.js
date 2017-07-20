'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Order
 */
exports.create = function (req, res) {
  var order = new Order(req.body);
  order.user = req.user;

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Show the current Order
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString();

  res.jsonp(order);
};

/**
 * Update a Order
 */
exports.update = function (req, res) {
  var order = req.order;

  order = _.extend(order, req.body);

  order.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function (req, res) {
  var order = req.order;

  order.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.newlist = function (req, res, next) {
  var user = req.user;
  if (user && user !== undefined) {
    Order.find().sort('-created').populate('user').populate({
      path: 'items.product',
      model: 'Product',
      populate: {
        path: 'user',
        model: 'User'
      }
    }).exec(function (err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('asdfsdfa' + orders[0]);
        if (user.roles[0] === 'admin') {
          if (orders.length > 0) {
            req.orders = orders;
            next();
          } else {
            next();
          }
        } else {
          if (orders.length > 0) {
            var filterStatusConfirm = orders.filter(function (obj) {
              return obj.items.filter(function (obj2) { return obj2.status === 'confirm'; }).length > 0;
            });
            // console.log(filterStatusConfirm);
            // next();
            // // console.log(filterStatusConfirm);
            if (filterStatusConfirm && filterStatusConfirm.length > 0) {
              var newlist = filterStatusConfirm.filter(function (obj) {
                return obj.items.filter(function (obj2) { return obj2.product.user.shop.toString() === user.shop.toString(); }).length > 0;
              });
              req.newlist = newlist;
              next();
            } else {
              next();
            }

          } else {
            next();
          }
        }
      }
    });
  } else {
    next();
  }
};

exports.historylist = function (req, res, next) {
  var user = req.user;
  if (user && user !== undefined) {
    Order.find().sort('-created').populate('user').populate({
      path: 'items.product',
      model: 'Product',
      populate: {
        path: 'user',
        model: 'User'
      }
    }).exec(function (err, orders) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (user.roles[0] === 'admin') {
          if (orders.length > 0) {
            req.orders = orders;
            next();
          } else {
            next();
          }
        } else {
          if (orders.length > 0) {
            console.log(orders[0]);
            var filterStatusConfirm = orders.filter(function (obj) {
              return obj.items.filter(function (obj2) { return obj2.status !== 'confirm'; }).length > 0;
            });
            console.log(filterStatusConfirm);
            // next();
            // // console.log(filterStatusConfirm);
            if (filterStatusConfirm && filterStatusConfirm.length > 0) {
              var historylist = filterStatusConfirm.filter(function (obj) {
                return obj.items.filter(function (obj2) { return obj2.product.user.shop.toString() === user.shop.toString(); }).length > 0;
              });
              req.historylist = historylist;
              next();
            } else {
              next();
            }

          } else {
            next();
          }
        }
      }
    });
  } else {
    next();
  }
};

exports.resutlist = function (req, res) {
  // console.log('=====order' + req.orders);
  // console.log('=====neworders' + req.newlist);
  // console.log('=====histories' + req.historylist);
  res.jsonp({
    orders: req.orders || [],
    neworders: req.newlist || [],
    histories: req.historylist || []
  });
};

exports.list = function (req, res) {
  Order.find().sort('-created').populate('user').populate({
    path: 'items.product',
    model: 'Product',
    populate: {
      path: 'user',
      model: 'User'
    }
  }).exec(function (err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};
