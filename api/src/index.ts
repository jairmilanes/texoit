import app from "./app";
import spinner from "./services/spinner.service"
import {moviewsInit} from "./services/movies.init.service";

const port = process.env.PORT || 3131;

app.listen(port, async () => {
    spinner.start()
    spinner.prefixText = "Starting server..."

    const count = await moviewsInit(
        process.env.SEED_FILENAME as string,
        true
    )

    spinner.prefixText = `Server is ready, (${count} Rows)!`
    spinner.text = `http://localhost:${port}`;
    spinner.stopAndPersist();
});

export default app;