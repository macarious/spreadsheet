import React from 'react'

export default function Home() {

  return (

    //Create a homepage that will be the landing page for the application. It will allow users to create a new spreadsheet or load an existing one.
    //The homepage will have a header with the name of the application and a button to create a new spreadsheet.
    //The homepage will have a list of existing spreadsheets that can be loaded by clicking on them.
    //The homepage will have a footer with the name of the developer and a link to their portfolio.
    <div>
        <h1>Spreadsheet App</h1>
        <button>Create New Spreadsheet</button>
        <h2>Existing Spreadsheets</h2>
        <ul>
            <li>Spreadsheet 1</li>
            <li>Spreadsheet 2</li>
            <li>Spreadsheet 3</li>
        </ul>
        <footer>Developed by: <a href="https://www.linkedin.com/in/brandon-lee-3b3b3b1b0/">Brandon Lee</a></footer>
    </div>
  )
}
