import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const swaggerDefinition = {
    openapi:'3.0.0',
    info:{
        title: 'API Documentation',
        version:'1.0.0',
        description:'A simple API documentation'
    },
    server:[
        {url:'http://localhost:5000'}
    ]
}

const options = {
    swaggerDefinition,
    apis:['./Routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)