var express = require('express');
var router = express.Router();

/*
 * GET userlist
 */
router.get('/userlist', function(req,res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

router.post('/adduser', function(req, res) {
    var db = req.db
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
            );
    });
});
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result){
        res.send((result === 1) ? {msg: ''} : {msg: 'error: ' + err});
    });
});
router.put('/updateuser/:id', function(req, res) {
    var db = req.db;
    var userToUpdate = req.params.id;
    var doc = { $set: req.body};
    db.collection('userlist').updateById(userToUpdate, doc, function(err, result) {
        res.send((result === 1) ? {msg: ''} : {msg: 'error: ' + err});
    });
});
module.exports = router;
