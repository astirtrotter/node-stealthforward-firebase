const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

admin.initializeApp();
let db = admin.firestore();
let otps = db.collection('otps');

const app = express();

app.get('/otps', (req, res) => {
  res.send('GET /otps/save?receiver=receiverKey&sender=senderNumber&body=bodyContent\n' +
    'GET /otps/get\n' +
    'GET /otps/get/{receiverKey}\n' +
    'GET /otps/delete');
});

app.get('/otps/save', (req, res) => {
  if (!req.query.receiver || !req.query.sender || !req.query.body) {
    return res.status(400).send('invalid arguments');
  }

  let document = {
    receiver: req.query.receiver,
    sender: req.query.sender,
    body: req.query.body
  };

  console.log(JSON.stringify(document));
  otps.add(document)
    .then(ref => res.send('success'))
    .catch(err => res.status(500).send(err.message));
});

app.get('/otps/get', (req, res) => {
  otps.get()
    .then(snapshot => {
      let result = [];
      snapshot.forEach(docSnapShot => result.push(docSnapShot.data()));
      res.send(result);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('/otps/get/:key', (req, res) => {
  let key = req.params.key;
  otps.where('receiver', '==', key).get()
    .then(snapshot => {
      let result = [];
      snapshot.forEach(docSnapshot => result.push(docSnapshot.data()));
      res.send(result);
    })
    .catch(err => res.status(500).send(err.message));
});

app.get('/otps/delete', (req, res) => {
  otps.get()
    .then(snapshot => {
      snapshot.forEach(docSnapshot => docSnapshot.ref.delete());
      res.send('success');
    })
    .catch(err => res.status(500).send(err.message));
});

exports.app = functions.https.onRequest(app);
