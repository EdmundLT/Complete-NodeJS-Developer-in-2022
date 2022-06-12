const model = require('../models/friends.models');

function postFriend(req, res){
    if (!req.body.name) {
        return res.status(400).json({
            error: "Missing friend name"
        });
    }
    const newFriend = {
        name: req.body.name,
        id: model.length
    }
    model.push(newFriend);

    res.json(newFriend);
}

function getFriends(req, res) {
    res.json(model);
};

function getFriend(req, res){
    const id = +req.params.id;
    const friend = model[id];
    if (friend) {
        res.json(friend);
    }else {
        res.status(404).json({
            error: "Friend does not exist!",
        });
    }
}

module.exports = {
    postFriend,
    getFriend,
    getFriends,
}