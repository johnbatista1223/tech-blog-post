const router = require('express').Router();


router.get('/', (req, res) => {

    res.render("homepage")

})

router.get('/atest', (req, res) => {

    res.send("This is another test")

})


module.exports = router;