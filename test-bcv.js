const axios = require('axios');
const https = require('https');

async function testBCV() {
    console.log("Testing connection to BCV...");
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false // Ignore SSL errors
        });

        const res = await axios.get('https://www.bcv.org.ve/', {
            httpsAgent: agent,
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        console.log("Status:", res.status);
        console.log("Data length:", res.data.length);

        if (res.data.includes("dolar")) {
            console.log("SUCCESS: 'dolar' found in response");
        } else {
            console.log("WARNING: 'dolar' NOT found in response");
        }

    } catch (e) {
        console.error("ERROR:", e.message);
        if (e.response) console.log("Response status:", e.response.status);
    }
}

testBCV();
