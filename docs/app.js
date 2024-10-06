// This script will handle the client-side form submission
document.getElementById('message-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting in the traditional way

  // Get the user's message
  const message = document.getElementById('message').value;

  if (!message) {
    alert('Message cannot be empty');
    return;
  }

  // Display the message in the "message-box" div
  const messageBox = document.getElementById('message-box');
  messageBox.textContent = `Your message: ${message}`;
  messageBox.style.display = 'block'; // Make the message box visible
});

// Serve a basic HTML form with inline CSS
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Echo Message</title>
        <style>
          body {
            font-family: Arial, comic-sans;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          h1 {
            color: #ffde59;
          }
          form {
            display: flex;
            flex-direction: column;
            width: 300px;
            margin: auto;
          }
          input {
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          button {
            padding: 10px;
            background-color: #5a67d8;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #4c51bf;
          }
        </style>
      </head>
      <body>
        <h1>Enter a message to echo</h1>
        <form action="/echo" method="POST">
          <input type="text" name="message" placeholder="Type your message" required />
          <button type="submit">Send</button>
        </form>
      </body>
    </html>
  `);
});

// Route to echo the message back
app.post('/echo', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message cannot be empty');
  }

  // Echo the message back to the user with some CSS styling
  res.send(`
    <html>
      <head>
        <title>Message Echo</title>
        <style>
          body {
            font-family: Arial, comic-sans;
            background-color: #f4f4f9;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          }
          h1 {
            color: #ffde59;
          }
          p {
            font-size: 20px;
            background-color: #e2e8f0;
            padding: 20px;
            border-radius: 10px;
            color: #2d3748;
          }
          a {
            margin-top: 20px;
            text-decoration: none;
            color: #5a67d8;
          }
          a:hover {
            color: #4c51bf;
          }
        </style>
      </head>
      <body>
        <h1>Your message:</h1>
        <p>${message}</p>
        <a href="/">Go back</a>
      </body>
    </html>
  `);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
