const creatures = {
    bacteria: {
        name: "Bacteria",
        growthRateMultiplier: 0.1,
        consumptionRate: 10,
        consumptionTarget: "resources",
    },
    protozoans: {
        name: "Protozoans",
        growthRateMultiplier: 0.1,
        consumptionRate: 10,
        consumptionTarget: "bacteria",
    },
};

export default creatures;
