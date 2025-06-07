# Chatbot PMB Institut Asia Malang

A webhook service for handling Institut Asia Malang's student admission chatbot using Dialogflow.

## 🚀 Features

- Real-time chat interaction
- Dynamic intent handling
- PostgreSQL database integration
- Rich content responses
- Session management
- Chat history tracking

## 📋 Requirements

- Node.js >= 14.x
- PostgreSQL >= 12.x
- Dialogflow project setup
- Google Cloud credentials

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/rzqh/chatbot-pmb-asia.git
cd chatbot-pmb-asia
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=5432
```

4. Initialize the database:
```bash
psql -U your_db_user -d your_db_name -f src/database/schema.sql
```

## 🏃‍♂️ Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 🌐 API Endpoints

- `POST /webhook`: Main webhook endpoint for Dialogflow
- `GET /health`: Health check endpoint

## 💬 Supported Intents

- Welcome Intent
- Program Study Information
- Registration Schedule
- Registration Process
- Registration Fee
- Campus Location
- Scholarship Information
- Facility Information
- Student Activity Units
- FAQ

## 📁 Project Structure

```
webhookclone/
├── intents/          # Intent handlers
├── routes/           # Express routes
├── services/         # Business logic
├── src/
│   ├── config/      # Configuration files
│   └── database/    # Database scripts
├── .env             # Environment variables
├── index.js         # Application entry point
└── package.json     # Project metadata
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- [@rzqh](https://github.com/rzqh) - Initial work

## 🙏 Acknowledgments

- Institut Asia Malang
- Dialogflow team
- Node.js community

