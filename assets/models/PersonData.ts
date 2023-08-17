// export interface PersonData
// {
//     $type: string
//     Gender: Gender
//     PersonName: PersonName
//     PrimaryOrganization: PrimaryOrganization
//     Name: string
//     SortIsOverridden: boolean
//     Sort: string
//     AdditionalAttributes: AdditionalAttributes
//     Addresses: Addresses
//     AlternateIds: AlternateIds
//     Emails: Emails
//     FinancialInformation: FinancialInformation
//     Phones: Phones
//     Salutations: Salutations
//     SocialNetworks: SocialNetworks
//     CommunicationTypePreferences: CommunicationTypePreferences
//     UpdateInformation: UpdateInformation
//     PartyId: string
//     Id: string
//     UniformId: string
//     Status: Status
// }

// export interface Gender
// {
//     $type: string
//     Code: string
// }

// export interface PersonName
// {
//     $type: string
//     FirstName: string
//     InformalName: string
//     LastName: string
//     MiddleName: string
//     NamePrefix: string
//     FullName: string
// }

// export interface PrimaryOrganization
// {
//     $type: string
//     OrganizationPartyId: string
//     Name: string
//     Title: string
// }

// export interface AdditionalAttributes
// {
//     $type: string
//     $values: Value[]
// }

// export interface Value
// {
//     $type: string
//     Name: string
//     Value: any
// }

// export interface Addresses
// {
//     $type: string
//     $values: Value2[]
// }

// export interface Value2
// {
//     $type: string
//     AdditionalLines: AdditionalLines
//     Address: Address
//     AddresseeText: string
//     AddressPurpose: string
//     CommunicationPreferences: CommunicationPreferences
//     Fax: string
//     FullAddressId: string
//     Phone: string
//     Salutation: Salutation
//     DisplayName: string
//     DisplayOrganizationTitle: string
//     DisplayOrganizationName: string
// }

// export interface AdditionalLines
// {
//     $type: string
//     $values: any[]
// }

// export interface Address
// {
//     $type: string
//     AddressId: string
//     AddressLines: AddressLines
//     Barcode: string
//     CityName: string
//     CountrySubEntityCode: string
//     CountrySubEntityName: string
//     FullAddress: string
//     PostalCode: string
// }

// export interface AddressLines
// {
//     $type: string
//     $values: string[]
// }

// export interface CommunicationPreferences
// {
//     $type: string
//     $values: Value3[]
// }

// export interface Value3
// {
//     $type: string
//     Reason: string
// }

// export interface Salutation
// {
//     $type: string
//     SalutationMethod: SalutationMethod
//     Text: string
// }

// export interface SalutationMethod
// {
//     $type: string
//     PartySalutationMethodId: string
// }

// export interface AlternateIds
// {
//     $type: string
//     $values: Value4[]
// }

// export interface Value4
// {
//     $type: string
//     Id: string
//     IdType: string
// }

// export interface Emails
// {
//     $type: string
//     $values: any[]
// }

// export interface FinancialInformation
// {
//     $type: string
//     GiftAidInformation: GiftAidInformation
// }

// export interface GiftAidInformation
// {
//     $type: string
//     $values: any[]
// }

// export interface Phones
// {
//     $type: string
//     $values: Value5[]
// }

// export interface Value5
// {
//     $type: string
//     Number: string
//     PhoneType: string
// }

// export interface Salutations
// {
//     $type: string
//     $values: Value6[]
// }

// export interface Value6
// {
//     $type: string
//     IsOverridden: boolean
//     SalutationId: string
//     SalutationMethod: SalutationMethod2
//     Text: string
// }

// export interface SalutationMethod2
// {
//     $type: string
//     PartySalutationMethodId: string
// }

// export interface SocialNetworks
// {
//     $type: string
//     $values: any[]
// }

// export interface CommunicationTypePreferences
// {
//     $type: string
//     $values: any[]
// }

// export interface UpdateInformation
// {
//     $type: string
//     CreatedBy: string
//     CreatedOn: string
//     UpdatedBy: string
//     UpdatedOn: string
// }

// export interface Status
// {
//     $type: string
//     PartyStatusId: string
//     Name: string
//     Description: string
// }
