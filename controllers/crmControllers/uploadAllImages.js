const uploadAllImages = async (req, res, firstApp) => {
    console.log("lets see whats coming in body and files", req.body, req.files)
    try {

        // console.log(req.files)
        for (let file of req.files) {
            const imageBuffer = file.buffer;


            const file1 = bucket.file(file.originalname);

            // console.log("file1 data" , file1)

            const options = {
                metadata: {
                    contentType: 'image/jpeg',
                },
                resumable: false,
            };

            const writable = file1.createWriteStream(options);
            writable.end(imageBuffer);

            await new Promise((resolve, reject) => {
                writable.on('finish', () => {
                    resolve(`Image ${file.originalname} uploaded to Firebase Storage`);

                });

                writable.on('error', (error) => {
                    reject(`Error uploading image to Firebase Storage: ${error}`);
                });
            });
        }

        return res.status(200).send("Images Successfully Uploaded")
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(`${error.message}`)
    }
}

module.exports = uploadAllImages