export interface Resource {
    id: string;
    name: string;
    value: number;
    color: string;
}

const FIRST_ADJECTIVES = [
    "Stygian", "Crimson", "Azure", "Veridian", "Golden", "Shadow", "Sunken", "Void", "Glimmering", "Whispering"
];

const SECOND_NOUNS = [
    "Shale", "Ore", "Crystal", "Geode", "Nugget", "Vein", "Dust", "Fragment", "Essence", "Heartstone"
];

const BASE_COLORS = [
    "#4a4a4a", // Stygian
    "#e53935", // Crimson
    "#1e88e5", // Azure
    "#43a047", // Veridian
    "#fdd835", // Golden
    "#212121", // Shadow
    "#00838f", // Sunken
    "#673ab7", // Void
    "#ffee58", // Glimmering
    "#f48fb1"  // Whispering
];


/**
 * Generates a list of resources for the game.
 * @param count The number of resources to generate.
 * @returns An array of Resource objects.
 */
export const generateResources = (count: number): Resource[] => {
    const resources: Resource[] = [];
    for (let i = 0; i < count; i++) {
        const adjIndex = i % FIRST_ADJECTIVES.length;
        const nounIndex = i % SECOND_NOUNS.length;

        // Make names unique by adding a suffix for loops
        const suffix = i >= FIRST_ADJECTIVES.length ? ` ${Math.floor(i / FIRST_ADJECTIVES.length) + 1}` : '';
        const name = `${FIRST_ADJECTIVES[adjIndex]} ${SECOND_NOUNS[nounIndex]}${suffix}`;
        
        const resource: Resource = {
            id: name.toLowerCase().replace(/\s/g, '-'),
            name: name,
            value: Math.floor(10 * Math.pow(2.5, i)), // Exponentially increasing value
            color: BASE_COLORS[adjIndex],
        };
        resources.push(resource);
    }
    return resources;
};
