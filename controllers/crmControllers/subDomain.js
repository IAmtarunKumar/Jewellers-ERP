const { default: axios } = require("axios")

const subDomain = async (req, res) => {
    console.log("we are in subdomain", req.body)
    const { abbreviation } = req.body
    const trimmedAbbreviation = abbreviation.replace(/\s/g, "").trim()
    console.log("trimmed abbreviation", trimmedAbbreviation)

    try {
        const response = await axios.post(
            // `https://api.cloudflare.com/client/v4/zones/4394d2102424e5b44e6a95bab1ea0f52/dns_records`, //zoneid for chayahomes
            `https://api.cloudflare.com/client/v4/zones/9761bbe774623035879250fb6aabbcb5/dns_records`, //zoneid for ocpl.tech
            {
                type: 'A',
                // name: `${trimmedAbbreviation}.chayahomes.org`,
                name: `${trimmedAbbreviation}.ocpl.tech`,
                content: "139.84.170.30",
                ttl: 3600,
                proxied: true
            },
            {
                headers: {
                    'Authorization': 'Bearer 5cghBbV2bgsG46c6LDbohhCl1H6isRk_yhsuhJRi',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            //now we check if the https function is working or not
            let attempts = 0;
            const maxAttempts = 10; // adjust this as needed
            const interval = setInterval(async () => {
                attempts++;

                async function checkIfHttpsIsWorking(url) {
                    try {
                        const response = await axios.get(url, {
                            maxRedirects: 5, // Don't follow redirects for the initial check
                            validateStatus: (status) => status >= 200 && status < 400 // Accept any status code that's 2xx or 3xx
                        });

                        if (response.request.res.responseUrl.startsWith('https://')) {
                            console.log("The website is running on HTTPS.");
                            return true
                        } else {
                            console.log("The website is not running on HTTPS.");
                        }
                    } catch (error) {
                        // Check if it's a redirect
                        if (error.response && error.response.status >= 300 && error.response.status < 400) {
                            const redirectURL = error.response.headers.location;
                            if (redirectURL.startsWith('https://')) {
                                console.log("The website redirects to HTTPS.");
                            } else {
                                console.log("The website redirects but not to HTTPS.");
                            }
                        } else {
                            console.error("An error occurred:", error.message);
                        }
                    }
                }
                // Implement the check here. E.g., check if HTTPS is working
                const httpsWorking = await checkIfHttpsIsWorking(`https://${trimmedAbbreviation}.chayahomes.org`); // This is a placeholder function. You would need to define how to check if HTTPS is working
                console.log("what coming https working", httpsWorking)
                if (httpsWorking || attempts >= maxAttempts) {
                    clearInterval(interval); // Stop checking if HTTPS is working or if maxAttempts reached

                    if (httpsWorking) {
                        console.log('HTTPS is now working');
                        // Do anything else you want here, e.g., notify someone or update a database
                        return res.status(200).send('DNS record created successfully');
                    } else {
                        console.log('HTTPS check failed after maximum attempts');
                        // Handle the failure scenario, perhaps send a notification or log it
                        return res.status(400).send('Failed to create DNS record. Timeout');
                    }
                }
            }, 15000); // 15000ms = 15 seconds
        } else {
        }
    } catch (error) {
        console.log("error", error.message)
        res.status(500).send(`Internal server error-${error.message}`);
    }
}

module.exports = subDomain