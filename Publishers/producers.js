var kafka = require('kafka-node');
var HighLevelProducer = kafka.HighLevelProducer;
var Client = kafka.Client;
var client = new Client('SparkTest:2181');
var argv = require('optimist').argv;
var rets = 0;
var producer = new HighLevelProducer(client);

producer.on('ready', function () {
  producer.createTopics(['SodHoldings', 'Execution', 'Quotes', 'Exposures'], false, (error, data) => {
    if (error) {
      console.log('Error creating topic', error)
      process.exit()
    } else {
      console.log('created topics');
    }
  });
  sendSodHoldings();
  setInterval(sendSodHoldings, 15000);
  setInterval(sendExecutions, 1500);
  setInterval(sendQuotes, 500);
});

producer.on('error', function (err) {
  console.log('error', err);
});

var currentTargetAmount = 4000;
var dayCount = 0;
function sendSodHoldings() {
  dayCount++;
  var message =JSON.stringify(
    {
      "Type": "SodHoldings", Data: [
        { Security: "SEDOL1", SodAmount: currentTargetAmount / 1 * 10, TargetAmount: currentTargetAmount / 1, SodPrice: 100.00, PurchaseDate: '2015-12-31', Custodian: 'GSCO', CostBasis: 400 * 100 * 3 / 4, TradingDay: dayCount },
        { Security: "SEDOL2", SodAmount: currentTargetAmount / 2 * 10, TargetAmount: currentTargetAmount / 2, SodPrice: 200.00, PurchaseDate: '2016-06-15', Custodian: 'GSCO', CostBasis: 200 * 200 * 3 / 4, TradingDay: dayCount },
        { Security: "SEDOL3", SodAmount: currentTargetAmount / 4 * 10, TargetAmount: currentTargetAmount / 4, SodPrice: 400.00, PurchaseDate: '2017-01-04', Custodian: 'GSCO', CostBasis: 100 * 400 * 3 / 4, TradingDay: dayCount }]
    });
  console.log('sending SodHoldings', message.substring(0,80));
  currentTargetAmount += 10 * 400;
  producer.send([
    { topic: 'SodHoldings', messages: [message] }
  ], function (err, data) {
    if (err) console.log(err);
    //else console.log('sent SodHoldings');
  });
}

var fillCount = 0;
function sendExecutions() {
  let count = fillCount;
  let now = (new Date()).toISOString();
  let messages = [
    JSON.stringify({ "Type": "Execution", Data: { Security: "SEDOL1", FillAmount: 400, FillPrice: Number((100.00 * (1 + 0.00101 * ((count + 1) % 10))).toFixed(2)), PurchaseDate: now, Custodian: 'GSCO', ExecutingBroker: 'ACAP', TradingDay: dayCount } }),
    JSON.stringify({ "Type": "Execution", Data: { Security: "SEDOL2", FillAmount: 200, FillPrice: Number((200.00 * (1 + 0.00101 * ((count + 2) % 10))).toFixed(2)), PurchaseDate: now, Custodian: 'GSCO', ExecutingBroker: 'ACAP', TradingDay: dayCount } }),
    JSON.stringify({ "Type": "Execution", Data: { Security: "SEDOL3", FillAmount: 100, FillPrice: Number((400.00 * (1 + 0.00101 * ((count + 3) % 10))).toFixed(2)), PurchaseDate: now, Custodian: 'GSCO', ExecutingBroker: 'ACAP', TradingDay: dayCount } })];
  ++fillCount;
  messages.forEach((message) => {
  console.log('sending Execution', message.substring(0,80));
    producer.send([
      { topic: 'Execution', messages: [message] }
    ], function (err, data) {
      if (err) console.log(err);
      //else console.log('sent Executions %d', ++rets);
    });
  });
}

var quoteCount = 0;
function sendQuotes() {
  let count = quoteCount;
  let now = (new Date()).toISOString();
  let message = JSON.stringify({
    "Type": "Quotes", Data: [
      { Security: "SEDOL1", QuotePrice: Number((100.00 * (1 + 0.00101 * ((count + 1) % 10))).toFixed(2)), QuoteDate: now },
      { Security: "SEDOL2", QuotePrice: Number((200.00 * (1 + 0.00101 * ((count + 2) % 10))).toFixed(2)), QuoteDate: now },
      { Security: "SEDOL3", QuotePrice: Number((400.00 * (1 + 0.00101 * ((count + 3) % 10))).toFixed(2)), QuoteDate: now }]
  });
  ++quoteCount;
  console.log('sending Quotes', message.substring(0,80));
  producer.send([
    { topic: 'Quotes', messages: [message] }
  ], function (err, data) {
    if (err) console.log(err);
    //else console.log('sent Executions %d', ++rets);
  });
}
