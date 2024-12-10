import axios from 'axios';

const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL';

interface TrialSignup {
  name: string;
  email: string;
  company: string;
}

export async function sendTrialSignupToN8N(data: TrialSignup) {
  try {
    const response = await axios.post(N8N_WEBHOOK_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error sending data to n8n:', error);
    throw error;
  }
}