function Port(app) {
    //Start the server
    const port = process.env.PORT || 5000;
    const startServer = async () => {
        try {
            //await client.connect();
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        } catch (err) {
            console.error("Failed to connect to MongoDB:", err.message, err.stack);
        }
    };

    startServer();
}

module.exports = Port;
