import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ["development", "production", "test"],
        }),
        MONGODB_USERNAME: str(),
        MONGODB_PASSWORD: str(),
        MONGODB_DATABASE_NAME: str(),
        ACCESS_TOKEN_PRIVATE_KEY: str(),
        ACCESS_TOKEN_PUBLIC_KEY: str(),
        REFRESH_TOKEN_PRIVATE_KEY: str(),
        REFRESH_TOKEN_PUBLIC_KEY: str(),
    });
}

export default validateEnv;