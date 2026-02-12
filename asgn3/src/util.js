
export async function loadFileText(path) {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Couldn't load file. Response status: ${response.status}`);
        }

        return await response.text();
    } catch (err) {
        console.log(`Couldn't load file: Error: ${err}`);
    }
}
