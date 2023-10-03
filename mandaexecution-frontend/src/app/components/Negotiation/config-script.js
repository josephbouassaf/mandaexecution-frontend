let selectedOption = null;
    
    export function showPopup() {
      document.getElementById('popup').style.display = 'flex';
    }

    export function showPopup2() {
      console.log("Second Function called");
      document.getElementById('popup2').style.display = 'flex';
    }

    export function selectOption(optionId) {
      if (selectedOption) {
        document.getElementById(selectedOption).classList.remove('selected');
        document.getElementById('content' + selectedOption.replace('option', '')).style.display = 'none';
      }
      document.getElementById(optionId).classList.add('selected');
      document.getElementById('content' + optionId.replace('option', '')).style.display = 'block';
      selectedOption = optionId;
    }
   
    export function submit(event) {
      event.preventDefault();
      const proposalForm = document.getElementById('proposal-form');
      const formData = new FormData(proposalForm);
      const proposalName = formData.get('proposal_name');

      const table = document.getElementById('existingTable').getElementsByTagName('tbody')[0];
      const newRow = table.insertRow();
      newRow.innerHTML = `
        <td>${proposalName}</td>
        <td>Open</td>
        <td>Available in 10 days</td>
        <td>Public</td>
      `;

      document.getElementById('popup2').style.display = 'none';
    }

    // Add this function to print the QR Code to the div
    export function printQrCode() {
    // Assuming that the wallet object and its address exist in your actual code
    const wallet = { address: "some_address_here" };
    
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    new QRCode(qrCodeContainer, `https://go.cb-w.com/messaging?address=${wallet.address}`);
  }
  
// Stream all messages and display in the chatContainer
async function stream_all_messages() {
  const chatContainer = document.getElementById("chatContainer");
  printQrCode();
  
  if (xmtp) {
    for await (const message of await xmtp.conversations.streamAllMessages()) {
      const messageDiv = document.createElement('div');
      messageDiv.textContent = `New message from ${message.senderAddress}: ${message.content}`;
      chatContainer.appendChild(messageDiv);
      console.log(`New message from ${message.senderAddress}: ${message.content}`);
    }
  }
}

// Assume that your other functions are as they are
// ...

// Add this to the bottom of your JavaScript file
export async function executeAsyncCode() {
  try {
    await initialize_the_wallet();
    await create_a_client();
    await start_a_new_conversation();
    await send_a_message();
    await stream_all_messages();
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// You can call this function when the div is clicked