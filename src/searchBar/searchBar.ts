/// <reference path="../settings/settings.ts" />
/// <reference path="../utils.ts" />

class SearchBar
{
    private static readonly VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.1 %c ";
    private static readonly VERSION_STYLES = [
        "background-color: #e6b222; color: white;", // CSI
        "background-color: #374ea2; color: white;", // iEP
        "background-color: #00a4e0; color: white;", // Version
        "background-color: inherit; color: inherit;", // Message
    ]

    // Tabs
    private Tabs: string[];
    public UserDetailsTab: string = "UserDetailsTab";
    public CommandBarSelectTab: string = "CommandBarSelectTab";

    // Config
    private config: ConfigManager;
    private ConfigRoutes: ConfigItem[] = [];
    private ConfigTags: ConfigItem[] = [];

    //#region SVG Paths
    private CsiLogoPath: string = "assets/images/csiicon.svg"
    private BuildingIconPath: string = "assets/images/buildingIcon.svg"
    private CakeIconPath: string = "assets/images/cakeIcon.svg"
    private EmailIconPath: string = "assets/images/emailIcon.svg"
    private MailboxIconPath: string = "assets/images/mailboxIcon.svg"
    private PhoneIconPath: string = "assets/images/phoneIcon.svg"
    private UserTagIconPath: string = "assets/images/userTagIcon.svg"
    public ExternalIconPath: string = "assets/images/externalIcon.svg";
    private ExternalIconBluePath: string = "assets/images/externalIconBlue.svg";
    private ExternalIconWhitePath: string = "assets/images/externalIconWhite.svg";
    private IdCardBluePath: string = "assets/images/idCardBlue.svg";
    private BrowsersIconPath: string = "assets/images/browserIcon.svg";
    private LockIconPath: string = "assets/images/lockIcon.svg";
    private CloseIconPath: string = "assets/images/closeIcon.svg";
    //#endregion

    //#region Component Paths
    private CommandBarPath: string = "assets/components/commandBar.html";
    private ShiftButtonPath: string = "assets/components/buttons/shift.html";
    private PlusButtonPath: string = "assets/components/buttons/plus.html";
    private EnterButtonPath: string = "assets/components/buttons/enter.html";
    private EnterButton2Path: string = "assets/components/buttons/enter2.html";
    private ControlButtonPath: string = "assets/components/buttons/control.html";
    private ControlButton2Path: string = "assets/components/buttons/control2.html";
    private PrimaryButtonPath: string = "assets/components/buttons/primary.html";
    //#endregion

    //#region Assets
    private CsiLogo: string | null = null;
    private CommandBar: string | null = null;
    private ShiftButton: string | null = null;
    private PlusButton: string | null = null;
    private EnterButton: string | null = null;
    private EnterButton2: string | null = null;
    private ControlButton: string | null = null;
    private ControlButton2: string | null = null;
    private PrimaryButton: string | null = null;
    // Icons
    private CakeIcon: string | null = null;
    private BuildingIcon: string | null = null;
    private EmailIcon: string | null = null;
    private MailboxIcon: string | null = null;
    private PhoneIcon: string | null = null;
    private UserTagIcon: string | null = null;
    public ExternalIcon: string | null = null;
    private ExternalIconBlue: string | null = null;
    private ExternalIconWhite: string | null = null;
    private IdCardBlue: string | null = null;
    private BrowsersIcon: string | null = null;
    private LockIcon: string | null = null;
    private CloseIcon: string | null = null;
    //#endregion

    // TESTING
    private RVToken: string | null = null;
    private DocumentationUrl: string = "https://help.imis.com/enterprise/search.htm";
    private ClientContext: ClientContext | null = null;
    private WebsiteUrl: string | null = null;
    private UserDetailsView: string | null = null;
    private UserDetailsViewPath: string = "assets/views/userDetailsTab.html";

    private settings: Settings;

    constructor(private $: JQueryStatic)
    {
        this.settings = new Settings($);
        this.config = new ConfigManager(this);
        
        this.Tabs = [this.CommandBarSelectTab, this.UserDetailsTab];

        if (!Utils.isImisPage($))
        {
            // Not iMIS - do nothing
            return;
        }

        // Initialize the module
        this.init();
    }

    /**
     * Initializes the various elements of this module..
     */
    async init(): Promise<void>
    {
        var config = await this.settings.load();

        if (!config.enableWorkbar) return;   

        this.$(() =>
        {
            console.log(SearchBar.VERSION_STRING + "Loaded: Search Bar", ...SearchBar.VERSION_STYLES);
            this.RVToken = this.$("#__RequestVerificationToken").val() as string;
            this.ClientContext = JSON.parse(this.$('#__ClientContext').val() as string) as ClientContext;

            // we want to prevent non-users from using the searchbar
            console.log('this.ClientContext.isAnonymous = ', this.ClientContext.isAnonymous);
            if (this.ClientContext.isAnonymous) return;

            this.GetResource(this.CommandBarPath).then(data =>
            {
                this.$('body').prepend(data);
            });
            this.BuildConfig();
            this.GetAllAssets().then(() =>
            {
                this.$("#commandBarOverlay #logo-placeholder").replaceWith(this.CsiLogo ?? "");
                this.$("#commandBarOverlay .externalIconWhite").replaceWith(this.ExternalIconWhite ?? "");
                // this.$("#commandBarOverlay .externalIconBlue").replaceWith(this.ExternalIconBlue);
                this.$("#commandBarOverlay .externalIcon").replaceWith(this.ExternalIcon ?? "");
                this.$("#commandBarOverlay #commandBarExitButton").html(this.CloseIcon ?? "");
            });

            let keysPressed: { [key: string]: boolean } = {};
            
            // on key down
            this.$(document).on("keydown", async e =>
            {
                var isCommandBarVisible = this.$("#commandBarOverlay").is(":visible");

                // Replace space in e.key with "Spacebar"
                if (e.key === " ")
                {
                    e.key = Settings.SPACEBAR;
                }

                // Open CommandBar
                if (!isCommandBarVisible
                    && e.key.toLowerCase() === config.workbarShortcut.toLowerCase()
                    && e.ctrlKey === config.workbarKbdCtrl
                    && e.altKey === config.workbarKbdAlt
                    && e.shiftKey === config.workbarKbdShift)
                {
                    await this.showOverlay();
                    e.preventDefault();
                }
                // Close Command Bar
                else if (isCommandBarVisible && e.key === "Escape")
                {
                    await this.hideOverlay();
                }
                // Go to User Profile
                else if (isCommandBarVisible && e.key === "Enter" && !keysPressed["Shift"] && !keysPressed["Control"] && !keysPressed["Cmd"] && this.$("#UserDetailsTab").is(":visible"))
                {
                    console.log('UserDetailsTab is VISIBLE -> go to user profile');
                    if (this.$('#commandBarInput').get(0) === document.activeElement)
                    {
                        var input = this.$('#commandBarInput').val() as string;
                        if (input.length > 0 && $.isNumeric(input) && this.ClientContext !== null)
                        {
                            var url = `${this.ClientContext.websiteRoot}Party.aspx?ID=${input}`;
                            window.location.replace(url);
                        }
                    }
                }
            });

            document.addEventListener('keyup', (event) =>
            {
                var key = event.key.toLowerCase();
                delete keysPressed[key];
                // console.log('keysPressed OFF = ', keysPressed);
            });
        });
    }

    private GetUserCardActions(userId: string)
    {
        var profileUrl = `${this.ClientContext?.websiteRoot}Party.aspx?ID=${userId}`;
        var credentialsUrl = `${this.ClientContext?.websiteRoot}AsiCommon/Controls/Contact/User/UserEdit.aspx?ID=${userId}`;
        return `
                <div id="userCardActions" class="userDetails">
                    <div id="userCardGoToProfile" class="userCardActionArea">
                        ${this.IdCardBlue}
                        <a href="${profileUrl}" class="userActionCard">Profile</a>
                        ${this.EnterButton2}
                    </div>
                    <div id="userCardUserCredentials" class="userCardActionArea">
                        ${this.LockIcon}
                        <a id="userCardUserCredentialsUrl" href="${credentialsUrl}" class="userActionCard">User Credentials</a>
                    </div>
                </div>
            `;
    }

    private GetProfile(data: any)
    {
        var status = data?.Status?.Description;
        var memberType = data?.AdditionalAttributes?.$values[0].Value;
        var birthDate = CleanUp.Date(data?.BirthDate);
        var phone0 = data?.Phones?.$values[0]?.Number;
        var phone0Type = CleanUp.Phone(data?.Phones?.$values[0]?.PhoneType);
        var phone1 = data?.Phones?.$values[1]?.Number;
        var phone1Type = CleanUp.Phone(data?.Phones?.$values[1]?.PhoneType);
        var email1 = data?.Emails?.$values[0]?.Address;
        var email1IsPrimary = data?.Emails?.$values[0]?.IsPrimary;
        var email1Type = CleanUp.EmailType(data?.Emails?.$values[0]?.EmailType);
        var email2 = data?.Emails?.$values[1]?.Address;
        var email2IsPrimary = data?.Emails?.$values[1]?.IsPrimary;
        var email2Type = CleanUp.EmailType(data?.Emails?.$values[1]?.EmailType);
        var email3 = data?.Emails?.$values[2]?.Address;
        var email3IsPrimary = data?.Emails?.$values[2]?.IsPrimary;
        var email3Type = CleanUp.EmailType(data?.Emails?.$values[2]?.EmailType);
        var address0 = CleanUp.FullAddress(data?.Addresses?.$values[0]?.Address?.FullAddress);
        var address0Type = CleanUp.AddressPurpose(data?.Addresses?.$values[0]?.AddressPurpose);
        var address1 = CleanUp.FullAddress(data?.Addresses?.$values[1]?.Address?.FullAddress);
        var address1Type = CleanUp.AddressPurpose(data?.Addresses?.$values[1]?.AddressPurpose);
        var address2 = CleanUp.FullAddress(data?.Addresses?.$values[2]?.Address?.FullAddress);
        var address2Type = CleanUp.AddressPurpose(data?.Addresses?.$values[2]?.AddressPurpose);
        var companyName = data?.PrimaryOrganization?.Name;
        var companyId = data?.PrimaryOrganization?.OrganizationPartyId
        var userTitle = data?.PrimaryOrganization?.Title;
        return `
            <div id="userCardProfile" class="userDetails">
                <h3 id="destinationUsersName" style="color: #005e7d; margin: 2px">${data?.Name}</h3>
                <div id="details" style="font-size: 90%;">
                    <div id="userDetailsTop" style="margin: 0px 0px 5px 1px;">
                        <span id="destinationUsersId" class="userDetails userSpecificDetail userIndividual" style="padding-right: 6px;">
                            <span class="Label workBarLabel destinationUsersIdLabel">ID: </span>${data?.Id}
                        </span>
                        <span id="destinationUsersStatus" class="userDetails userSpecificDetail userIndividual" style="padding-right: 6px;">
                            <span class="Label workBarLabel destinationUsersStatusLabel">Status: </span>${status}
                        </span>
                        <span id="destinationUsersMemberType" class="userDetails userSpecificDetail">
                            <span class="Label workBarLabel destinationUsersTypeLabel">Type: </span>${memberType}
                        </span>
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersBirthdate">
                        ${birthDate ? `
                        <div style="padding:2px 0;">
                            ${this.CakeIcon}
                            <span class="textBadge">Date of Birth</span>
                            <span style="display:inline-block; vertical-align: middle;">${birthDate}</span>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersPhoneNumber0">
                        ${phone0 ? `
                        <div style="padding:2px 0;">
                            ${this.PhoneIcon}
                            <span class="textBadge">${phone0Type}</span>
                            <a href="tel:${phone0}" style="display:inline-block; vertical-align: middle;">${phone0}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersPhoneNumber1">
                        ${phone1 ? `
                        <div style="padding:2px 0;">
                            ${this.PhoneIcon}
                            <span class="textBadge">${phone1Type}</span>
                            <a href="tel:${phone1}" style="display:inline-block; vertical-align: middle;">${phone1}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail1">
                        ${email1 ? `
                        <div style="padding:2px 0;">
                            ${this.EmailIcon}
                            ${email1IsPrimary ? `${this.PrimaryButton}` : `<span class="textBadge">${email1Type}</span>`}
                            <a href="mailto:${email1}" style="display:inline-block; vertical-align: middle;">${email1}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail2">
                        ${email2 ? `
                        <div style="padding:2px 0;">
                            ${this.EmailIcon}
                            ${email2IsPrimary ? `${this.PrimaryButton}` : `<span class="textBadge">${email2Type}</span>`}
                            <a href="mailto:${email2}" style="display:inline-block; vertical-align: middle;">${email2}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail3">
                        ${email3 ? `
                        <div style="padding:2px 0;">
                            ${this.EmailIcon}
                            ${email3IsPrimary ? `${this.PrimaryButton}` : `<span class="textBadge">${email3Type}</span>`}
                            <a href="mailto:${email3}" style="display:inline-block; vertical-align: middle;">${email3}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress0">
                        ${address0 ? `
                        <div style="padding:2px 0;">
                            ${this.MailboxIcon}
                            <span class="textBadge">${address0Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address0}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress1">
                        ${address1 ? `
                        <div style="padding:2px 0;">
                            ${this.MailboxIcon}
                            <span class="textBadge">${address1Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address1}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress2">
                        ${address2 ? `
                        <div style="padding:2px 0;">
                            ${this.MailboxIcon}
                            <span class="textBadge">${address2Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address2}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersCompanyName">
                        ${companyName ? `
                        <div style="padding:2px 0;">
                            ${this.BuildingIcon}
                            ${companyId ? `
                                <a href="${this.ClientContext?.websiteRoot}Party.aspx?ID=${companyId}">
                                    <span style="vertical-align: middle;">${companyName}</span>
                                    <span class="userDetailsBadge">ID ${companyId}</span>
                                </a>
                                ` : `
                                <span style="vertical-align: middle;">${companyName}</span>
                                <span class="userDetailsBadge">Company ID Not Correctly Linked</span>`
                }
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersTitle">
                        ${userTitle ? `
                        <div style="padding:2px 0;">
                            ${this.UserTagIcon}
                            <span style="display:inline-block; vertical-align: middle;">${userTitle}</span>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // private GetDocumentationInput(hasInput: boolean, encoded: string, value: string): string
    // {
    //     // need to strip input bc it will inject ANYTHING
    //     if (hasInput)
    //     {
    //         return `
    //             <a id="documentationLinkDestination" href="${this.DocumentationUrl}?q=${encoded}" target="_blank">
    //                 <span id="searchDocumentation" class="TextButton">
    //                     Search iMIS Documentation${this.ExternalIconBlue}
    //                 </span><span style="margin-left: 4px;">${value?.trim()}</span>
    //             </a>
    //         `;
    //     }
    //     else
    //     {
    //         return `
    //             <a id="documentationLinkDestination" href="${this.DocumentationUrl}" target="_blank">
    //                 <span class="TextButton"
    //                     style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
    //                     Search iMIS Documentation
    //                     ${this.ExternalIconBlue}
    //                 </span>
    //             </a>
    //         `;
    //     }
    // }

    private GetUserChangeDetails(username: string, data: any): string
    {
        var createdOn = CleanUp.Date(data?.UpdateInformation?.CreatedOn);
        var createdBy = data?.UpdateInformation?.CreatedBy;
        var updatedOn = CleanUp.Date(data?.UpdateInformation?.UpdatedOn);
        var updatedBy = data?.UpdateInformation?.UpdatedBy;
        return `
            <div class="userDetails" id="userCardChangeDetails">
                <span id="destinationUsersCreatedOn">
                    <span class="Label workBarLabel">Created: </span>${createdOn}
                </span>
                <span id="destinationUsersCreatedBy">by ${createdBy}</span>
                <span id="destinationUsersUpdatedOn">
                    <span class="Label workBarLabel">Last Updated: </span>${updatedOn}
                </span>
                <span id="destinationUsersUpdatedBy">by ${updatedBy}</span>
                <span id="destinationUsersUsername">
                    ${username ? `
                        <span class="Label workBarLabel workBarUsernameLabel">Username: </span>${username}
                    ` : ''}
                </span> 
            </div>
        `;
    }

    private async GetResource(path: string): Promise<string>
    {
        var url = chrome.runtime.getURL(path);
        return await $.get({ url, dataType: 'html', type: 'GET' });
    }

    private async GetAllAssets(): Promise<void>
    {
        this.CommandBar = await this.GetResource(this.CommandBarPath);
        this.CsiLogo = await this.GetResource(this.CsiLogoPath);
        this.ExternalIcon = await this.GetResource(this.ExternalIconPath);
        this.ExternalIconBlue = await this.GetResource(this.ExternalIconBluePath);
        this.ExternalIconWhite = await this.GetResource(this.ExternalIconWhitePath);
        this.IdCardBlue = await this.GetResource(this.IdCardBluePath);
        this.BrowsersIcon = await this.GetResource(this.BrowsersIconPath);
        this.LockIcon = await this.GetResource(this.LockIconPath);
        this.CloseIcon = await this.GetResource(this.CloseIconPath);
        this.CakeIcon = await this.GetResource(this.CakeIconPath);
        this.BuildingIcon = await this.GetResource(this.BuildingIconPath);
        this.EmailIcon = await this.GetResource(this.EmailIconPath);
        this.MailboxIcon = await this.GetResource(this.MailboxIconPath);
        this.PhoneIcon = await this.GetResource(this.PhoneIconPath);
        this.UserTagIcon = await this.GetResource(this.UserTagIconPath);
        this.ShiftButton = await this.GetResource(this.ShiftButtonPath);
        this.PlusButton = await this.GetResource(this.PlusButtonPath);
        this.EnterButton = await this.GetResource(this.EnterButtonPath);
        this.EnterButton2 = await this.GetResource(this.EnterButton2Path);
        this.ControlButton = await this.GetResource(this.ControlButtonPath);
        this.ControlButton2 = await this.GetResource(this.ControlButton2Path);
        this.PrimaryButton = await this.GetResource(this.PrimaryButtonPath);

        // TODO: i think this html loading and replacing is driving my nuts bc i want it all to work like this:
        //1 Build Some Component
        // inside BUILD:
        // GET HTML (should already be loaded from GetAllAssets?)
        // REPLACE TEMPLATE STUFF (should make a func to rip throw all the replace calls)
        // SAVE TO VAR FOR REUSE (need more this.ABC variables)

        // TODO: i think this is how i want it below...
        // this.CommandBarDocumentationInputWithoutValue = await this.GetResource(this.CommandBarDocumentationInputWithoutValuePath);
        // `
        //         <a id="documentationLinkDestination" href="${this.DocumentationUrl}" target="_blank">
        //             <span class="TextButton"
        //                 style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
        //                 Search iMIS Documentation
        //                 <i class="externalIconBlue"></i>
        //             </span>
        //         </a>
        //     `;

        this.UserDetailsView = await this.GetResource(this.UserDetailsViewPath);
        // console.log('this.UserDetailsView = ', this.UserDetailsView);
    }

    // Build this Tab on the fly and scrap the whole thing when you're done
    public SetUserDetails(userId = ''): void
    {
        var input = userId ? userId : this.$('#commandBarInput').val() as string;
        console.log('input = ', input);

        // Set up view
        var content = this.UserDetailsView;
        this.$("#UserDetailsTab").replaceWith(content ?? "");

        // Get api data
        var username = this.GetUserName(input); // THIS ONLY GRABS THE USERNAME

        // TODO: this should determin whether or not to set up this view in the first place
        // TODO: extract this and pass in userData if it has it - otherwise stay on commandTab....
        var data = this.GetParty(input);

        // Update view with api data -> right column
        var profile = this.GetProfile(data)
        this.$('#userCardProfile').replaceWith(profile);

        // Update view with api data -> left column
        var userActions = this.GetUserCardActions(input);
        this.$('#userCardActions').replaceWith(userActions);

        // Update Documentation Search Area with Created/Updated stuff
        var changeDetails = this.GetUserChangeDetails(username, data);
        this.$("#userCardChangeDetails").replaceWith(changeDetails);
    }

    private GetParty(input: string): Object
    {
        var result = {};
        $.ajax(`${this.ClientContext?.baseUrl}api/Party/${input}`, {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers:
            {
                RequestVerificationToken: this.RVToken
            },
            success: function (personData)
            {
                console.log('personData = ', personData);
                result = personData;
            },
            error: function ()
            {
                console.log('no party details for this id!');
                // might want to show a "no user found with this id" or something
            }
        });
        return result;
    }

    private GetUserName(input: string): string
    {
        var result = '';
        $.ajax(`${this.ClientContext?.baseUrl}api/User/${input}`, {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers:
            {
                RequestVerificationToken: this.RVToken
            },
            success: function (userData)
            {
                console.log('userData = ', userData);
                result = userData.UserName;
            },
            error: function ()
            {
                console.log('no username for this contact!');
                // DO NOTHING, ITS ALREADY SETUP TO HANDLE N/A
            }
        });
        return result;
    }

    public async FindUserIdByName(input: string): Promise<string | null>
    {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken': this.RVToken ?? ""
            }
        };

        // Use the Fetch API to get the User/_execute endpoint from the API from the client context base URL
        const response = await fetch(`${this.ClientContext?.baseUrl}api/User?username=${input}`, options);

        let results = await response.json();

        if (results.Count !== 1)
        {
            return null;
        }
        else
        {
            return results.Items.$values[0].Party.Id;
        }
    }

    private RemoveUserDetailsInfo(): void
    {
        this.$("#UserDetailsTab").empty();
    }

    private BuildConfig(): void
    {
        ConfigManager.GetConfigInstance().then(data =>
        {
            this.ConfigRoutes = data.filter(d => !d.isTag);
            this.ConfigTags = data.filter(d => d.isTag);
            var view = this.config.BuildRoutesHTML(this.ConfigRoutes);
            this.$('#commandBarUl').html(view);
            this.config.SetEventListeners();
        });
    }

    // Use this with '' for showing the spinner so that all tabs are hidden
    public ActivateTab(activateTab: string): void
    {
        this.Tabs.forEach(tab =>
        {
            if (tab == activateTab)
            {
                this.$(`#${tab}`).show();
                if (tab == this.CommandBarSelectTab)
                {
                    this.SetArrowEventListeners();
                }
            }
            else
            {
                if (tab == this.CommandBarSelectTab)
                {
                    //TODO: this is currently bleeding resources...
                    this.$(".commandBarListItem").off('keydown');
                }
                this.$(`#${tab}`).hide();
            }
        });
    }

    private SetArrowEventListeners(): void
    {
        this.$(".commandBarListItem:first").addClass("commandBarSelected");
        // Get all the <li> elements into a collection
        var listItems = this.$(".commandBarListItem");
        // Set up a counter to keep track of which <li> is selected
        var index = 0;
        // Initialize first li as the selected (focused) one:
        this.$(listItems[index]).addClass("commandBarSelected");
        // Set up a key event handler for the document
        // this.$("#commandBarInput").on("keydown", function (event)
        this.$(document).on("keydown", event =>
        {
            if (this.$("#CommandBarSelectTab").is(":visible"))
            {
                console.log('CommandBarSelectTab is VISIBLE');
                if (listItems.length != this.$(".commandBarListItem").length)
                {
                    listItems = this.$(".commandBarListItem");
                    index = 0;
                }
                switch (event.key)
                {
                    case "ArrowUp":
                        event.preventDefault();
                        // Remove the highlighting from the previous element
                        this.$(listItems[index]).removeClass("commandBarSelected");
                        // Decrease the counter
                        index = index > 0 ? --index : 0;
                        // Highlight the new element
                        this.$(listItems[index]).addClass("commandBarSelected");
                        // Scroll item into view
                        this.$(listItems[index])[0].scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "ArrowDown":
                        event.preventDefault();
                        // Remove the highlighting from the previous element
                        this.$(listItems[index]).removeClass("commandBarSelected");
                        // Increase counter
                        index = index < listItems.length - 1 ? ++index : listItems.length - 1;
                        // Highlight the new element
                        this.$(listItems[index]).addClass("commandBarSelected");
                        // Scroll item into view
                        this.$(listItems[index])[0].scrollIntoView({ block: "nearest", behavior: "auto", inline: "nearest" });
                        break;
                    case "Enter":
                        event.preventDefault();
                        this.$(listItems[index]).children()[0].click();
                        break;
                }
            }
        });
    }

    private CaptureInput(): void
    {
        console.log('capture input...');

        var debounce = (fn: { apply: (arg0: any, arg1: any[]) => void; }, t: number | undefined) =>
        {
            let id: number | undefined;
            return (...args: any) =>
            {
                clearTimeout(id);
                let self = this;
                id = setTimeout(() =>
                {
                    fn.apply(self, args)
                }, t)
            }
        };

        const userCheck = debounce(() =>
        {
            this.$('.loaderParent').hide();
            // i think i want this to return a success/fail value? or myb have a separate check to first talk to the api and pass in user data to this call instead and leave it void
            this.SetUserDetails();
            // based on above, set this to userdetails if success or a not found tab if unsuccessful (this tab will have to have a "not found" type message somewhere)
            // i really dont want this to inside list itmes bc it will dirty everything up and then ill have to actually manage the list
            this.ActivateTab(this.UserDetailsTab);
        }, 500);

        this.$('#commandBarInput').on('input', (event) =>
        {
            var currentActionBarValue = this.$(event.target).val() as string;
            // i think this should encode by default?
            // var currentActionBarValueUriEncoded = encodeURIComponent(currentActionBarValue);
            var isActionBarNumeric = $.isNumeric(currentActionBarValue);
            // Populate Profile Jump Information
            if (isActionBarNumeric === true)
            {
                console.log('isActionBarNumeric = true');
                this.ActivateTab('');
                this.$('.loaderParent').show();
                userCheck();
            }
            else
            {
                if (this.$("#CommandBarSelectTab").is(":hidden"))
                {
                    console.log('CommandBarSelectTab not visible...');
                    if (this.$('.loaderParent').is(":visible"))
                    {
                        console.log('loaderParent is visible and not numeric... hide...');
                        this.$('.loaderParent').hide();
                    }
                    console.log('activate commandbar select tab...');
                    this.ActivateTab(this.CommandBarSelectTab);
                    console.log('remove user details view...');
                    this.RemoveUserDetailsInfo();
                }
            }

            if (currentActionBarValue)
            {
                var filteredSearch = (result: any) => result.score < 0.6;
                const options = {
                    includeScore: true,
                    ignoreLocation: true,
                    includeMatches: true,
                    findAllMatches: true,
                    threshold: 0.2,
                    keys: ['category', 'displayName', 'altName'],
                    shouldSort: true
                }
                const fuse = new Fuse(this.ConfigRoutes, options)
                var results: Fuzzy[] = fuse.search(currentActionBarValue);
                var filteredResults = results.filter(filteredSearch).map(fr => fr.item);
                var routesHTML = this.config.BuildRoutesHTML(filteredResults);
                var tagsHTML = this.config.BuildTagsHTML(this.ConfigTags, filteredResults.length, currentActionBarValue);
                this.$('#commandBarUl').html(routesHTML.concat(tagsHTML));
                this.config.SetEventListeners(true);
            }
            else
            {
                var routesHTML = this.config.BuildRoutesHTML(this.ConfigRoutes);
                this.$('#commandBarUl').html(routesHTML);
                this.config.SetEventListeners();
            }
            // this.$(".commandBarListItem:first").addClass("commandBarSelected");
            this.SetArrowEventListeners();
        });
    }

    private async showOverlay(): Promise<void>
    {
        //if already showing
        if (this.$("#commandBarOverlay").is(":hidden"))
        {
            console.log('show overlay...');
            this.ActivateTab(this.CommandBarSelectTab);
            this.$('#commandBarOverlay').show();
            this.$('#commandBarExitButton').on("click", async () =>
            {
                console.log('exit clicked...');
                await this.hideOverlay();
            });
            this.CaptureInput();
            this.$('#commandBarInput').trigger("focus");

            // TODO: fix extra handlers being made
            // @ts-ignore
            // console.log($._data(this.$('#commandBarExitButton')[0], 'events'));
            // // @ts-ignore
            // console.log($._data(this.$('.commandBarListItem')[0], 'events'));
            // // @ts-ignore
            // console.log($._data(this.$('#commandBarInput')[0], 'events'));
            // // @ts-ignore
            // console.log($._data(this.$(document)[0], 'events'));

            // TODO: 'commandBarExitButton'(CLICK) = BLEEDING
            // TODO: '#commandBarInput'(INPUT) = BLEEDING
            // TODO: 'document'(KEYDOWN) = BLEEDING
        }
        else
        {
            console.log('already showing... do nothing...');
        }
    }

    private async hideOverlay(): Promise<void>
    {
        console.log('hideOverlay called...');
        this.$('#commandBarOverlay').hide();

        // remove handlers
        this.$('#commandBarExitButton').off("click");
        this.$('#commandBarInput').off('input');

        // reset whatever view we left off on back to the original
        this.$('#commandBarInput').val('');

        // todo: add search results / config clearing

        this.RemoveUserDetailsInfo();
    }
}

new SearchBar(jQuery);