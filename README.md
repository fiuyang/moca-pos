# Moca POS API

Moca POS is a powerful Point of Sale (POS) system built using NestJS. It helps businesses efficiently manage products, transactions, customers, and generate reports.

## Features

- **Product Management**: Add, edit, delete, and view product listings.
- **User Management**: Add, edit, delete, and view user listings.
- **Category Management**: Add, edit, delete, and view category listings.
- **Sale Management**: Create new transactions, view transaction history, and retrieve transaction data.
- **Customer Management**: Add, edit, delete, and view customer listings.
- **Reporting**: Generate daily, weekly, and monthly sales reports (coming soon).
- **Authentication**: JWT (JSON Web Token) based authentication to secure endpoints (coming soon).

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, scalable applications.
- **TypeORM**: ORM for interacting with PostgreSQL databases.
- **PostgreSQL**: A relational database for managing data.
- **JWT**: For user authentication and authorization (coming soon).
- **Swagger**: For API documentation and testing.

## Clone the repository:

```bash
   git clone git@github.com:fiuyang/moca-pos.git
   cd moca-pos
```

## Copy .env file
```bash
   cp .env.example .env
```

## Install dependencies:

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Check Docs Swagger
```bash
$ http://localhost:3000/api/docs/
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
