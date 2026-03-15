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
    description: "Historic base of the Shower Posse. Highest concentration of gang activity on the island.",
    latitude: 17.9712,
    longitude: -76.8347,
    details: "Frequent states of emergency, lockdowns, and security operations",
    riskLevel: "Extreme"
  },
  {
    id: "crime-2",
    type: "crime",
    severity: "extreme",
    location: "Spanish Town (Central)",
    parish: "St. Catherine",
    description: "Jamaica's most dangerous city. Crime index 80.56/100. Dominated by One Order and Clans Massive gangs.",
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
    description: "Alarmingly close to tourist resorts in Montego Bay. Regular gang shootings and street robberies.",
    latitude: 18.4762,
    longitude: -77.9200,
    details: "High violent crime rate near tourist areas",
    riskLevel: "Very High"
  },
  {
    id: "crime-4",
    type: "crime",
    severity: "extreme",
    location: "Russia Community",
    parish: "Westmoreland",
    description: "U.S. State Dept Do Not Travel designation. Gang-driven violence and turf wars.",
    latitude: 18.0150,
    longitude: -78.1300,
    details: "Extreme risk area, avoid all travel",
    riskLevel: "Extreme"
  },
  {
    id: "crime-5",
    type: "crime",
    severity: "very_high",
    location: "Mountain View Avenue",
    parish: "Kingston East",
    description: "Controlled by the South Clan gang. Most dangerous corridor in East Kingston.",
    latitude: 18.0150,
    longitude: -76.7800,
    details: "Frequent gun battles, U.S. Embassy restricts access",
    riskLevel: "Very High"
  },

  // 🚗 ROAD ACCIDENTS (5 incidents)
  {
    id: "accident-1",
    type: "accident",
    severity: "extreme",
    location: "Rose Hall Main Road",
    parish: "St. James",
    description: "Jamaica's single deadliest road. 34 fatalities in 5 years. Located in heart of tourist belt.",
    latitude: 18.4950,
    longitude: -77.8900,
    details: "Dangerous high-speed driving, poor road conditions",
    riskLevel: "Extreme"
  },
  {
    id: "accident-2",
    type: "accident",
    severity: "very_high",
    location: "Llandovery / Laughlands",
    parish: "St. Ann",
    description: "Treacherous winding roads with multiple fatal curves. Poor lighting and guardrails.",
    latitude: 18.4200,
    longitude: -77.4500,
    details: "Sharp curves, frequent landslides, limited visibility",
    riskLevel: "Very High"
  },
  {
    id: "accident-3",
    type: "accident",
    severity: "very_high",
    location: "Bay Main Road (Little London)",
    parish: "Westmoreland",
    description: "17 road deaths in 5 years. Many motorcyclists killed. Deadliest roads in western Jamaica.",
    latitude: 18.0800,
    longitude: -78.1100,
    details: "Poor road maintenance, speeding, dangerous intersections",
    riskLevel: "Very High"
  },
  {
    id: "accident-4",
    type: "accident",
    severity: "high",
    location: "Washington Boulevard",
    parish: "St. Andrew",
    description: "High-traffic arterial road with frequent collisions. Pedestrian safety concerns.",
    latitude: 18.0250,
    longitude: -76.7900,
    details: "Heavy traffic, jaywalking, intersection accidents",
    riskLevel: "High"
  },
  {
    id: "accident-5",
    type: "accident",
    severity: "high",
    location: "Melrose Hill Bypass",
    parish: "Clarendon",
    description: "High-speed highway section with increasing fatality rate. Limited safety infrastructure.",
    latitude: 17.9100,
    longitude: -77.1200,
    details: "Speeding, overtaking accidents, poor signage",
    riskLevel: "High"
  },

  // 🌊 FLOODING (5 incidents)
  {
    id: "flood-1",
    type: "flood",
    severity: "very_high",
    location: "Montego Bay Town Centre",
    parish: "St. James",
    description: "Urban flooding during heavy rains. Poor drainage system overwhelmed regularly.",
    latitude: 18.4762,
    longitude: -77.8939,
    details: "Flash floods, property damage, traffic disruption",
    riskLevel: "Very High"
  },
  {
    id: "flood-2",
    type: "flood",
    severity: "high",
    location: "Old Harbour",
    parish: "St. Catherine",
    description: "Coastal flooding and storm surge impact. Low-lying agricultural area.",
    latitude: 17.9400,
    longitude: -76.9300,
    details: "Seasonal flooding, crop damage, evacuation risk",
    riskLevel: "High"
  },
  {
    id: "flood-3",
    type: "flood",
    severity: "very_high",
    location: "Yallahs River Valley",
    parish: "St. Thomas",
    description: "River overflow during tropical systems. Historical flood zone with recurring evacuations.",
    latitude: 17.9167,
    longitude: -76.6500,
    details: "River flooding, bridge damage, isolation of communities",
    riskLevel: "Very High"
  },
  {
    id: "flood-4",
    type: "flood",
    severity: "high",
    location: "Cave Valley",
    parish: "St. Ann",
    description: "Karst topography causes sudden water accumulation. Sinkhole-related flooding.",
    latitude: 18.3833,
    longitude: -77.4667,
    details: "Underground drainage, sudden flooding, road washouts",
    riskLevel: "High"
  },
  {
    id: "flood-5",
    type: "flood",
    severity: "moderate",
    location: "Annotto Bay",
    parish: "St. Mary",
    description: "Coastal town susceptible to storm surge and river flooding from Plantain Garden River.",
    latitude: 18.1833,
    longitude: -76.8667,
    details: "Dual flood risk from sea and river, evacuation zone",
    riskLevel: "Moderate"
  },

  // 🌀 HURRICANE / STORM SURGE (5 incidents)
  {
    id: "hurricane-1",
    type: "hazard",
    severity: "extreme",
    location: "Savanna-la-Mar",
    parish: "Westmoreland",
    description: "Low-lying coastal capital highly vulnerable to hurricane storm surge. Category 4+ hurricane impact zone.",
    latitude: 18.0189,
    longitude: -78.1339,
    details: "Storm surge flooding, wind damage, mandatory evacuation zone",
    riskLevel: "Extreme"
  },
  {
    id: "hurricane-2",
    type: "hazard",
    severity: "very_high",
    location: "Port Royal",
    parish: "Kingston",
    description: "Historic port on sand spit. Extremely vulnerable to storm surge and sea level rise.",
    latitude: 17.9361,
    longitude: -76.8533,
    details: "Coastal erosion, storm surge, historical hurricane damage",
    riskLevel: "Very High"
  },
  {
    id: "hurricane-3",
    type: "hazard",
    severity: "high",
    location: "Annotto Bay",
    parish: "St. Mary",
    description: "North coast exposure to Atlantic hurricanes. Storm surge impacts low-lying areas.",
    latitude: 18.1833,
    longitude: -76.8667,
    details: "Hurricane wind exposure, coastal flooding",
    riskLevel: "High"
  },
  {
    id: "hurricane-4",
    type: "hazard",
    severity: "high",
    location: "Montego Bay Waterfront",
    parish: "St. James",
    description: "Tourist district vulnerable to storm surge. Hurricane preparedness critical.",
    latitude: 18.4762,
    longitude: -77.8939,
    details: "Coastal infrastructure at risk, evacuation planning needed",
    riskLevel: "High"
  },
  {
    id: "hurricane-5",
    type: "hazard",
    severity: "moderate",
    location: "Black River",
    parish: "St. Elizabeth",
    description: "Mouth of longest river in Jamaica. Storm surge can travel miles inland.",
    latitude: 18.0267,
    longitude: -77.8533,
    details: "River-surge interaction, wetland flooding",
    riskLevel: "Moderate"
  },

  // 🔥 FIRE (5 incidents)
  {
    id: "fire-1",
    type: "hazard",
    severity: "high",
    location: "Spanish Town (Structural Fires)",
    parish: "St. Catherine",
    description: "Dense urban area with frequent structural fires. Limited fire station coverage.",
    latitude: 17.9914,
    longitude: -76.9564,
    details: "Building fires, electrical hazards, response time challenges",
    riskLevel: "High"
  },
  {
    id: "fire-2",
    type: "hazard",
    severity: "moderate",
    location: "St. Catherine Interior (Bush Fires)",
    parish: "St. Catherine",
    description: "Dry season bush fires threaten agricultural areas and settlements.",
    latitude: 17.9500,
    longitude: -76.9000,
    details: "Vegetation fires, smoke hazard, property threat",
    riskLevel: "Moderate"
  },
  {
    id: "fire-3",
    type: "hazard",
    severity: "moderate",
    location: "St. Elizabeth Interior (Bush Fires)",
    parish: "St. Elizabeth",
    description: "Large parish with extensive dry interior prone to seasonal bush fires.",
    latitude: 18.0500,
    longitude: -77.7500,
    details: "Grassland fires, agricultural damage, air quality impact",
    riskLevel: "Moderate"
  },
  {
    id: "fire-4",
    type: "hazard",
    severity: "moderate",
    location: "Clarendon Interior (Bush Fires)",
    parish: "Clarendon",
    description: "Agricultural heartland experiences frequent crop and vegetation fires.",
    latitude: 17.9000,
    longitude: -77.1500,
    details: "Sugar cane fires, agricultural burning, smoke hazards",
    riskLevel: "Moderate"
  },
  {
    id: "fire-5",
    type: "hazard",
    severity: "high",
    location: "Riverton City Dump",
    parish: "Kingston",
    description: "Landfill fires produce toxic smoke. Recurring fire hazard threatening nearby communities.",
    latitude: 17.9600,
    longitude: -76.8500,
    details: "Toxic fumes, respiratory health risk, difficult to extinguish",
    riskLevel: "High"
  },

  // 🏔️ LANDSLIDE (5 incidents)
  {
    id: "landslide-1",
    type: "hazard",
    severity: "very_high",
    location: "Blue Mountains Upper Slopes",
    parish: "St. Andrew / Portland",
    description: "Steep mountain slopes prone to landslides during heavy rainfall. Coffee farming areas affected.",
    latitude: 18.0833,
    longitude: -76.7500,
    details: "Road blockages, slope instability, evacuation risk",
    riskLevel: "Very High"
  },
  {
    id: "landslide-2",
    type: "hazard",
    severity: "high",
    location: "Stony Hill / Jack's Hill",
    parish: "St. Andrew",
    description: "Hillside communities on unstable slopes. Landslide risk during tropical weather.",
    latitude: 18.0667,
    longitude: -76.8000,
    details: "Residential area at risk, road cuts increase instability",
    riskLevel: "High"
  },
  {
    id: "landslide-3",
    type: "hazard",
    severity: "high",
    location: "Rio Minho Valley",
    parish: "Clarendon / Manchester",
    description: "River valley with steep sides prone to slope failure. Longest river in Jamaica.",
    latitude: 18.0167,
    longitude: -77.4333,
    details: "Valley flooding, slope saturation, road damage",
    riskLevel: "High"
  },
  {
    id: "landslide-4",
    type: "hazard",
    severity: "moderate",
    location: "Content Gap / Newcastle Road",
    parish: "St. Andrew",
    description: "Mountain road with history of landslides blocking traffic. Critical transportation route.",
    latitude: 18.0833,
    longitude: -76.7333,
    details: "Road closures, isolated communities, repair delays",
    riskLevel: "Moderate"
  },
  {
    id: "landslide-5",
    type: "hazard",
    severity: "moderate",
    location: "Port Royal",
    parish: "Kingston",
    description: "Sand spit subject to liquefaction during earthquakes and soil saturation.",
    latitude: 17.9361,
    longitude: -76.8533,
    details: "Soil instability, historical earthquake damage",
    riskLevel: "Moderate"
  },

  // 🌋 EARTHQUAKE (5 incidents)
  {
    id: "earthquake-1",
    type: "hazard",
    severity: "extreme",
    location: "Kingston Metropolitan Area",
    parish: "Kingston / St. Andrew",
    description: "Capital region sits on active fault systems. 1907 earthquake destroyed much of city. High population density increases risk.",
    latitude: 18.0179,
    longitude: -76.8099,
    details: "Enriquillo-Plantain Garden Fault Zone, building code enforcement critical",
    riskLevel: "Extreme"
  },
  {
    id: "earthquake-2",
    type: "hazard",
    severity: "very_high",
    location: "Southeastern Jamaica",
    parish: "St. Thomas",
    description: "Closest region to Enriquillo Fault. Highest seismic hazard in Jamaica.",
    latitude: 17.9500,
    longitude: -76.6000,
    details: "Major fault line proximity, ground shaking intensity",
    riskLevel: "Very High"
  },
  {
    id: "earthquake-3",
    type: "hazard",
    severity: "high",
    location: "Stony Hill / Blue Mountain Block",
    parish: "St. Andrew",
    description: "Elevated bedrock areas amplify certain seismic frequencies. Landslide trigger risk.",
    latitude: 18.0667,
    longitude: -76.8000,
    details: "Seismic amplification, secondary landslide hazard",
    riskLevel: "High"
  },
  {
    id: "earthquake-4",
    type: "hazard",
    severity: "very_high",
    location: "Port Royal / Palisadoes",
    parish: "Kingston",
    description: "Destroyed by 1692 earthquake and tsunami. Built on unconsolidated sediments prone to liquefaction.",
    latitude: 17.9361,
    longitude: -76.8533,
    details: "Liquefaction zone, tsunami risk, historical destruction",
    riskLevel: "Very High"
  },
  {
    id: "earthquake-5",
    type: "hazard",
    severity: "high",
    location: "Montego Bay Coastal Zone",
    parish: "St. James",
    description: "North coast fault systems present seismic hazard. Tourist infrastructure concentration.",
    latitude: 18.4762,
    longitude: -77.8939,
    details: "Coastal seismic risk, tourism impact, building vulnerability",
    riskLevel: "High"
  },

  // 🕳️ SINKHOLES (5 incidents)
  {
    id: "sinkhole-1",
    type: "hazard",
    severity: "high",
    location: "Cave Valley",
    parish: "St. Ann",
    description: "Classic karst topography with numerous sinkholes. Underground cave systems collapse.",
    latitude: 18.3833,
    longitude: -77.4667,
    details: "Limestone dissolution, sudden ground collapse, road damage",
    riskLevel: "High"
  },
  {
    id: "sinkhole-2",
    type: "hazard",
    severity: "moderate",
    location: "Newmarket / Limestone Valleys",
    parish: "St. Elizabeth",
    description: "Cockpit Country edge with active sinkhole formation. Agricultural land affected.",
    latitude: 18.1167,
    longitude: -77.7833,
    details: "Karst valleys, dolines, farmland loss",
    riskLevel: "Moderate"
  },
  {
    id: "sinkhole-3",
    type: "hazard",
    severity: "moderate",
    location: "Vere Plains / May Pen",
    parish: "Clarendon",
    description: "Flat agricultural plains with bauxite deposits. Sinkholes from mining and natural causes.",
    latitude: 17.9667,
    longitude: -77.2333,
    details: "Mining-induced subsidence, groundwater changes",
    riskLevel: "Moderate"
  },
  {
    id: "sinkhole-4",
    type: "hazard",
    severity: "high",
    location: "Albert Town / Cockpit Country",
    parish: "Trelawny",
    description: "Heart of Jamaica's cockpit country. Most dramatic karst topography with deep sinkholes.",
    latitude: 18.2167,
    longitude: -77.6333,
    details: "Deep cockpits, tower karst, pristine cave systems",
    riskLevel: "High"
  },
  {
    id: "sinkhole-5",
    type: "hazard",
    severity: "moderate",
    location: "Kellits / Spaldings",
    parish: "Clarendon",
    description: "Bauxite mining region with altered hydrology. Increased sinkhole activity reported.",
    latitude: 17.9333,
    longitude: -77.3000,
    details: "Mining impact, water table changes, ground instability",
    riskLevel: "Moderate"
  }
];
