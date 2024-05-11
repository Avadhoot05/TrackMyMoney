Expense Tracker
Visit: https://trackmymoney.vercel.app/

Demo on Youtube: https://www.youtube.com/watch?v=2W5UXzU8kCs

# Expense Tracker Web Application

This project is a professional web application developed for tracking expenses. It utilizes React.js for the client-side interface and Node.js for server APIs, providing secure CRUD functionality for managing expenses. MongoDB Atlas cloud database is employed for data storage, including image storage in a remote Cloudinary bucket.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Charting**: Chart.js
- **Data Export**: xlsx package
- **Currency Conversion**: Fixer.io API

## Features

- Secure CRUD functionality for managing expenses
- Image storage for expenses in a remote Cloudinary bucket
- Filters and multi-wallet tracking for transactions
- Monthly insights presented using Chart.js
- Exporting data as an Excel sheet
- Real-time currency conversion using the Fixer.io API

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Avadhoot05/trackmymoney.git
```

2. Install dependencies for both frontend and backend:

```bash
npm install

cd frontend
npm install
```

3. Set up MongoDB Atlas database and Cloudinary account for storage and update configuration accordingly.

4. Obtain an API key from Fixer.io for currency conversion.

5. Start the backend server:

```bash
npm start
```

6. Start the frontend development server:

```bash
cd frontend
npm start
```


## Usage

- Use the application to track expenses, manage transactions, and visualize insights.
- Upload images for expenses securely stored in Cloudinary.
- Export expense data as an Excel sheet for further analysis.
- Benefit from real-time currency conversion to understand expenses in different currencies.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
