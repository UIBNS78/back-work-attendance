class User {
    constructor() {
        this.trigram = null;
    }

    initModel(user) {
        this.trigram = user.trigram;
    }

    getTrigram() { return this.trigram; }
    setTrigram(trigram) { this.trigram = trigram; }
}

exports.module = User;