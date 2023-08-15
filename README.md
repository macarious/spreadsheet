# Collaborative Spreadsheet for Teaching

This project aims to provide a simple, intuitive, and collaborative spreadsheet application targeting young students learning about math and computing. While traditional spreadsheet applications like Excel may seem overwhelming for beginners, our tool provides the foundational concepts in a simplified manner, making it an excellent introductory tool for teachers to use in the classroom.

## Overview

With the backing of the government and the enthusiastic reception from local teachers, our project's primary goal is to make math and computing accessible to students. The simplified collaborative spreadsheet will allow students to grasp the basics without unnecessary complexities. 

## Development Team

### HUANG, Huixin
Backend Developer - (Calculator)

### HUI, Macarious Kin Fung
Frontend Developer - (UI Design)

### WU, Victor
Backend Developer – (Document Storage)

### ZHANG, Tianyi
Backend Developer – (Spreadsheet)

## Technologies

Our tech stack includes a React Typescript application for the frontend. The project is styled with React Bootstrap and uses the React Router library for navigation. Testing uses the jest library. The server is deployed on AWS EC2 instance. The spreadsheets are stored locally on the server. 

## Features

### Collaborative Editing
- **Shared Access:** Users can access a shared spreadsheet using a single URL, enabling collaborative learning.
- **Cell Editing:** A user can select a cell for editing, ensuring that while the cell is under edit, no other participant can modify its content.
- **Conflict Resolution:** If a user tries to edit a cell that is currently locked by another user, a warning is provided, preventing overwrites and data loss.
- **Real-time Updates:** Changes made by one user are reflected in real time for all other users viewing the spreadsheet.

### Document Store
- **Open Existing Spreadsheets:** Users can choose and open a spreadsheet from a set of available documents, allowing continuity in learning.
- **Save Functionality:** Users can save their work, ensuring that their data is preserved for future reference.
- **Creation of New Sheets:** A user can request a new spreadsheet, providing a blank canvas for fresh ideas and calculations.

### Enhanced Calculator Functions
Apart from basic spreadsheet functionalities, additional calculator functions are provided to further enhance the learning experience.

## Implementation

- **Separation of Concerns:** The application is designed to separate state logic and server logic. While the server (`src\Backend\server.ts`) handles the HTTP requests and responses, the actual state of the spreadsheet, including data and locking mechanism, is managed by `src\Backend\Spreadsheet.ts`.
  
- **Singleton Database Class:** The `Spreadsheet` class in `src\Backend\Spreadsheet.ts` acts as a single source of truth, ensuring that all operations reflect the most recent state of the application. This class provides methods for cell locking, unlocking, updating cell data, and fetching editing status.

- **Conflict Handling:** To manage the editing of cells by multiple users, a locking mechanism is implemented. When a user locks a cell for editing, others cannot edit it until it's unlocked. This ensures data integrity and provides a smooth user experience.

- **Backend Store:** While the demo showcases in-memory storage, it's designed to be extendable. In the future, integration with more persistent data storage solutions can be added to save and load spreadsheets, ensuring long-term data preservation.

## Getting Started

If you are a user, simply go to https://spreadsheet.ec2instance.edu, from there you can input a username and spreadsheet name. Click create and you are good to go!

## Development
To help with the development of this proje
1. Clone the repository `git clone https://github.com/macarious/spreadsheet.git`
2. Install dependencies using `npm install`.
3. Start the server using `npm run server`.
4. Start the frontend in another terminal using `npm start`
4. Access the application in your browser via `http://localhost:3000`.

## Future Enhancements

Based on feedback from teachers and students, future versions might include:
- User authentication for personalized learning experiences.
- Extended functions to further support mathematical learning.
- Integration with more persistent data storage solutions for scalability.

## Conclusion

The Collaborative Spreadsheet for Teaching bridges the gap between traditional teaching methods and the digital age's demands. It offers an intuitive platform for students to collaboratively engage with mathematical and computational concepts, fostering an environment of active learning and participation.
