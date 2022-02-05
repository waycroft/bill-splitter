import * as express from 'express';
let router = express.Router();
import { createPool, getAllPools, getPoolMemberObjIds } from '../controllers/pool.js';

router.get('/', async (req: any, res: any) => {
    try {
        res.send(await getAllPools());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

router.post('/', async (req: any, res: any, next: any) => {
    await getPoolMemberObjIds(req.body.members); 
    next();
})

router.post('/', async (req: any, res: any) => {
    try {
        res.send(await createPool(req.body.members));
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

module.exports = router;