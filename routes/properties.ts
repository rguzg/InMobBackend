import { Router, Request } from "express";
import EasyBrokerAPI, { PropertyList, StatusOptions } from "easybrokerapi";

interface PropertiesRequest extends Request {
    query: {
        page: string,
        limit: string,
        options?: string
    },
}

const router = Router();

router.get('/', async (req: PropertiesRequest, res) => {
    let {page = '1', limit = '15', options} = req.query;
    
    if(!req.headers['authorization']){
        return res.status(401).json({error: 'Unauthorized'});
    }
    
    let eb = new EasyBrokerAPI(req.headers['authorization']);
    
    try {

        let properties: PropertyList;

        if(options){
            properties = await eb.getPropertyList(Number(page), Number(limit), {status:new Set(JSON.parse(options) as StatusOptions[])});
        } else {
            properties = await eb.getPropertyList(Number(page), Number(limit));
        }

        return res.json(properties);
    } catch (error: any) {
        return res.status(401).json({error: error.message});
    }

});

export default router;