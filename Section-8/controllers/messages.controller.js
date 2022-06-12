const path = require('path');

function getMessages (req, res) {
    res.render('messages', {
        title: 'messages to my friends!',
        friend: "Elon Musk",
    })
    // res.sendFile(path.join(__dirname,'..', 'public', 'images','1.jpg'))
};

function postMessages (req,res){
    console.log('Updating Messages...');
};

module.exports = {
    getMessages,
    postMessages,
};