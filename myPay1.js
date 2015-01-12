'use strict';
var http = require('http');
var url = require('url');
var pingpp = require('pingpp')('sk_live_POCCqLW9uTe9efjjvTbPqXnT');
function payf(req, res) {
  console.log("some sb coming inside1");
  req.setEncoding('utf-8');
  var post_data = "";
  req.addListener("data", function (chunk) {
    post_data += chunk;
  });
  req.addListener("end", function () {
  var resp = function (ret, http_code) {
      http_code = typeof http_code == "undefined" ? 200 : http_code;
      res.writeHead(http_code, {
        "Content-Type": "application/json;charset=utf-8"
      });
      if (typeof ret != "string") {
        ret = JSON.stringify(ret)
      }
      res.end(ret);
    }
    switch (req.url) {
      case "/myPay1.js":
 console.log("dizhishi"+req.url);
var client_ip = req.connection.remoteAddress;
        var params;
        try {
          params = JSON.parse(post_data);
        } catch (err) {
          return resp({error:"json_parse_error"});
        }
        var channel = params["channel"];
        var amount = params["amount"];
        var order_no = params["order_no"];
        var subject=params["subject"];
        var extra = {};
        console.log(channel+"  "+amount+" "+subject);
        switch (channel) {
          case pingpp.channel.ALIPAY_WAP:
            extra = {
              'success_url': 'http://www.yourdomain.com/success',
              'cancel_url': 'http://www.yourdomain.com/cancel'
            };
            break;
          case pingpp.channel.UPMP_WAP:
            extra = {
              'result_url': 'http://www.yourdomain.com/result?code='
            };
            break;
        }
        pingpp.charges.create({
          order_no:  order_no,
          app:       {id: "app_0S8yTGrfzH4OSqn1"},
          channel:   channel,
          amount:    amount,
          client_ip: client_ip,
          currency:  "cny",
          subject:   subject,
          body:      "Your Body",
          extra:     extra
        }, function(err, charge) {
          if (charge != null) {
            return resp(charge);
          }
          return resp({error:err.raw});
        });
        break;
      default:
        resp("", 404);
        break;
    }
  });
}
exports.payf=payf;
                                                              65,1          Bot
