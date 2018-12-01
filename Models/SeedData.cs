using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WhatsOnTap.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new WhatsOnTapContext(serviceProvider.GetRequiredService<DbContextOptions<WhatsOnTapContext>>()))
            {
                #region Styles

                if (!context.Style.Any())
                {
                    context.Style.AddRange(
                        new Style
                        {
                            name = "American Light Lager"
                        },
                        new Style
                        {
                            name = "American Lager"
                        },
                        new Style
                        {
                            name = "Cream Ale"
                        },
                        new Style
                        {
                            name = "American Wheat Beer"
                        },
                        new Style
                        {
                            name = "International Pale Lager"
                        },
                        new Style
                        {
                            name = "International Amber Lager"
                        },
                        new Style
                        {
                            name = "International Dark Lager"
                        },
                        new Style
                        {
                            name = "American Light Lager"
                        },
                        new Style
                        {
                            name = "Czech Pale Lager"
                        },
                        new Style
                        {
                            name = "Czech Premium Pale Lager"
                        },
                        new Style
                        {
                            name = "Czech Amber Lager"
                        },
                        new Style
                        {
                            name = "Czech Dark Lager"
                        },
                        new Style
                        {
                            name = "Munich Helles"
                        },
                        new Style
                        {
                            name = "Festbier"
                        },
                        new Style
                        {
                            name = "Helles Bock"
                        },
                        new Style
                        {
                            name = "American Light Lager"
                        },
                        new Style
                        {
                            name = "American Light Lager"
                        },
                        new Style
                        {
                            name = "American Light Lager"
                        },
                        new Style
                        {
                            name = "German Leichtbier"
                        },
                        new Style
                        {
                            name = "Kölsch"
                        },
                        new Style
                        {
                            name = "German Helles Exportbier"
                        },
                        new Style
                        {
                            name = "German Pils"
                        },
                        new Style
                        {
                            name = "Märzen"
                        },
                        new Style
                        {
                            name = "Rauchbier"
                        },
                        new Style
                        {
                            name = "Dunkles Bock"
                        },
                        new Style
                        {
                            name = "Vienna Lager"
                        },
                        new Style
                        {
                            name = "Altbier"
                        },
                        new Style
                        {
                            name = "Pale Kellerbier"
                        },
                        new Style
                        {
                            name = "Amber Kellerbier"
                        },
                        new Style
                        {
                            name = "Munich Dunkel"
                        },
                        new Style
                        {
                            name = "Schwartzbier"
                        },
                        new Style
                        {
                            name = "Doppelbock"
                        },
                        new Style
                        {
                            name = "Eisbock"
                        },
                        new Style
                        {
                            name = "Baltic Porter"
                        },
                        new Style
                        {
                            name = "Weissbier"
                        },
                        new Style
                        {
                            name = "Dunkles Weissbier"
                        },
                        new Style
                        {
                            name = "Weizenbock"
                        },
                        new Style
                        {
                            name = "Ordinary Bitter"
                        },
                        new Style
                        {
                            name = "Best Bitter"
                        },
                        new Style
                        {
                            name = "Strong Bitter"
                        },
                        new Style
                        {
                            name = "British Golden Ale"
                        },
                        new Style
                        {
                            name = "Australian Sparkling Ale"
                        },
                        new Style
                        {
                            name = "English IPA"
                        },
                        new Style
                        {
                            name = "Dark Mild"
                        },
                        new Style
                        {
                            name = "British Brown Ale"
                        },
                        new Style
                        {
                            name = "English Porter"
                        },
                        new Style
                        {
                            name = "Scottish Light"
                        },
                        new Style
                        {
                            name = "Scottish Heavy"
                        },
                        new Style
                        {
                            name = "Scottish Export"
                        },
                        new Style
                        {
                            name = "Irish Red Ale"
                        },
                        new Style
                        {
                            name = "Irish Stout"
                        },
                        new Style
                        {
                            name = "Irish Extra Stout"
                        },
                        new Style
                        {
                            name = "Sweet Stout"
                        },
                        new Style
                        {
                            name = "Oatmeal Stout"
                        },
                        new Style
                        {
                            name = "Tropical Stout"
                        },
                        new Style
                        {
                            name = "Foreign Extra Stout"
                        },
                        new Style
                        {
                            name = "British Strong Ale"
                        },
                        new Style
                        {
                            name = "Old Ale"
                        },
                        new Style
                        {
                            name = "Wee Heavy"
                        },
                        new Style
                        {
                            name = "English Barleywine"
                        },
                        new Style
                        {
                            name = "Blonde Ale"
                        },
                        new Style
                        {
                            name = "American Pale Ale"
                        },
                        new Style
                        {
                            name = "American Amber Ale"
                        },
                        new Style
                        {
                            name = "California Common"
                        },
                        new Style
                        {
                            name = "American Brown Ale"
                        },
                        new Style
                        {
                            name = "American Porter"
                        },
                        new Style
                        {
                            name = "American Stout"
                        },
                        new Style
                        {
                            name = "Imperial Stout"
                        },
                        new Style
                        {
                            name = "American IPA"
                        },
                        new Style
                        {
                            name = "Belgian IPA"
                        },
                        new Style
                        {
                            name = "Black IPA"
                        },
                        new Style
                        {
                            name = "Brown IPA"
                        },
                        new Style
                        {
                            name = "Red IPA"
                        },
                        new Style
                        {
                            name = "Rye IPA"
                        },
                        new Style
                        {
                            name = "White IPA"
                        },
                        new Style
                        {
                            name = "Double IPA"
                        },
                        new Style
                        {
                            name = "American Strong Ale"
                        },
                        new Style
                        {
                            name = "American Barleywine"
                        },
                        new Style
                        {
                            name = "Wheatwine"
                        },
                        new Style
                        {
                            name = "Berliner Weisse"
                        },
                        new Style
                        {
                            name = "Flanders Red Ale"
                        },
                        new Style
                        {
                            name = "Oud Bruin"
                        },
                        new Style
                        {
                            name = "Lambic"
                        },
                        new Style
                        {
                            name = "Gueuze"
                        },
                        new Style
                        {
                            name = "Fruit Lambic"
                        },
                        new Style
                        {
                            name = "Witbier"
                        },
                        new Style
                        {
                            name = "Belgian Pale Ale"
                        },
                        new Style
                        {
                            name = "Bière de Garde"
                        },
                        new Style
                        {
                            name = "Belgian Blonde Ale"
                        },
                        new Style
                        {
                            name = "Belgian Golden Strong Ale"
                        },
                        new Style
                        {
                            name = "Trappist Single"
                        },
                        new Style
                        {
                            name = "Belgian Dubbel"
                        },
                        new Style
                        {
                            name = "Belgian Tripel"
                        },
                        new Style
                        {
                            name = "Belgian Dark Strong Ale"
                        },
                        new Style
                        {
                            name = "Gose"
                        },
                        new Style
                        {
                            name = "Kentucky Common"
                        },
                        new Style
                        {
                            name = "Lichtenhainer"
                        },
                        new Style
                        {
                            name = "London Brown Ale"
                        },
                        new Style
                        {
                            name = "Piwo Grodziskie"
                        },
                        new Style
                        {
                            name = "Pre-Prohibition Lager"
                        },
                        new Style
                        {
                            name = "Pre-Prohibition Porter"
                        },
                        new Style
                        {
                            name = "Roggenbier"
                        },
                        new Style
                        {
                            name = "Sahti"
                        },
                        new Style
                        {
                            name = "Brett Beer"
                        },
                        new Style
                        {
                            name = "Mixed-Fermentation Sour Beer"
                        },
                        new Style
                        {
                            name = "Wild Specialty Beer"
                        },
                        new Style
                        {
                            name = "Fruit Beer"
                        },
                        new Style
                        {
                            name = "Fruit and Spice Beer"
                        },
                        new Style
                        {
                            name = "Specialty Fruit Beer"
                        },
                        new Style
                        {
                            name = "Spice, Herb, or Vegetable Beer"
                        },
                        new Style
                        {
                            name = "Autumn Seasonal Beer"
                        },
                        new Style
                        {
                            name = "Winter Seasonal Beer"
                        },
                        new Style
                        {
                            name = "Alternative Grain Beer"
                        },
                        new Style
                        {
                            name = "Alternative Sugar Beer"
                        },
                        new Style
                        {
                            name = "Classic Style Smoked Beer"
                        },
                        new Style
                        {
                            name = "Specialty Smoked Beer"
                        },
                        new Style
                        {
                            name = "Wood-Aged Beer"
                        },
                        new Style
                        {
                            name = "Specialty Wood-Aged Beer"
                        },
                        new Style
                        {
                            name = "Clone Beer"
                        },
                        new Style
                        {
                            name = "Mixed-Style Beer"
                        },
                        new Style
                        {
                            name = "Experimental Beer"
                        }
                    );
                }
                #endregion

                #region Settings

                List<Setting> defaultSettings = new List<Setting>(){
                    new Setting
                    {
                        key = "BreweryName",
                        type = "string",
                        stringValue = "The Best Brewery"
                    },
                    new Setting
                    {
                        key = "ShowOG",
                        type = "bool",
                        boolValue = true
                    },
                    new Setting
                    {
                        key = "ShowFG",
                        type = "bool",
                        boolValue = true
                    }
                };
                defaultSettings.ForEach(setting => 
                {
                    if (!context.Setting.Any(s => s.key == setting.key))
                    {
                        context.Setting.Add(setting);
                    }
                });

                #endregion

                context.SaveChanges();
            }
        }
    }
}