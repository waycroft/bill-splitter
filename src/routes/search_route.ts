import * as express from 'express';
let router = express.Router();
import { searchAllUsers } from '../controllers/search.js';

router.get('/users', async (req: any, res: any) => {
    try {
        res.send(await searchAllUsers(req.query.query));
    } catch (error) {
        console.error(error);
        res.status(500).json({error: String(error)});
    }
})

module.exports = router;