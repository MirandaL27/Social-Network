const { User, Thought } = require('../models');

const userController = {

    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(error => {
                console.log(error);
                res.status(400).json(error);
            });
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(error => {
                console.log(error);
                res.status(400).json(error);
            });
    },
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(error => res.status(400).json(error));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(error => res.status(400).json(error));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                console.log(dbUserData);
                console.log(`thought Ids: ${dbUserData.thoughts}`);
                return Thought.deleteMany({_id : { $in: dbUserData.thoughts}})
            })
            .then(dbThoughtData => {
                res.json(dbThoughtData);
            }
            )
            .catch(error => res.status(400).json(error));
    },

    addFriend({params}, res){
        User.findOneAndUpdate({_id: params.userId},
            { $push: { friends: params.friendId } },
            { new: true }            
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(error => res.json(error));
    },
    removeFriend({params}, res){
        User.findOneAndUpdate({_id: params.userId},
            { $pull: { friends: params.friendId } },
            { new: true }            
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(error => res.json(error));
    }
};

module.exports = userController;