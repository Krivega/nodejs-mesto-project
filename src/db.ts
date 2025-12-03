import mongoose from 'mongoose';

import { MONGO_DB_PORT, MONGO_DB_NAME } from './config';

const connect = async () => mongoose.connect(`mongodb://localhost:${MONGO_DB_PORT}/${MONGO_DB_NAME}`);

export default connect;
