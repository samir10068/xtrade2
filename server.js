const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // ✅ Add JSON body support

// Trackbox credentials and endpoint
const TRACKBOX_USERNAME = 'xtsadi';
const TRACKBOX_PASSWORD = 'Sa123@';
const TRACKBOX_API_KEY = '2643889w34df345676ssdas323tgc738';
const TRACKBOX_PULL_API_KEY = '264388973aaa9b2f9eb2aa84a9c7382e';
const TRACKBOX_PUSH_URL = 'https://tb.5staraffiliates.com/api/signup/procform';
const TRACKBOX_PULL_URL = 'https://tb.5staraffiliates.com/api/pull/customers';
const AFFILIATE_ID = '2958058';
const GROUP_ID = '24';

// Serve the HTML form
app.get('/', (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  res.send(html);
});

// Handle lead submission
app.post('/submit', async (req, res) => {
  try {
    const payload = {
      ai: AFFILIATE_ID,
      ci: "2",
      gi: GROUP_ID,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      userip: req.body.userip,
      so: req.body.so || "xtrade-funnel",
      sub: "param1",
      ad: "adsource",
      term: "term",
      campaign: "campaign",
      medium: "cpc",
      lg: "EN"
    };

    const headers = {
      'x-trackbox-username': TRACKBOX_USERNAME,
      'x-trackbox-password': TRACKBOX_PASSWORD,
      'x-api-key': TRACKBOX_API_KEY,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(TRACKBOX_PUSH_URL, payload, { headers });

    if (response.data && response.data.status === 'ok') {
      res.send('<h3>✅ Lead sent successfully!</h3><a href="/">Go back</a>');
    } else {
      res.send('<h3>❌ Failed to send lead.</h3><pre>' + JSON.stringify(response.data) + '</pre><a href="/">Try again</a>');
    }
  } catch (error) {
    res.send(`<h3>❌ Error: ${error.message}</h3><a href="/">Go back</a>`);
  }
});

// Pull Leads + Deposits
app.post('/pull-statuses', async (req, res) => {
  const pullHeaders = {
    'x-trackbox-username': TRACKBOX_USERNAME,
    'x-trackbox-password': TRACKBOX_PASSWORD,
    'x-api-key': TRACKBOX_PULL_API_KEY,
    'Content-Type': 'application/json',
  };

  const body = {
    from: req.body.from,
    to: req.body.to,
    type: req.body.type || "3", // 3 = Leads + Deposits
    page: req.body.page || "0"
  };

  try {
    const response = await axios.post(TRACKBOX_PULL_URL, body, { headers: pullHeaders });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Pull API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
