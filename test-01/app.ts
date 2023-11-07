import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import mongoose from 'mongoose';

const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose
    .connect('mongodb://http://localhost:27017/my_database', options)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
            }),
        };
    } catch (err: unknown) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }

    return response;
};

export const lambdaPostHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('post request received');
        // Create a new user
        const newUser = new User({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password123',
        });

        const savedUser = await newUser.save();
        // .then(() => console.log('User created'))
        // .catch((err) => console.log(err));
        console.log('User created');
        const savedUserObject = savedUser.toObject();

        return {
            statusCode: 200,
            body: JSON.stringify(savedUserObject),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save data' }),
        };
    }
};
