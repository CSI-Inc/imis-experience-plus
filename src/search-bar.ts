class Config
{
    category: string;
    displayName: string;
    altName: string;
    action: string;
    destination: string;
    isShortcut: boolean;

    constructor(category: string, displayName: string, altName: string, action: string, destination: string, isShortcut: boolean)
    {
        this.category = category;
        this.displayName = displayName;
        this.altName = altName;
        this.action = action;
        this.destination = destination;
        this.isShortcut = isShortcut;
    }

    get search(): string
    {
        return `${this.displayName} ${this.altName} ${this.category}`;
    }
}

interface ClientContext
{
    baseUrl: string;
    isAnonymous: boolean;
    loggedInPartyId: number;
    selectedPartyId: number;
    websiteRoot: string;
    virtualDir: string;
    appTimeZoneOffset: number;
    cookieConsent: number;
}

class CleanUp
{
    // ex: pass in jsonData?.Emails?.$values[position].EmailType
    public static EmailType(json: string): string
    {
        return json?.replace('_', '')?.replace('Email', '')?.replace('Address', '')?.trim() ?? '';
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
        return json?.replace('_', '')?.replace('Phone', '')?.trim() ?? 'Other';
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

class SearchBar
{
    private static readonly VERSION_STRING = "%c CSI %c iMIS Experience Plus! %c v1.3.0 %c ";
    private static readonly VERSION_STYLES = [
        "background-color: #e6b222; color: white;", // CSI
        "background-color: #374ea2; color: white;", // iEP
        "background-color: #00a4e0; color: white;", // Version
        "background-color: inherit; color: inherit;", // Message
    ]

    // Tabs
    public static Tabs: string[];
    public static UserDetailsTab: string = "UserDetailsTab";
    public static CommandBarSelectTab: string = "CommandBarSelectTab";

    // Config
    public static Config: Config[];
    public static ConfigPath: string = "assets/search-bar-config.json";

    //#region SVG Paths
    public static CsiLogoPath: string = "assets/images/csiLogo.svg"
    public static BuildingIconPath: string = "assets/images/buildingIcon.svg"
    public static CakeIconPath: string = "assets/images/cakeIcon.svg"
    public static EmailIconPath: string = "assets/images/emailIcon.svg"
    public static MailboxIconPath: string = "assets/images/mailboxIcon.svg"
    public static PhoneIconPath: string = "assets/images/phoneIcon.svg"
    public static UserTagIconPath: string = "assets/images/userTagIcon.svg"
    public static ExternalIconPath: string = "assets/images/externalIcon.svg";
    public static ExternalIconBluePath: string = "assets/images/externalIconBlue.svg";
    public static IdCardBluePath: string = "assets/images/idCardBlue.svg";
    public static BrowsersIconPath: string = "assets/images/browserIcon.svg";
    public static LockIconPath: string = "assets/images/lockIcon.svg";
    //#endregion

    //#region Component Paths
    public static CommandBarPath: string = "assets/components/commandBar.html";
    public static ShiftButtonPath: string = "assets/components/buttons/shift.html";
    public static PlusButtonPath: string = "assets/components/buttons/plus.html";
    public static EnterButtonPath: string = "assets/components/buttons/enter.html";
    public static EnterButton2Path: string = "assets/components/buttons/enter2.html";
    public static ControlButtonPath: string = "assets/components/buttons/control.html";
    public static ControlButton2Path: string = "assets/components/buttons/control2.html";
    //#endregion

    //#region Assets
    public static CsiLogo: string;
    public static CommandBar: string;
    public static ShiftButton: string;
    public static PlusButton: string;
    public static EnterButton: string;
    public static EnterButton2: string;
    public static ControlButton: string;
    public static ControlButton2: string;
    // Icons
    public static CakeIcon: string;
    public static BuildingIcon: string;
    public static EmailIcon: string;
    public static MailboxIcon: string;
    public static PhoneIcon: string;
    public static UserTagIcon: string;
    public static ExternalIcon: string;
    public static ExternalIconBlue: string;
    public static IdCardBlue: string;
    public static BrowsersIcon: string;
    public static LockIcon: string;

    // TESTING
    public static RVToken: string;
    public static DocumentationUrl: string = "https://help.imis.com/enterprise/search.htm";
    public static ClientContext: ClientContext;
    public static WebsiteUrl: string;
    public static UserDetailsView: string;
    public static UserDetailsViewPath: string = "assets/views/userDetailsTab.html";
    public static GetUserCardActions(userId: string)
    {
        var profileUrl = `${SearchBar.ClientContext.websiteRoot}Party.aspx?ID=${userId}`;
        var credentialsUrl = `${SearchBar.ClientContext.websiteRoot}AsiCommon/Controls/Contact/User/UserEdit.aspx?ID=${userId}`;
        return `
                <div id="userCardActions" class="userDetails">
                    <div id="userCardGoToProfile" class="userCardActionArea">
                        ${SearchBar.IdCardBlue}
                        <a href="${profileUrl}" class="userActionCard">Profile</a>
                        ${SearchBar.EnterButton2}
                    </div>
                    <div id="userCardGoToProfileNewTab" class="userCardActionArea">
                        ${SearchBar.BrowsersIcon}
                        <a id="userCardGoToProfileNewTabUrl" target="_blank" href="${profileUrl}" class="userActionCard">Profile (New Tab)</a>
                    </div>
                    <div id="userCardUserCredentials" class="userCardActionArea">
                        ${SearchBar.LockIcon}
                        <a id="userCardUserCredentialsUrl" href="${credentialsUrl}" class="userActionCard">User Credentials</a>
                        ${SearchBar.EnterButton2}&nbsp;${SearchBar.ControlButton2}
                    </div>
                </div>
            `;
    }
    public static GetProfile(data: any)
    {
        var status = data?.Status?.Description;
        var memberType = data?.AdditionalAttributes?.$values[0].Value;
        var birthDate = CleanUp.Date(data?.BirthDate);
        var phone0 = data?.Phones?.$values[0]?.Number;
        var phone0Type = CleanUp.Phone(data?.Phones?.$values[0]?.PhoneType);
        var phone1 = data?.Phones?.$values[1]?.Number;
        var phone1Type = CleanUp.Phone(data?.Phones?.$values[1]?.PhoneType);

        //email
        console.log('data?.Emails?.$values[0] = ', data?.Emails?.$values[0]);
        console.log('data?.Emails?.$values[1] = ', data?.Emails?.$values[1]);
        console.log('data?.Emails?.$values[2] = ', data?.Emails?.$values[2]);
        var email1 = data?.Emails?.$values[0]?.Address;
        var email1IsPrimary = data?.Emails?.$values[0]?.IsPrimary;
        var email1Type = data?.Emails?.$values[0]?.EmailType;

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
                        <div style="padding:4px 0;">
                            ${SearchBar.CakeIcon}
                            <span class="textBadge">Date of Birth</span>
                            <span style="display:inline-block; vertical-align: middle;">${birthDate}</span>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersPhoneNumber0">
                        ${phone0 ? `
                        <div style="padding:4px 0;">
                            ${SearchBar.PhoneIcon}
                            <span class="textBadge">${phone0Type}</span>
                            <a href="tel:${phone0}" style="display:inline-block; vertical-align: middle;">${phone0}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersPhoneNumber1">
                        ${phone1 ? `
                        <div style="padding:4px 0;">
                            ${SearchBar.PhoneIcon}
                            <span class="textBadge">${phone1Type}</span>
                            <a href="tel:${phone1}" style="display:inline-block; vertical-align: middle;">${phone1}</a>
                        </div>`: ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail1">
                        ${email1 ? `` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail2">

                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersEmail3">

                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress0">
                        ${address0 ? `
                        <div style="padding:4px 0;">
                            ${SearchBar.MailboxIcon}
                            <span class="textBadge">${address0Type}</span>
                            <span style="display:inline-block; vertical-align: middle;">${address0}</span>
                        </div>` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress1">
                        ${address1 ? `

                        ${SearchBar.MailboxIcon}
                            <span class="textBadge" style="margin-right: 6px;">
                                ${address1Type}
                            </span>
                            ${address1}` : ''}
                    </div>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersAddress2">
                        ${address2 ? `${SearchBar.MailboxIcon}
                            <span class="textBadge" style="margin-right: 6px;">
                                ${address2Type}
                            </span>
                            ${address2}` : ''}
                    </div>
                    <h5 style="margin-top: 3rem" class="userDetails userSpecificDetail displayBlock" id="destinationUsersCompanyName">
                        ${companyName ? `${SearchBar.BuildingIcon}
                        <a href="${SearchBar.ClientContext.websiteRoot}/Party.aspx?ID=${companyId}">
                            ${companyName}<span class="userDetailsBadge">ID ${companyId}</span>
                        </a>
                        ` : ''}
                    </h5>
                    <div class="userDetails userSpecificDetail displayBlock" id="destinationUsersTitle">
                        ${userTitle ? `${SearchBar.UserTagIcon}${userTitle}` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    public static GetDocumentationInput(hasInput: boolean, encoded: string, value: string): string
    {
        if (hasInput)
        {
            return `
                <a id="documentationLinkDestination" href="${SearchBar.DocumentationUrl}?q=${encoded}" target="_blank" style="display:block;">
                    <span class="TextButton"
                        style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d; display:inline-block">
                        Search iMIS Documentation
                        ${SearchBar.ExternalIconBlue}
                    </span>
                    <span>${value}</span>
                    <div id="documentationSearchHotKeyHint" style="float: right; display: flex;">
                        ${SearchBar.ShiftButton}&nbsp;
                        ${SearchBar.PlusButton}&nbsp;
                        ${SearchBar.EnterButton}
                    </div>
                </a>
            `;
        }
        else
        {
            return `
                <a id="documentationLinkDestination" href="${SearchBar.DocumentationUrl}" target="_blank">
                    <span class="TextButton"
                        style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
                        Search iMIS Documentation
                        ${SearchBar.ExternalIconBlue}
                    </span>
                </a>
            `;
        }
    }
    //#endregion

    public static async GetResource(path: string): Promise<string>
    {
        var url = chrome.runtime.getURL(path);
        return await $.get({ url, dataType: 'html', type: 'GET' });
    }

    public static async GetAllAssets(): Promise<void>
    {
        SearchBar.CommandBar = await SearchBar.GetResource(SearchBar.CommandBarPath);
        SearchBar.CsiLogo = await SearchBar.GetResource(SearchBar.CsiLogoPath);
        SearchBar.ExternalIcon = await SearchBar.GetResource(SearchBar.ExternalIconPath);
        SearchBar.ExternalIconBlue = await SearchBar.GetResource(SearchBar.ExternalIconBluePath);
        SearchBar.IdCardBlue = await SearchBar.GetResource(SearchBar.IdCardBluePath);
        SearchBar.BrowsersIcon = await SearchBar.GetResource(SearchBar.BrowsersIconPath);
        SearchBar.LockIcon = await SearchBar.GetResource(SearchBar.LockIconPath);
        SearchBar.CakeIcon = await SearchBar.GetResource(SearchBar.CakeIconPath);
        SearchBar.BuildingIcon = await SearchBar.GetResource(SearchBar.BuildingIconPath);
        SearchBar.EmailIcon = await SearchBar.GetResource(SearchBar.EmailIconPath);
        SearchBar.MailboxIcon = await SearchBar.GetResource(SearchBar.MailboxIconPath);
        SearchBar.PhoneIcon = await SearchBar.GetResource(SearchBar.PhoneIconPath);
        SearchBar.UserTagIcon = await SearchBar.GetResource(SearchBar.UserTagIconPath);
        SearchBar.ShiftButton = await SearchBar.GetResource(SearchBar.ShiftButtonPath);
        SearchBar.PlusButton = await SearchBar.GetResource(SearchBar.PlusButtonPath);
        SearchBar.EnterButton = await SearchBar.GetResource(SearchBar.EnterButtonPath);
        SearchBar.EnterButton2 = await SearchBar.GetResource(SearchBar.EnterButton2Path);
        SearchBar.ControlButton = await SearchBar.GetResource(SearchBar.ControlButtonPath);
        SearchBar.ControlButton2 = await SearchBar.GetResource(SearchBar.ControlButton2Path);

        // TODO: i think this html loading and replacing is driving my nuts bc i want it all to work like this:
        //1 Build Some Component
        // inside BUILD:
        // GET HTML (should already be loaded from GetAllAssets?)
        // REPLACE TEMPLATE STUFF (should make a static func to rip throw all the replace calls)
        // SAVE TO VAR FOR REUSE (need more SearchBar.ABC variables)

        // TODO: i think this is how i want it below...
        // SearchBar.CommandBarDocumentationInputWithoutValue = await SearchBar.GetResource(SearchBar.CommandBarDocumentationInputWithoutValuePath);
        // `
        //         <a id="documentationLinkDestination" href="${SearchBar.DocumentationUrl}" target="_blank">
        //             <span class="TextButton"
        //                 style="border: 1px solid lightgray; border-radius: 3px; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; color: #005e7d;">
        //                 Search iMIS Documentation
        //                 <i class="externalIconBlue"></i>
        //             </span>
        //         </a>
        //     `;

        SearchBar.UserDetailsView = await SearchBar.GetResource(SearchBar.UserDetailsViewPath);
        // console.log('SearchBar.UserDetailsView = ', SearchBar.UserDetailsView);
    }

    // Build this Tab on the fly and scrap the whole thing when you're done
    public static SetUserDetails(): void
    {
        var input = $('#commandBarInput').val() as string;

        // Set up view
        var content = SearchBar.UserDetailsView;
        $("#UserDetailsTab").replaceWith(content);

        // Get api data
        var username = this.GetUserName(input); // THIS ONLY GRABS THE USERNAME
        console.log('username = ', username);
        var data = this.GetParty(input);
        console.log('data = ', data);

        // Update view with api data -> right column
        var profile = SearchBar.GetProfile(data)
        $('#userCardProfile').replaceWith(profile);

        // Update view with api data -> left column
        var userActions = SearchBar.GetUserCardActions(input);
        $('#userCardActions').replaceWith(userActions);

        // TODO: Update Documentation Search Area with Created/Updated stuff
    }

    public static GetParty(input: string): Object
    {
        var result = {};
        $.ajax(`${SearchBar.ClientContext.baseUrl}api/Party/${input}`, {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers:
            {
                RequestVerificationToken: SearchBar.RVToken
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

    public static GetUserName(input: string): string
    {
        var result = '';
        $.ajax(`${SearchBar.ClientContext.baseUrl}api/User/${input}`, {
            type: "GET",
            contentType: "application/json",
            async: false,
            headers:
            {
                RequestVerificationToken: SearchBar.RVToken
            },
            success: function (userData)
            {
                console.log('userData = ', userData);
                result = userData;
                // IF SUCCESSFUL -> ADD USERNAME TO #USERNAME
                // ELSE -> REMOVE USERNAME FROM #USERNAME
                // MAKE IT SO #USERNAME IS PART OF THE DOM TO START
                // HERES THE DOM
                // '<span class="Label workBarLabel workBarUsernameLabel">&nbsp;&nbsp;Username&nbsp;</span>N/A

            },
            error: function ()
            {
                console.log('no username for this contact!');
                // DO NOTHING, ITS ALREADY SETUP TO HANDLE N/A
            }
        });
        return result;
    }

    public static RemoveUserDetailsInfo(): void
    {
        $("#UserDetailsTab").empty();
    }

    constructor(private $: JQueryStatic)
    {
        SearchBar.Tabs = [SearchBar.CommandBarSelectTab, SearchBar.UserDetailsTab];
        // Run some checks to determine if we are inside of the iMIS staff site
        if (this.$('head').get(0)?.id !== 'ctl00_Head1' && this.$('form').get(0)?.id !== 'aspnetForm')
        {
            // Not iMIS - do nothing
            return;
        }

        // Initialize the module
        this.init();
    }


    /*

    "ANN"

    Annual Renewals          ~/annualRenewals
    user:ANN                 CTRL+ENTER
    product:ANN
    event:ANN
    docs:ANN                 SHIFT+ENTER

    */


    /**
     * Initializes the various elements of this module.
     */
    init(): void
    {
        this.$(() =>
        {
            SearchBar.RVToken = $("#__RequestVerificationToken").val() as string;
            SearchBar.ClientContext = JSON.parse($('#__ClientContext').val() as string) as ClientContext;
            SearchBar.GetResource(SearchBar.CommandBarPath).then(data =>
            {
                $('body').prepend(data);
            });
            SearchBar.BuildConfig();
            SearchBar.GetAllAssets().then(() =>
            {
                $("#commandBarOverlay .csiLogo").replaceWith(SearchBar.CsiLogo);
                $("#commandBarOverlay .externalIconBlue").replaceWith(SearchBar.ExternalIconBlue);
                $("#commandBarOverlay .externalIcon").replaceWith(SearchBar.ExternalIcon);
            });
        });

        let keysPressed: { [key: string]: boolean } = {};
        document.addEventListener('keydown', async (event) =>
        {
            var isCommandBarVisible = $("#commandBarOverlay").is(":visible");
            keysPressed[event.key] = true;
            console.log('event.key = ', event.key);

            let isAnyCombo = (target1: string, target2: string): boolean =>
            {
                return (keysPressed[target1] && event.key == target2 || keysPressed[target2] && event.key == target1);
            }

            // Open CommandBar
            if (!isCommandBarVisible && isAnyCombo("Shift", "CapsLock"))
            {
                await SearchBar.showOverlay();
            }
            //TODO: this doesnt actually do the hiding... i think its built into one of the css theme classes?
            // Where is this coming from? it looks like id="commandBarOverlay" is what makes this toggle-able???
            // else if (keysPressed['Escape'] && isCommandBarVisible)
            // Close Command Bar
            else if (keysPressed['Escape'])
            {
                // technically chrome has already hidden this, but we need to execute this still for clean up purposes
                await SearchBar.hideOverlay();
            }
            // Go to User Profile
            else if (isCommandBarVisible && event.key === "Enter" && !keysPressed["Shift"] && !keysPressed["Control"] && !keysPressed["Cmd"])
            {
                if ($('#commandBarInput').get(0) === document.activeElement)
                {
                    var input = $('#commandBarInput').val() as string;
                    if (input.length > 0 && $.isNumeric(input))
                    {
                        window.location.replace(`${SearchBar.ClientContext.websiteRoot}/Party.aspx?ID=${input}`);
                    }
                }
            }
            // Go to Documentation
            // TODO: IN CRHOME: Shift + Enter actually is hotkey to open in new window, so this doesnt work in chrome
            else if (isCommandBarVisible && isAnyCombo("Shift", "Enter"))
            {
                if ($('#commandBarInput').get(0) === document.activeElement)
                {
                    var input = $('#commandBarInput').val() as string;
                    if (input.length > 0 && !$.isNumeric(input))
                    {
                        console.log('Opening Docs in new tab!');
                        var openDocumentation = window.open($('#documentationLinkDestination').prop('href') as string, '_blank');
                        if (openDocumentation)
                        {
                            openDocumentation.focus();
                        }
                    }
                }
            }
            // Go to User Credentials
            else if (isCommandBarVisible && isAnyCombo("Shift", "Control"))
            {
                if ($('#commandBarInput').get(0) === document.activeElement)
                {
                    var input = $('#commandBarInput').val() as string;
                    if (input.length > 0 && $.isNumeric(input))
                    {
                        window.location.replace($('#userCardUserCredentialsUrl').prop('href'));
                    }
                }
            }
        });

        document.addEventListener('keyup', (event) =>
        {
            delete keysPressed[event.key];
            console.log('keysPressed OFF = ', keysPressed);
        });
    }

    public static BuildConfig(): void
    {
        SearchBar.GetConfig().then(data =>
        {
            SearchBar.Config = data;
            data.forEach((item, i) =>
            {
                var content = `
                <li data-index="${i}" class="commandBarListItem" name="commandBar" id="commandBar${i}" data-search="${item.search}" action=${item.action}>
                    <a href="${item.destination}" style="color: #222; text-decoration: none;">
                        ${item.category.length > -1 ?
                        `<span style="border: 1px solid lightgray; border-radius: 3px; float: left; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px; min-width: 90px; text-align: center;">
                                ${item.category}
                            </span>`
                        : ''}
                        ${item.displayName}
                        ${item.isShortcut ?
                        `<span style="border: 1px solid lightgray; border-radius: 3px; float: right; background-color:#F4F5F7; font-size: 11px; padding: 2px .5ch; margin-right: 5px;">
                            ~/${item.destination}
                        </span>`
                        : ''}
                    </a>
                </li>
                `;
                $('#commandBarUl').append(content);
                // Add hover effects
                $('.commandBarListItem')
                    .on("mouseenter", function ()
                    {
                        $(this).addClass('commandBarHover').css({ 'background-color': 'rgba(231,231,231,.5', 'cursor': 'pointer' });
                    })
                    .on("mouseleave", function ()
                    {
                        $(this).removeClass('commandBarHover').css('background-color', 'initial');
                    });
            });
        });
    }

    // Use this with '' for showing the spinner so that all tabs are hidden
    public static ActivateTab(activateTab: string): void
    {
        SearchBar.Tabs.forEach(tab =>
        {
            if (tab == activateTab)
            {
                $(`#${tab}`).show();
            }
            else
            {
                $(`#${tab}`).hide();
            }
        });
    }

    public static async GetConfig(): Promise<Config[]>
    {
        var url = chrome.runtime.getURL(SearchBar.ConfigPath);
        var json = await $.get({ url, dataType: 'json', type: 'GET' }) as Config[];
        var result: Array<Config> = [];
        // need to build each Config model so that search can be computed
        json.forEach(i => result.push(new Config(i.category, i.displayName, i.altName, i.action, i.destination, i.isShortcut)));
        return result;
    }

    public static SetDocumentationInput(content: string): void
    {
        $('#commandBarDocumentationInput').html(content);
    }

    public static CaptureInput(): void
    {
        console.log('capture input...');
        // TODO: not sure why this isnt working...
        // $('#commandBarInput').on('keyup', $.debounce(500, SearchBar.Stuff));
        // @ts-ignore
        // $('#commandBarInput').on('input', Cowboy.debounce(500, debouceFn));
        $('#commandBarInput').on('input', Cowboy.debounce(500, (event) =>
        {
            var currentActionBarValue = $(event.target).val() as string;
            var currentActionBarValueUriEncoded = encodeURIComponent(currentActionBarValue);
            var isActionBarNumeric = $.isNumeric(currentActionBarValue);

            // Filter the results
            $('#CommandBarSelectTab li').each((i, e) =>
            {
                var search = $(e).attr('data-search') as string;
                $(e).toggle(search.toLowerCase().indexOf(currentActionBarValue.toLowerCase()) > -1);
            });

            // skipping "Organize Results"

            // Populate Documentation Area and Links
            var content = SearchBar.GetDocumentationInput(currentActionBarValue.length > 0, currentActionBarValueUriEncoded, currentActionBarValue);
            SearchBar.SetDocumentationInput(content);

            // // Populate Profile Jump Information
            if (isActionBarNumeric === true)
            {
                SearchBar.ActivateTab('');
                $('.loaderParent').show();
                setTimeout(() =>
                {
                    $('.loaderParent').hide();
                    SearchBar.SetUserDetails();
                    SearchBar.ActivateTab(SearchBar.UserDetailsTab);
                }, 2 * 1000); // 2 seconds
            }
            else
            {
                if ($('.loaderParent').is(":visible"))
                {
                    console.log('loaderParent is visible and not numeric... hide...');
                    $('.loaderParent').hide();
                }
                SearchBar.ActivateTab(SearchBar.CommandBarSelectTab);
                SearchBar.RemoveUserDetailsInfo();
            }
        }));
    }

    public static async showOverlay(): Promise<void>
    {
        console.log('showOverlay called...');
        //if already showing
        if ($("#commandBarOverlay").is(":hidden"))
        {
            this.hideOverlay();

            console.log('showing...');
            // console.log('show overlay...');
            SearchBar.ActivateTab(SearchBar.CommandBarSelectTab);
            $('#commandBarOverlay').show();

            $('#commandBarExitButton').on("click", async function ()
            {
                console.log('exit clicked...');
                await SearchBar.hideOverlay();
            });

            /*************** ABOUT WORK BAR */
            $('#workBarAboutButton').on('mouseenter', function () { $('#commandBarAboutOverlay').show() });
            $('#workBarAboutButton').on('mouseleave', function () { $('#commandBarAboutOverlay').hide() });

            SearchBar.CaptureInput();

            $('#commandBarInput').trigger("focus");



            // TODO: fix extra handlers being made
            // @ts-ignore
            console.log($._data($('#commandBarExitButton')[0], 'events'));
            // @ts-ignore
            console.log($._data($('.commandBarListItem')[0], 'events'));
            // @ts-ignore
            console.log($._data($('#commandBarInput')[0], 'events'));
            // @ts-ignore
            console.log($._data($('#workBarAboutButton')[0], 'events'));
        }
        else
        {
            console.log('already showing... do nothing...');
        }
    }

    // todo: ESCAPE DOESNT CALL THIS....
    public static async hideOverlay(): Promise<void>
    {
        console.log('hideOverlay called...');
        $('#commandBarOverlay').hide();

        // remove handlers
        $('#commandBarExitButton').off("click");
        $('#commandBarInput').off('input');
        $('#workBarAboutButton').off('mouseenter');
        $('#workBarAboutButton').off('mouseleave');

        // reset whatever view we left off on back to the original
        $('#commandBarInput').val('');
        $('#CommandBarSelectTab li').each(function ()
        {
            $(this).show();
        });
        SearchBar.RemoveUserDetailsInfo();
        SearchBar.SetDocumentationInput(SearchBar.GetDocumentationInput(false, '', ''));
    }
}

new SearchBar($);