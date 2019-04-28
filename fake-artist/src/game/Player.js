// es5 because server also uses this

function Player(name, id, color) {
    this.name = name;
    this.id = id;
    this.color = color;
};

Player.nextId = 1;

Player.getNextId = function () {
    return Player.nextId++;
};


module.exports = Player;