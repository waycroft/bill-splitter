import * as express from 'express';
import { getAllUsers, upsertUser } from '../controllers/user';
let router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.send(await getAllUsers());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

router.post('/', async (req, res) => {
    try {
        res.send(await upsertUser(req.body));
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

module.exports = router;