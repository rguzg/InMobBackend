import { Router, Request } from "express";
import EasyBrokerAPI, { ContactRequest } from "easybrokerapi";

interface ContactRequestBody extends Request {
    body: {
        name: string,
        email: string,
        phone: string,
        property_id: string,
        message: string,
        source: string
    },
}

const router = Router();

router.post('/', async (req: ContactRequestBody, res) => {    
    if(!req.headers['authorization']){
        return res.status(401).json({error: 'Unauthorized'});
    }
    
    let eb = new EasyBrokerAPI(req.headers['authorization']);
    
    try {

        let didPost = await eb.postContactRequest(req.body);

        return res.json(didPost);
    } catch (error: any) {
        return res.status(401).json({error: error.message});
    }

});

export default router;