// Input: my real data file
// Output: copy of that file, with all company names and notes sanitized
// Example usage:
//   npm run real2sample

import { writeFileSync  } from "fs";
import { Application } from "../../common/Application";
import { getAll } from "../../backend/src/models/applications";

const outputFile = [process.env.LOCAL_FILESYSTEM_SAMPLE_DATA_PATH, "demo_data.ts"].join("/");

const randomElement = <Type>(array: Type[]): Type => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};

// Data I'm leaving as-is:
// dates & statuses
// role
// source
const sanitize = (applications: Application[]): Application[] => {
    return applications.map(application => {
        application.companyName = randomElement(fakeCompanies);
        application.note = "";
        return application;
    });
};

const saveSampleData = async (applicationArray: Application[]): Promise<void> => {
    try {
        await writeFileSync(outputFile, [
            "// anonymized copy of real data. See `npm run r2s`.",
            `import { Application } from "../common/Application";`,
            "export const demoData: Application[] = ",
            JSON.stringify(applicationArray, null, 4),
        ].join("\n"), "utf-8");
        console.log(`wrote data to ${outputFile}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`error writing applications data to disk: ${error.stack}`);
        }
    }
};


(async () => {
    try {
        const realData = <Application[]> await getAll();
        const sanitized = sanitize(realData);
        await saveSampleData(sanitized);
        console.log(`Finished!`);
        process.exit(0);
    } catch (error) {
        console.error(`Caught error!\n${(error as Error).stack}`);
        process.exit(1);
    }
})();

// From https://en.wikipedia.org/wiki/List_of_fast_food_restaurant_chains
const fakeCompanies = ["85°C Bakery Cafe", "A&W", "A&W", "A&W Restaurants", "Amato's", "Andy's Frozen Custard", "Arby's", "Arby's", "Arctic Circle Restaurants", "Arthur Treacher's", "Auntie Anne's", "Auntie Anne's", "Baja Fresh", "Barberitos", "Big Boy Restaurants", "Blake's Lotaburger", "Blaze Pizza", "Blimpie", "Bojangles", "Bonchon Chicken", "Booster Juice", "Booster Juice", "Boston Pizza", "Braum's", "Burger Baron", "Burger King", "Burger King", "Burger Street", "BurgerFi", "Burgerville", "California Pizza Kitchen", "Captain D's Seafood Kitchen", "Carino's Italian", "Carl's Jr.", "Carl's Jr.", "Charleys Philly Steaks", "Checkers and Rally's", "Checkers and Rally's", "Cheddar's Scratch Kitchen", "Chefette", "Chester's", "Chez Ashton", "Chick-fil-A", "Chick-fil-A", "Chicken Delight", "Chicken Express", "Chipotle Mexican Grill", "Church's / Texas Chicken", "Church's/Texas Chicken", "Cinnabon", "Coffee Time", "Cook Out", "Cora", "Country Style", "Culver's", "Culvers", "Dairy Queen", "Dairy Queen", "Daylight Donuts", "Del Taco", "Del Taco", "DiBella's", "Dixie Lee Fried Chicken", "Dodo Pizza", "Domino's", "Duchess", "Dunkin' Donuts", "Dunkin' Donuts", "Earth Burger", "East Side Mario's", "Edo Japan", "Eegee's", "Einstein Bros. Bagels", "El Chico", "El Pollo Loco", "El Taco Tote", "Erbert & Gerbert's", "Extreme Pita", "Farmer Boys", "Five Daughters Bakery", "Five Guys", "Five Guys Burgers and Fries", "Fosters Freeze", "Freddy's Frozen Custard & Steakburgers", "Freshii", "Fryer's", "Godfather's Pizza", "Gold Star Chili", "Golden Chick", "Good Times Burgers & Frozen Custard", "Greco Pizza", "Green Burrito / Red Burrito", "Guthrie's", "Hardee's", "Hardee's", "Harvey's", "Hero Certified Burgers", "Honey Dew Donuts", "Hooters", "Hot 'n Now", "Huddle House", "Hungry Howie's Pizza", "Hunt Brothers Pizza", "IHOP", "In-N-Out Burger", "Jack in the Box", "Jack's", "Jamba Juice", "Jason's Deli", "Jersey Mike's Subs", "Jet's Pizza", "Jim's Restaurants", "Jimmy John's", "Jimmy the Greek", "Joe's Crab Shack", "Johnny Rockets", "Jollibee", "Jollibee", "KFC", "KFC/Kentucky Fried Chicken", "Kelseys Original Roadhouse", "Kewpee", "King of Donair", "King's Seafood Company", "Krispy Kreme", "Krispy Kreme", "Krispy Krunchy Chicken", "Krystal", "L&L Hawaiian Barbecue", "La Belle Province", "LaMar's Donuts", "LaRosa's Pizzeria", "Lafleur Restaurants", "Le Pain Quotidien", "Ledo Pizza", "Lee's Famous Recipe Chicken", "Legal Sea Foods", "Lion's Choice", "Little Caesars", "Little Caesars Pizza", "Logan's Roadhouse", "Long John Silver's", "Long John Silver's", "MOD Pizza", "Maid-Rite", "Manchu Wok", "Marco's Pizza", "Marco's Pizza", "Mary Brown's Chicken", "McAlister's Deli", "McDonald's", "McDonald's", "Milestones Grill & Bar", "Milo's Hamburgers", "Mister Donut", "Moe's Southwest Grill", "Montana's BBQ & Bar", "Mooyah", "Mr. Sub", "MrBeast Burger", "Mrs. Fields", "Mrs. Winner's Chicken & Biscuits", "Mucho Burrito", "Nathan's Famous", "New York Fries", "Noodles & Company", "Olive Garden", "On the Border Mexican Grill & Cantina", "Orange Julius", "Original Tommy's", "Panda Express", "Panda Express", "Panera", "Panera Bread", "Papa Gino's", "Papa John's", "Papa John's Pizza", "Papa Murphy's", "Paris Baguette", "Penguin Point", "Penn Station East Coast Subs", "Perkins Restaurant & Bakery", "Peter Piper Pizza", "Peter Piper Pizza", "Pieology", "Pita Pit", "Pita Pit", "Pizza 73", "Pizza Hut", "Pizza Hut", "Pizza Inn", "Pizza Inn", "Pizza Nova", "Pizza Pizza", "Pizza Ranch", "Planet Smoothie", "Pollo Campero", "Pollo Tropical", "Pollo Tropical", "Popeyes", "Popeyes", "Port of Subs", "Portillo's", "Potbelly Sandwich Works", "Qdoba", "Quizno's Classic Subs", "Quiznos", "Raising Cane's", "Raising Cane's Chicken Fingers", "Rax", "Red Lobster", "Rita's Italian Ice", "Robeks", "Robin's Donuts", "Romano's Macaroni Grill", "Rosati's", "Round Table Pizza", "Roy Rogers Restaurants", "Rubio's Coastal Grill", "Ruby Tuesday", "Runza", "Salad and Go", "Saladworks", "Saltgrass Steak House", "Sarku Japan", "Sbarro", "Sbarro", "Schlotzsky's", "Seattle's Best Coffee", "Second Cup Café", "Shake Shack", "Shake Shack", "Shakey's Pizza", "Shipley Do-Nuts", "Shoney's", "Sizzler", "Skyline Chili", "Slim Chickens", "Smashburger", "Smoothie King", "Smoothie King", "Sneaky Pete's", "Sonic Drive-In", "Spaghetti Warehouse", "Spangles", "St-Hubert", "Starbucks", "Steak 'n Shake", "Steak 'n Shake", "Steak Escape", "Stir Crazy", "Subway", "SuperDeluxe", "Sweet Frog", "Sweetgreen", "Swensen's", "Swensons", "Swiss Chalet", "TCBY", "Taco Bell", "Taco Bell", "Taco Bueno", "Taco Cabana", "Taco John's", "Taco Mayo", "Taco Tico", "Taco Time", "Taco del Mar", "Tastee-Freeze", "Thaï Express", "The Habit Burger Grill", "The Halal Guys", "The Human Bean", "The Keg", "The Melting Pot", "The Old Spaghetti Factory", "The Pizza Company", "Tim Hortons", "Tim Hortons", "Togo's", "Top Pot Doughnuts", "Tropical Smoothie Cafe", "Tudor's Biscuit World", "Twin Peaks", "Umami Burger", "Valentine", "Valentino's", "Village Inn", "Voodoo Doughnut", "Waffle House", "Wahlburgers", "Wendy's", "Wendy's", "Wetzel's Pretzels", "Wetzel's Pretzels", "Whataburger", "Whataburger", "Which Wich?", "White Castle", "White Castle", "White Spot", "Wienerschnitzel", "Wienerschnitzel", "Wild Wing", "Winchell's Donuts", "WingStreet", "Wingstop", "Wingstop", "Wolfgang's Steakhouse", "Yogen Früz", "Yoshinoya", "Yum-Yum Donuts", "Zaxby's", "Zip's Drive-in", "Zippy's", "barBURRITO Canada"];

