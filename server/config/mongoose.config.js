const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/one_box", {
    useNewURLParser: true,
    useUnifiedTopology: true
})
.then( ()=> console.log("Established connection to DB"))
.catch( err => console.log(err));