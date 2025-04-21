# Project Revature - Backend

## Overview

This project is part of the Revature training program. It focuses on backend development, implementing robust APIs, and ensuring seamless integration with frontend systems. The backend is built using Node.js and Express.js, with a focus on scalability and maintainability.

## Features

- RESTful API development
- Database integration with DynamoDB
- Authentication and authorization using JWT
- Unit and integration testing with Jest
- File upload support with AWS S3
- API documentation with Swagger

## Technologies Used

- **Programming Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** DynamoDB
- **Tools:** Jest, AWS SDK, Swagger, Docker

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Project_Revature/Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     SECRET_KEY=your_secret_key
     S3_BUCKET_NAME=your_bucket_name
     AWS_ACCESS_KEY_ID=your_access_key
     AWS_SECRET_ACCESS_KEY=your_secret_access_key
     ```
5. Run the application:
   ```bash
   npm start
   ```

## Testing

To run tests, use the following command:

```bash
npm test
```

## Deployment

To deploy the application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t project-revature-backend .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 5000:5000 project-revature-backend
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running. It is generated using Swagger.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, please contact [your-email@example.com].
