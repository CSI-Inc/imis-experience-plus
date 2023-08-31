class CleanUp
{
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    public static EmailType(json: string): string
    {
        var email = json?.replace('_', '')?.replace('Email', '')?.replace('Address', '')?.trim();
        return email ? email : 'Other';
    }
    // ex: pass in jsonData?.UpdateInformation?.UpdatedOn
    public static Date(json: string): string
    {
        if (json)
        {
            return new Date(json)?.toISOString()?.split('T')[0] ?? '';
        }
        else
        {
            return '';
        }
    }
    // ex: pass in jsonData?.Phones?.$values[2]?.PhoneType
    public static Phone(json: string): string
    {
        var phone = json?.replace('_', '')?.replace('Phone', '')?.trim();
        return phone ? phone : 'Other';
    }
    // ex: jsonData?.Addresses?.$values[0]?.Address?.FullAddress
    public static FullAddress(json: string): string
    {
        return json?.replace('UNITED STATES', 'United States')?.replace('CANADA', 'Canada')?.replace('AUSTRALIA', 'Australia')?.trim();
    }
    // ex: jsonData?.Addresses?.$values[0]?.AddressPurpose
    public static AddressPurpose(json: string): string
    {
        var purpose = json?.replace('Permanent Address', 'Permanent')?.replace('Address', '')?.trim();
        return purpose ? purpose : 'Other';
    }
}
