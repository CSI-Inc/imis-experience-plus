class CleanUp
{
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    public static EmailType(data: string): string
    {
        return data?.replace('_', '')?.replace('Email', '')?.replace('Address', '')?.trim() ?? 'Other';
    }
    // ex: pass in jsonData?.UpdateInformation?.UpdatedOn
    public static Date(data: string): string
    {
        return !data ? '' : new Date(data)?.toISOString()?.split('T')[0] ?? '';
    }
    // ex: pass in jsonData?.Phones?.$values[2]?.PhoneType
    public static Phone(data: string): string
    {
        var phone = data?.replace('_', '')?.replace('Phone', '')?.trim();
        return phone ? phone : 'Other';
    }
    // ex: jsonData?.Addresses?.$values[0]?.Address?.FullAddress
    public static FullAddress(data: string): string
    {
        return data?.replace('UNITED STATES', 'United States')?.replace('CANADA', 'Canada')?.replace('AUSTRALIA', 'Australia')?.trim();
    }
    // ex: jsonData?.Addresses?.$values[0]?.AddressPurpose
    public static AddressPurpose(purpose: string): string
    {
        return purpose?.replace('Permanent Address', 'Permanent')?.replace('Address', '')?.trim() ?? 'Other';
    }

    /** Converts an event status code to a human-readable string. */
    public static Status(statusCode: string): string
    {
        switch (statusCode)
        {
            case 'A': return 'Active';
            case 'P': return 'Pending';
            case 'F': return 'Frozen';
            case 'C': return 'Closed';
            case 'X': return 'Canceled';
            default: return 'Unknown';
        }
    }
}
