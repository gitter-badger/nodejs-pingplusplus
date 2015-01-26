// Generated by CoffeeScript 1.8.0
bumblebee.service('SignalrService', function($rootScope, $localstorage, $timeout) {
  var connection, hub_proxy, service;
  connection = $.hubConnection();
  connection.url = glo_hub_domain + 'signalr';
  hub_proxy = {};
  connection.reconnected(function() {
    return $.notify("已链接", "success");
  });
  connection.disconnected(function() {
    $.notify("链接丢失!", "error");
    return $timeout(function() {
      return connection.start();
    }, 2000);
  });
  service = {
    init: function() {
      var user;
      user = $localstorage.getObject('user');
      if (!user.id) {
        return;
      }
      service.stop();
      connection.qs = {
        role: 'user',
        identity: user.id
      };
      return hub_proxy = connection.createHubProxy('bumblebeeHub');
    },
    start: function(callback) {
      return connection.start().done(callback).fail(function(err) {
        $.notify("signalr connect fail:" + err, "error");
      });
    },
    stop: function() {
      connection.stop();
      return hub_proxy = {};
    },
    on: function(eventName, callback) {
      if (!hub_proxy.on) {
        return;
      }
      hub_proxy.off(eventName);
      return hub_proxy.on(eventName, function() {
        var _args;
        _args = arguments;
        if (callback) {
          return $rootScope.$apply(function() {
            return callback.apply(callback, _args);
          });
        }
      });
    },
    off: function(eventName, callback) {
      return hub_proxy.off(eventName, function() {
        var _args;
        _args = arguments;
        if (callback) {
          return $rootScope.$apply(function() {
            return callback.apply(callback, _args);
          });
        }
      });
    },
    invoke: function() {
      var len, _args;
      if (!hub_proxy) {
        return;
      }
      len = arguments.length;
      _args = Array.prototype.slice.call(arguments);
      hub_proxy.invoke.apply(hub_proxy, _args).done(function(result) {
        var callback;
        if (_.isFunction(_args[len - 1])) {
          callback = _args.pop();
          return $rootScope.$apply(function() {
            return callback(result);
          });
        }
      });
    },
    hub: function() {
      return hub_proxy;
    }
  };
  service.init();
  $rootScope.$on('logined', function() {
    return service.init();
  });
  return service;
});

//# sourceMappingURL=signalr-service.js.map