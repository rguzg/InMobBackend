import { Router, Request } from "express";
import EasyBrokerAPI, { PropertyList, StatusOptions } from "easybrokerapi";

interface PropertiesRequest extends Request {
    query: {
        page: string,
        limit: string,
        options?: string
    },
}
interface PropertyRequest extends Request {
    params: {
        id: string
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

router.get('/:id', async (req: PropertyRequest, res) => {
    let {id} = req.params;
    
    if(!req.headers['authorization']){
        return res.status(401).json({error: 'Unauthorized'});
    }

    if(!id){
        return res.status(400).json({error: 'Bad Request'});
    }
    
    let eb = new EasyBrokerAPI(req.headers['authorization']);
    
    try {

        let property = await eb.getPropertyByID(id);

        if(!property){
            return res.status(404).json(property);
        }

        return res.json(property);
    } catch (error: any) {
        return res.status(401).json({error: error.message});
    }

});

export default router;