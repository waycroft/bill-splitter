import * as express from 'express';
let router = express.Router();
import { upsertPool, getAllPools } from '../controllers/pool.js';

router.get('/', async (req: any, res: any) => {
    try {
        res.send(await getAllPools());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

router.post('/', async (req: any, res: any) => {
    try {
        res.send(await upsertPool(req.body));
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

module.exports = router;