import creatures from './creatures.js';

let resources = 1; // Start with 1 resource
let resourceCap = 1000; // Start with a resource cap

// State for creatures
let creatureState = {
    bacteria: { count: 0, fraction: 0 },
    protozoans: { count: 0, fraction: 0 },
};

// DOM Elements for display
const resourceCount = document.getElementById('resource-count');
const resourceCapDisplay = document.getElementById('resource-cap');
const newCreatureButton = document.getElementById('new-creature-btn');
const increaseCapButton = document.getElementById('increase-cap-btn');

// Function to update resources
function updateResources() {
    const resourceGrowthRate = 100;

    // Increment resources each second by the growth rate, capped at resourceCap
    if (resources < resourceCap) {
        resources += resourceGrowthRate;
        if (resources > resourceCap) {
            resources = resourceCap;
        }
    }

    resourceCount.textContent = Math.floor(resources);
    resourceCapDisplay.textContent = Math.floor(resourceCap);

    updateButtonStates();
}

// Function to grow creatures
function growCreature(creatureKey) {
    const creature = creatureState[creatureKey];
    const creatureData = creatures[creatureKey];
    const growthRateMultiplier = creatureData.growthRateMultiplier;
    const targetKey = creatureData.consumptionTarget;

    let targetState;
    if (targetKey === 'resources') {
        targetState = { count: resources };
    } else {
        targetState = creatureState[targetKey];
    }

    const consumptionRate = creature.count * creatureData.consumptionRate;

    if (targetState.count >= consumptionRate) {
        // Enough food: consume and grow
        targetState.count -= consumptionRate;
        // Multiply count by (1 + growthRateMultiplier)
        // e.g. 5 creatures and a 0.1 multiplier -> 5 * 1.1 = 5.5
        creature.count = creature.count * (1 + growthRateMultiplier);
    } else {
        // Not enough food: consume what’s available and shrink
        targetState.count = Math.max(0, targetState.count - consumptionRate);
        // Multiply count by (1 - growthRateMultiplier)
        // e.g. 5 creatures and a 0.1 multiplier -> 5 * 0.9 = 4.5
        creature.count = Math.max(0, creature.count * (1 - growthRateMultiplier));
    }

    creature.fraction += creature.count - Math.floor(creature.count)
    creature.count = Math.floor(creature.count)
    if (creature.fraction >= 1){
        creature.count++
        creature.fraction--
    }

    // Update displays
    if (targetKey === 'resources') {
        resources = targetState.count;
        resourceCount.textContent = Math.floor(resources);
    } else {
        const targetDisplay = document.getElementById(`${targetKey}-count`);
        if (targetDisplay) {
            targetDisplay.textContent = Math.floor(targetState.count);
        } else {
            console.error(`Element with id '${targetKey}-count' not found in HTML.`);
        }
    }

    const creatureDisplay = document.getElementById(`${creatureKey}-count`);
    if (creatureDisplay) {
        // Display floored value, but internally we keep the float
        creatureDisplay.textContent = Math.floor(creature.count);
    } else {
        console.error(`Element with id '${creatureKey}-count' not found in HTML.`);
    }
}


// Function to dynamically enable or disable buttons
function updateButtonStates() {
    newCreatureButton.disabled = resources < 10;
    increaseCapButton.disabled = creatureState.bacteria.count < 10;
}

// Button Handlers
newCreatureButton.addEventListener('click', () => {
    if (resources >= 10) {
        resources -= 10;
        creatureState.bacteria.count++;
        resourceCount.textContent = Math.floor(resources);
        const bacteriaDisplay = document.getElementById('bacteria-count');
        if (bacteriaDisplay) {
            bacteriaDisplay.textContent = Math.floor(creatureState.bacteria.count);
        }
    }
});

increaseCapButton.addEventListener('click', () => {
    if (creatureState.bacteria.count >= 10) {
        creatureState.bacteria.count -= 10;
        resourceCap = Math.floor(resourceCap * 1.2);
        const bacteriaDisplay = document.getElementById('bacteria-count');
        if (bacteriaDisplay) {
            bacteriaDisplay.textContent = Math.floor(creatureState.bacteria.count);
        }
        resourceCapDisplay.textContent = Math.floor(resourceCap);
    }
});

// Main Game Loop
setInterval(() => {
    console.log('Game loop running');
    updateResources();
    growCreature('bacteria');
    growCreature('protozoans');
}, 1000);
