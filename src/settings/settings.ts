/// <reference path="settingsModel.ts" />

class Settings
{
    public static readonly SPACEBAR = 'Spacebar';

    private origConfig: SettingsModel = <SettingsModel>{};

    private defaultConfig: SettingsModel = <SettingsModel>{
        enableIqav2: true,
        enableRisev2: false,
        enableWorkbarv2: false,
        workbarShortcut: Settings.SPACEBAR,
        workbarKbdCtrl: true,
        workbarKbdAlt: false,
        workbarKbdShift: false
    };

    constructor(private $: JQueryStatic)
    {
        // Contains interactive logic for the popout menu speceifically. Will early exit for other pages.
        this.$(async () =>
        {
            if (!$('#iep-menu').length)
            {
                return;
            }

            var config = await this.load();

            $('#enable-iqa').prop('checked', config.enableIqav2);
            $('#enable-rise').prop('checked', config.enableRisev2);
            $('#enable-workbar').prop('checked', config.enableWorkbarv2);
            $('#workbar-kbd').val(config.workbarShortcut);
            $('#kbd-ctrl').prop('checked', config.workbarKbdCtrl);
            $('#kbd-alt').prop('checked', config.workbarKbdAlt);
            $('#kbd-shift').prop('checked', config.workbarKbdShift);

            $('#enable-workbar').on('change', () =>
            {
                this.updateDependentControlState();
            });
            this.updateDependentControlState();

            this.origConfig = config;
            
            $('input').on('change keydown', () =>
            {
                if (this.origConfig.enableIqav2 !== $('#enable-iqa').prop('checked')
                || this.origConfig.enableRisev2 !== $('#enable-rise').prop('checked')
                || this.origConfig.enableWorkbarv2 !== $('#enable-workbar').prop('checked')
                || this.origConfig.workbarShortcut !== $('#workbar-kbd').val()
                || this.origConfig.workbarKbdCtrl !== $('#kbd-ctrl').prop('checked')
                || this.origConfig.workbarKbdAlt !== $('#kbd-alt').prop('checked')
                || this.origConfig.workbarKbdShift !== $('#kbd-shift').prop('checked'))
                {
                    $('#reload-notice').slideDown(100);
                }
                else
                {
                    $('#reload-notice').slideUp(100);
                }
            });

            $('#reload-notice').on('click', () =>
            {
                $('#reload-notice span').text('Reloading...').css('opacity', '0.5');

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) =>
                {
                    chrome.tabs.reload(tabs[0].id)
                        .then(() => 
                            setTimeout(() => window.close(), 1000)
                        );
                });
            });

            $('#workbar-kbd').on('keydown', (e) =>
            {
                e.preventDefault();

                if (e.metaKey || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift')
                {
                    return;
                }

                $('#kbd-ctrl').prop('checked', e.ctrlKey);
                $('#kbd-alt').prop('checked', e.altKey);
                $('#kbd-shift').prop('checked', e.shiftKey);

                // Capitalize the first letter of e.key
                e.key = e.key.charAt(0).toUpperCase() + e.key.slice(1);

                // Rename ' ' to Space
                if (e.key === ' ') e.key = Settings.SPACEBAR;

                // If the user enters backspace, clear the input
                if (e.key === 'Backspace')
                {
                    $('#workbar-kbd').val('');
                }
                else
                {
                    $('#workbar-kbd').val(e.key);
                }

                this.save();
            });

            // If any input on the page changes or any key is pressed, save the settings
            $('input').on('change', () => this.save());
        });
    }

    private updateDependentControlState(): void
    {
        if ($('#enable-workbar').prop('checked'))
        {
            $('#workbar-kbd').prop('disabled', false);
            $('#kbd-ctrl').prop('disabled', false);
            $('#kbd-alt').prop('disabled', false);
            $('#kbd-shift').prop('disabled', false);
        }
        else
        {
            $('#workbar-kbd').prop('disabled', true);
            $('#kbd-ctrl').prop('disabled', true);
            $('#kbd-alt').prop('disabled', true);
            $('#kbd-shift').prop('disabled', true);
        }
    }

    public save(): void
    {
        chrome.storage.sync.set(<SettingsModel>{
            enableIqav2: $('#enable-iqa').prop('checked'),
            enableRisev2: $('#enable-rise').prop('checked'),
            enableWorkbarv2: $('#enable-workbar').prop('checked'),
            workbarShortcut: $('#workbar-kbd').val(),
            workbarKbdCtrl: $('#kbd-ctrl').prop('checked'),
            workbarKbdAlt: $('#kbd-alt').prop('checked'),
            workbarKbdShift: $('#kbd-shift').prop('checked')
        });
    }

    public async load(something?: string): Promise<SettingsModel>
    {
        return new Promise<SettingsModel>((resolve) =>
        {
            chrome.storage.sync.get(this.defaultConfig, settings =>
            {
                resolve(<SettingsModel>{
                    enableIqav2: settings.enableIqav2,
                    enableRisev2: settings.enableRisev2,
                    enableWorkbarv2: settings.enableWorkbarv2,
                    workbarShortcut: settings.workbarShortcut,
                    workbarKbdCtrl: settings.workbarKbdCtrl,
                    workbarKbdAlt: settings.workbarKbdAlt,
                    workbarKbdShift: settings.workbarKbdShift
                });
            });
        });
    }
}

new Settings(jQuery);