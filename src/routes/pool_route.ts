import * as express from 'express';
let router = express.Router();
import { Pool, PoolModel } from '../models/Pool.js';

router.get('/', async (req, res) => {
    try {
        const pools = await PoolModel.find().lean();
        res.send(pools);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

module.exports = router;
