// Jamaican Community Crime & Natural Hazards Data
// Source: Jamaica Constabulary Force, U.S. State Dept, UK Travel Advisory, ODPEM

module.exports = [
  // 🔫 CRIME (5 incidents)
  {
    id: "crime-1",
    type: "crime",
    severity: "extreme",
    location: "Tivoli Gardens",
    parish: "Kingston West",
    description: "Historic base of the Shower Posse. Highest concentration of gang activity.",
    latitude: 17.9712,
    longitude: -76.8347,
    details: "Frequent states of emergency and security operations",
    riskLevel: "Extreme"
  },
  {
    id: "crime-2",
    type: "crime",
    severity: "extreme",
    location: "Spanish Town (Central)",
    parish: "St. Catherine",
    description: "Jamaica's most dangerous city. Gang-controlled areas.",
    latitude: 17.9914,
    longitude: -76.9564,
    details: "No-go zone for outsiders, frequent gang violence",
    riskLevel: "Extreme"
  },
  {
    id: "crime-3",
    type: "crime",
    severity: "very_high",
    location: "Flankers",
    parish: "St. James",
    description: "Close to tourist resorts. High violent crime rate.",
    latitude: 18.4762,
    longitude: -77.9200,
    details: "Regular gang shootings and street robberies",
    riskLevel: "Very High"
  },
  {
    id: "crime-4",
    type: "crime",
    severity: "extreme",
    location: "Russia Community",
    parish: "Westmoreland",
    description: "U.S. State Dept Do Not Travel designation.",
    latitude: 18.0189,
    longitude: -78.1339,
    details: "Gang-driven violence and turf wars",
    riskLevel: "Extreme"
  },
  {
    id: "crime-5",
    type: "crime",
    severity: "very_high",
    location: "Mountain View Avenue",
    parish: "Kingston East",
    description: "Controlled by the South Clan gang.",
    latitude: 18.0150,
    longitude: -76.7800,
    details: "Frequent gun battles, restricted access",
    riskLevel: "Very High"
  },

  // 🚗 ROAD ACCIDENTS (5 incidents)
  {
    id: "accident-1",
    type: "accident",
    severity: "extreme",
    location: "Rose Hall Main Road",
    parish: "St. James",
    description: "Jamaica's single deadliest road. 34 fatalities in 5 years.",
    latitude: 18.4950,
    longitude: -77.8900,
    details: "Dangerous high-speed driving near tourist areas",
    riskLevel: "Extreme"
  },
  {
    id: "accident-2",
    type: "accident",
    severity: "very_high",
    location: "Llandovery / Laughlands",
    parish: "St. Ann",
    description: "Treacherous winding roads with fatal curves.",
    latitude: 18.4200,
    longitude: -77.4500,
    details: "Sharp curves, landslides, limited visibility",
    riskLevel: "Very High"
  },
  {
    id: "accident-3",
    type: "accident",
    severity: "very_high",
    location: "Bay Main Road (Little London)",
    parish: "Westmoreland",
    description: "17 road deaths in 5 years.",
    latitude: 18.0800,
    longitude: -78.1100,
    details: "Poor road maintenance, dangerous intersections",
    riskLevel: "Very High"
  },
  {
    id: "accident-4",
    type: "accident",
    severity: "high",
    location: "Washington Boulevard",
    parish: "St. Andrew",
    description: "High-traffic arterial road with frequent collisions.",
    latitude: 18.0250,
    longitude: -76.7900,
    details: "Heavy traffic, jaywalking incidents",
    riskLevel: "High"
  },
  {
    id: "accident-5",
    type: "accident",
    severity: "high",
    location: "Melrose Hill Bypass",
    parish: "Clarendon",
    description: "High-speed highway with increasing fatality rate.",
    latitude: 17.9100,
    longitude: -77.1200,
    details: "Speeding, overtaking accidents",
    riskLevel: "High"
  },

  // 🌊 FLOODING (5 incidents)
  {
    id: "flood-1",
    type: "flood",
    severity: "very_high",
    location: "Montego Bay Town Centre",
    parish: "St. James",
    description: "Urban flooding during heavy rains.",
    latitude: 18.4762,
    longitude: -77.8939,
    details: "Flash floods, poor drainage system",
    riskLevel: "Very High"
  },
  {
    id: "flood-2",
    type: "flood",
    severity: "high",
    location: "Old Harbour",
    parish: "St. Catherine",
    description: "Coastal flooding and storm surge impact.",
    latitude: 17.9400,
    longitude: -76.9300,
    details: "Seasonal flooding, crop damage",
    riskLevel: "High"
  },
  {
    id: "flood-3",
    type: "flood",
    severity: "very_high",
    location: "Yallahs River Valley",
    parish: "St. Thomas",
    description: "River overflow during tropical systems.",
    latitude: 17.9167,
    longitude: -76.6500,
    details: "River flooding, bridge damage",
    riskLevel: "Very High"
  },
  {
    id: "flood-4",
    type: "flood",
    severity: "high",
    location: "Cave Valley",
    parish: "St. Ann",
    description: "Karst topography causes sudden water accumulation.",
    latitude: 18.3833,
    longitude: -77.4667,
    details: "Underground drainage, sudden flooding",
    riskLevel: "High"
  },
  {
    id: "flood-5",
    type: "flood",
    severity: "moderate",
    location: "Annotto Bay",
    parish: "St. Mary",
    description: "Coastal town susceptible to storm surge.",
    latitude: 18.1833,
    longitude: -76.8667,
    details: "Dual flood risk from sea and river",
    riskLevel: "Moderate"
  },

  // 🌀 HURRICANE (5 incidents)
  {
    id: "hurricane-1",
    type: "hurricane",
    severity: "extreme",
    location: "Savanna-la-Mar",
    parish: "Westmoreland",
    description: "Low-lying coastal capital. Hurricane storm surge zone.",
    latitude: 18.0189,
    longitude: -78.1339,
    details: "Storm surge flooding, mandatory evacuation zone",
    riskLevel: "Extreme"
  },
  {
    id: "hurricane-2",
    type: "hurricane",
    severity: "very_high",
    location: "Port Royal",
    parish: "Kingston",
    description: "Historic port on sand spit. Storm surge vulnerable.",
    latitude: 17.9361,
    longitude: -76.8533,
    details: "Coastal erosion, historical hurricane damage",
    riskLevel: "Very High"
  },
  {
    id: "hurricane-3",
    type: "hurricane",
    severity: "high",
    location: "Annotto Bay",
    parish: "St. Mary",
    description: "North coast exposure to Atlantic hurricanes.",
    latitude: 18.1833,
    longitude: -76.8667,
    details: "Hurricane wind exposure, coastal flooding",
    riskLevel: "High"
  },
  {
    id: "hurricane-4",
    type: "hurricane",
    severity: "high",
    location: "Montego Bay Waterfront",
    parish: "St. James",
    description: "Tourist district vulnerable to storm surge.",
    latitude: 18.4762,
    longitude: -77.8939,
    details: "Coastal infrastructure at risk",
    riskLevel: "High"
  },
  {
    id: "hurricane-5",
    type: "hurricane",
    severity: "moderate",
    location: "Black River",
    parish: "St. Elizabeth",
    description: "Mouth of longest river. Storm surge travels inland.",
    latitude: 18.0267,
    longitude: -77.8533,
    details: "River-surge interaction, wetland flooding",
    riskLevel: "Moderate"
  },

  // 🔥 FIRE (5 incidents)
  {
    id: "fire-1",
    type: "fire",
    severity: "high",
    location: "Spanish Town",
    parish: "St. Catherine",
    description: "Dense urban area with frequent structural fires.",
    latitude: 17.9914,
    longitude: -76.9564,
    details: "Building fires, electrical hazards",
    riskLevel: "High"
  },
  {
    id: "fire-2",
    type: "fire",
    severity: "moderate",
    location: "St. Catherine Interior",
    parish: "St. Catherine",
    description: "Dry season bush fires threaten agricultural areas.",
    latitude: 17.9500,
    longitude: -76.9000,
    details: "Vegetation fires, smoke hazard",
    riskLevel: "Moderate"
  },
  {
    id: "fire-3",
    type: "fire",
    severity: "moderate",
    location: "St. Elizabeth Interior",
    parish: "St. Elizabeth",
    description: "Large parish prone to seasonal bush fires.",
    latitude: 18.0500,
    longitude: -77.7500,
    details: "Grassland fires, agricultural damage",
    riskLevel: "Moderate"
  },
  {
    id: "fire-4",
    type: "fire",
    severity: "moderate",
    location: "Clarendon Interior",
    parish: "Clarendon",
    description: "Agricultural heartland with frequent crop fires.",
    latitude: 17.9000,
    longitude: -77.1500,
    details: "Sugar cane fires, agricultural burning",
    riskLevel: "Moderate"
  },
  {
    id: "fire-5",
    type: "fire",
    severity: "high",
    location: "Riverton City Dump",
    parish: "Kingston",
    description: "Landfill fires produce toxic smoke.",
    latitude: 17.9600,
    longitude: -76.8500,
    details: "Toxic fumes, respiratory health risk",
    riskLevel: "High"
  },

  // 🏔️ LANDSLIDE (5 incidents)
  {
    id: "landslide-1",
    type: "landslide",
    severity: "very_high",
    location: "Blue Mountains Upper Slopes",
    parish: "St. Andrew",
    description: "Steep mountain slopes prone to landslides.",
    latitude: 18.0833,
    longitude: -76.7500,
    details: "Road blockages, slope instability",
    riskLevel: "Very High"
  },
  {
    id: "landslide-2",
    type: "landslide",
    severity: "high",
    location: "Stony Hill",
    parish: "St. Andrew",
    description: "Hillside communities on unstable slopes.",
    latitude: 18.0667,
    longitude: -76.8000,
    details: "Residential area at risk, road cuts",
    riskLevel: "High"
  },
  {
    id: "landslide-3",
    type: "landslide",
    severity: "high",
    location: "Rio Minho Valley",
    parish: "Clarendon",
    description: "River valley with steep sides prone to slope failure.",
    latitude: 18.0167,
    longitude: -77.4333,
    details: "Valley flooding, slope saturation",
    riskLevel: "High"
  },
  {
    id: "landslide-4",
    type: "landslide",
    severity: "moderate",
    location: "Content Gap / Newcastle Road",
    parish: "St. Andrew",
    description: "Mountain road with history of landslides.",
    latitude: 18.0833,
    longitude: -76.7333,
    details: "Road closures, isolated communities",
    riskLevel: "Moderate"
  },
  {
    id: "landslide-5",
    type: "landslide",
    severity: "moderate",
    location: "Port Royal Mountains",
    parish: "Kingston",
    description: "Mountain slopes subject to liquefaction.",
    latitude: 17.9400,
    longitude: -76.8400,
    details: "Soil instability during earthquakes",
    riskLevel: "Moderate"
  },

  // 🌋 EARTHQUAKE (5 incidents)
  {
    id: "earthquake-1",
    type: "earthquake",
    severity: "extreme",
    location: "Kingston Metropolitan Area",
    parish: "Kingston",
    description: "Capital region on active fault systems. 1907 earthquake destroyed city.",
    latitude: 18.0179,
    longitude: -76.8099,
    details: "Enriquillo-Plantain Garden Fault Zone",
    riskLevel: "Extreme"
  },
  {
    id: "earthquake-2",
    type: "earthquake",
    severity: "very_high",
    location: "Southeastern Jamaica",
    parish: "St. Thomas",
    description: "Closest region to Enriquillo Fault. Highest seismic hazard.",
    latitude: 17.9500,
    longitude: -76.6000,
    details: "Major fault line proximity",
    riskLevel: "Very High"
  },
  {
    id: "earthquake-3",
    type: "earthquake",
    severity: "high",
    location: "Stony Hill / Blue Mountain Block",
    parish: "St. Andrew",
    description: "Elevated bedrock amplifies seismic frequencies.",
    latitude: 18.0667,
    longitude: -76.8000,
    details: "Seismic amplification, landslide risk",
    riskLevel: "High"
  },
  {
    id: "earthquake-4",
    type: "earthquake",
    severity: "very_high",
    location: "Port Royal / Palisadoes",
    parish: "Kingston",
    description: "Destroyed by 1692 earthquake and tsunami.",
    latitude: 17.9361,
    longitude: -76.8533,
    details: "Liquefaction zone, tsunami risk",
    riskLevel: "Very High"
  },
  {
    id: "earthquake-5",
    type: "earthquake",
    severity: "high",
    location: "Montego Bay Coastal Zone",
    parish: "St. James",
    description: "North coast fault systems present seismic hazard.",
    latitude: 18.4762,
    longitude: -77.8939,
    details: "Coastal seismic risk, tourism impact",
    riskLevel: "High"
  },

  // 🕳️ SINKHOLES (5 incidents)
  {
    id: "sinkhole-1",
    type: "sinkhole",
    severity: "high",
    location: "Cave Valley",
    parish: "St. Ann",
    description: "Classic karst topography with numerous sinkholes.",
    latitude: 18.3833,
    longitude: -77.4667,
    details: "Limestone dissolution, sudden ground collapse",
    riskLevel: "High"
  },
  {
    id: "sinkhole-2",
    type: "sinkhole",
    severity: "moderate",
    location: "Newmarket",
    parish: "St. Elizabeth",
    description: "Cockpit Country edge with active sinkhole formation.",
    latitude: 18.1167,
    longitude: -77.7833,
    details: "Karst valleys, dolines, farmland loss",
    riskLevel: "Moderate"
  },
  {
    id: "sinkhole-3",
    type: "sinkhole",
    severity: "moderate",
    location: "Vere Plains / May Pen",
    parish: "Clarendon",
    description: "Flat agricultural plains with bauxite deposits.",
    latitude: 17.9667,
    longitude: -77.2333,
    details: "Mining-induced subsidence, groundwater changes",
    riskLevel: "Moderate"
  },
  {
    id: "sinkhole-4",
    type: "sinkhole",
    severity: "high",
    location: "Albert Town / Cockpit Country",
    parish: "Trelawny",
    description: "Heart of Jamaica's cockpit country. Dramatic karst.",
    latitude: 18.2167,
    longitude: -77.6333,
    details: "Deep cockpits, tower karst, cave systems",
    riskLevel: "High"
  },
  {
    id: "sinkhole-5",
    type: "sinkhole",
    severity: "moderate",
    location: "Kellits / Spaldings",
    parish: "Clarendon",
    description: "Bauxite mining region with altered hydrology.",
    latitude: 17.9333,
    longitude: -77.3000,
    details: "Mining impact, water table changes",
    riskLevel: "Moderate"
  }
];
