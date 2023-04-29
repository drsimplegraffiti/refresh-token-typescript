export default {
    port: 8000,
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 59,
    origin: 'http://localhost:3000',
    logLevel: "info",
    smtp: {
        user: 'aaa5ecc1a6c063',
        pass: 'd8179f9411ebda',
        host: 'sandbox.smtp.mailtrap.io',
        port: 465,
        secure: false
    },
    cloudinary: {
        cloud_name: 'drsimple',
        api_key: '934959128785944',
        api_secret: 'sCnORU-HS1oDaFMuG8EPIvUpKkI',
    },
};
