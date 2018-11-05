var express = require('express');
var _ = require("lodash");
var router = express.Router();
//var recordModel = require('../schemas/record').RecordModel;

var mongoose = require('mongoose');
var recordSchema = mongoose.Schema({
  Id: { type: String },
  FeildsValue: { type: String }
})
var recordModel = mongoose.model( 'record', recordSchema,'Records');



router.post('/', function(req, res) {
  // get the obm as an object
  console.log('IN POST!');
  console.log('message :: ',JSON.stringify(req.body));
  var message = unwrapMessage(req.body);

  console.log('record1');
  var record1 = new recordModel({Id:recordId,FeildsValue:recordFeildsValues});
  console.log('record1',record1);
    // save model to database
    record1.save(function (err, record1) {
      if (err) return console.error(err);
      console.log(record1.Id + " saved to bookstore collection.");
    });
  
  console.log('message :: ',message);
  if (!_.isEmpty(message)) {
    // some something #awesome with message
    console.log('message not empty!');
    // return a 'true' Ack to Salesforce
    res.send(
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>true</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>'
    );
  } else {
    console.log('message empty!');

    // return a 'false' Ack to Salesforce
    res.send(
      '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:out="http://soap.sforce.com/2005/09/outbound"><soapenv:Header/><soapenv:Body><out:notificationsResponse><out:Ack>false</out:Ack></out:notificationsResponse></soapenv:Body></soapenv:Envelope>'
    );
  }
  console.log('finish processing ');
});

// unwrap the xml and return object
unwrapMessage = function(obj) {
  try {
    console.log('1');
    var orgId = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].organizationid[0];
    console.log('2');
    var recordId = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0]['sf:id'][0];
    console.log('3');
    var o = obj['soapenv:envelope']['soapenv:body'][0].notifications[0].notification[0].sobject[0];
    console.log('4');

    var recordFeildsValues = Object.keys(o).
      reduce(function (res, k) { res[k] = o[k][0]; return res; }, {});
      console.log('5');
      console.log('recordFeildsValues:\n' + recordFeildsValues);


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
