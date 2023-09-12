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
        const response = await fetch(`${baseUrl}api/Party?PartyId=${input}`, options);
        // console.log('response = ', response);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            console.log('GetParty results = ', results);
            return results.Items.$values[0];
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
        const response = await fetch(`${baseUrl}api/Event?EventId=${input}`, options);
        // console.log('response = ', response);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            console.log('GetEvent results = ', results);
            return results.Items.$values[0];
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
        const response = await fetch(`${baseUrl}api/EventCategory?EventCategoryId=${input}`, options);
        // console.log('response = ', response);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            console.log('GetEventCategory results = ', results);
            return results.Items.$values[0].Description;
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
        const response = await fetch(`${baseUrl}api/User?UserId=${input}`, options);
        // console.log('response = ', response);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            console.log('GetUserName results = ', results);
            return results.Items.$values[0].UserName;
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
        const response = await fetch(`${baseUrl}api/User?UserName=${input}`, options);
        // console.log('response = ', response);
        let results = await response.json();
        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            console.log('FindUserIdByName results = ', results);
            return results.Items.$values[0].UserId;
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