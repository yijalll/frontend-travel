export async function getData(token: string, url: string) {
    const request = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const response = await request.json();
    return response;
}