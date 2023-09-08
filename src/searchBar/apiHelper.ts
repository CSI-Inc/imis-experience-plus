class ApiHelper
{
    constructor() { }

    public async GetParty(input: string, rvToken: string, baseUrl: string): Promise<object | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };

        const response = await fetch(`${baseUrl}api/Party/${input}`, options);
        if (response.status == 200)
        {
            let results = await response.json();
            console.log('GetParty results = ', results);
            return results;
        }
        else
        {
            return null;
        }
    }

    public async GetEvent(input: string, rvToken: string, baseUrl: string): Promise<object | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };

        const response = await fetch(`${baseUrl}api/Event/${input}`, options);
        if (response.status == 200)
        {
            let results = await response.json();
            console.log('GetEvent results = ', results);
            return results;
        }
        else
        {
            return null;
        }
    }

    public async GetEventCategory(input: string, rvToken: string, baseUrl: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };

        const response = await fetch(`${baseUrl}api/EventCategory/${input}`, options);
        if (response.status == 200)
        {
            let results = await response.json();
            console.log('GetEventCategory results = ', results);
            return results.Description;
        }
        else
        {
            return null;
        }
    }

    public async GetUserName(input: string, rvToken: string, baseUrl: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };

        const response = await fetch(`${baseUrl}api/User/${input}`, options);
        if (response.status == 200)
        {
            let results = await response.json();
            console.log('GetUserName results = ', results);
            return results.UserName;
        }
        else
        {
            return null;
        }
    }

    public async FindUserIdByName(input: string, rvToken: string, baseUrl: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': rvToken
            }
        };

        const response = await fetch(`${baseUrl}api/User?username=${input}`, options);

        let results = await response.json();

        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            console.log('FindUserIdByName results = ', results);
            return results.Items.$values[0].Party.Id;
        }
    }

    public async Test(): Promise<string | null>
    {
        var result = '';
        await fetch('https://cdn.cloud.csiinc.com/timewise/version.json', { cache: 'no-cache', method: 'GET' })
            .then(response => response.json())
            .then(data =>
            {
                console.log(data);
                result = data;
            })
            .catch(error =>
            {
                console.error(error);
            });
        return result;
    }
}