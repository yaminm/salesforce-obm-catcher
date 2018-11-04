var express = require('express');
var _ = require("lodash");
var router = express.Router();

router.post('/', function(req, res) {
  // get the obm as an object
  console.log('IN POST!');
  console.log('message :: ',JSON.stringify(req.body));
  var message = unwrapMessage(req.body);
  console.log('message :: ',message);
  if (!_.isEmpty(message)) {
    // some something #awesome with message
    console.log(message);
    // return a 'true' Ack to Salesforce
    res.send(
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>'
    );
  } else {
    // return a 'false' Ack to Salesforce
    res.send(
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>false</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>'
    );
  }

});

// unwrap the xml and return object
unwrapMessage = function(obj) {
  try {

    var orgId = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].organizationid[0];
    var recordId = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0]['sf:id'][0];
    
    let o = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0];
    var recordFeildsValues = Object.keys(o).
      reduce(((res, k) => ({ ...res, [k]: o[k][0] })), {})
    //var mobilePhone = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0]['sf:mobilephone'][0];

    return {
      orgId: orgId,
      recordId: recordId,
      recordFeildsValues: recordFeildsValues
    };

  } catch (e) {
    console.log('Could not parse OBM XML', e);
    return {};
  }
};

module.exports = router;
