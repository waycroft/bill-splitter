import { connect } from 'mongoose';
import invariant from "tiny-invariant";

export default async function() {
    invariant(process.env.MONGO_CONNECTION_STRING, "No MONGO_CONNECTION_STRING declared in env, could not connect");
    try {
        await connect(process.env.MONGO_CONNECTION_STRING);
        console.log('connected to mongodb');
    } catch (error) {
       console.log('error connecting to mongodb:', error) 
    }
    
}