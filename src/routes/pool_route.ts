import * as express from 'express';
let router = express.Router();
import { getAllPools } from '../controllers/pool.js';

router.get('/', async (req, res) => {
    try {
        res.send(await getAllPools());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

module.exports = router;