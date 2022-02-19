import { connect } from 'mongoose';
import invariant from "tiny-invariant";

export default async function() {
    invariant(process.env.MONGO_CONNECTION_STRING, "No MONGO_CONNECTION_STRING declared in env, could not connect");
    await connect(process.env.MONGO_CONNECTION_STRING);
}