class Sanitizer
{
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    public static emailType(data: string): string
    {
        // return data?.replace('_', '')?.replace('Email', '')?.replace('Address', '')?.trim() ?? 'Other';
        var email = data?.replace('_', '')?.replace('Email', '')?.replace('Address', '')?.trim();
        return email ? email : 'Other';
    }
    // ex: pass in jsonData?.UpdateInformation?.UpdatedOn
    public static date(data: string): string
    {
        return !data ? '' : new Date(data)?.toISOString()?.split('T')[0] ?? '';
    }
    // ex: pass in jsonData?.Phones?.$values[2]?.PhoneType
    public static phone(data: string): string
    {
        var phone = data?.replace('_', '')?.replace('Phone', '')?.trim();
        return phone ? phone : 'Other';
    }
    // ex: jsonData?.Addresses?.$values[0]?.Address?.FullAddress
    public static fullAddress(data: string): string
    {
        return data?.replace('UNITED STATES', 'United States')?.replace('CANADA', 'Canada')?.replace('AUSTRALIA', 'Australia')?.trim();
    }
    // ex: jsonData?.Addresses?.$values[0]?.AddressPurpose
    public static addressPurpose(data: string): string
    {
        var purpose = data?.replace('Permanent Address', 'Permanent')?.replace('Address', '')?.trim();
        return purpose ? purpose : 'Other';
    }

    /** Converts an event status code to a human-readable string. */
    public static statusCodeDescription(statusCode: string): string
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
