export interface AgencyFAQ {
  question: string;
  answer: string;
}

export interface Agency {
  slug: string;
  abbr: string;
  name: string;
  fullName: string;
  icon: string;
  description: string;
  whatTheyDo: string;
  commonViolations: string[];
  penaltyRange: string;
  resolutionSteps: string[];
  datasetUrl: string;
  officialSiteUrl: string;
  faq: AgencyFAQ[];
}

export const AGENCIES: Agency[] = [
  {
    slug: 'dob',
    abbr: 'DOB',
    name: 'Department of Buildings',
    fullName: 'NYC Department of Buildings (DOB)',
    icon: '\u{1F3D7}\uFE0F',
    description:
      'The NYC Department of Buildings regulates construction, building safety, and zoning compliance across all five boroughs. DOB violations are the most common type issued to NYC property owners and can result in stop work orders, fines, and even criminal charges for serious safety issues.',
    whatTheyDo:
      'DOB enforces the NYC Building Code, Zoning Resolution, and other regulations related to construction and building safety. They issue permits, conduct inspections, and take enforcement action when buildings fail to meet code requirements. DOB inspectors can visit your property at any time, often triggered by 311 complaints, permit applications, or scheduled inspection cycles.',
    commonViolations: [
      'Work Without Permit (WP)',
      'Illegal Conversion / Illegal Occupancy',
      'Failure to Maintain Building',
      'Elevator Violations',
      'Facade Safety (Local Law 11)',
      'Stop Work Order',
      'Unsafe Building Condition',
      'Zoning Non-Compliance',
      'Construction Not Per Approved Plans',
      'Missing or Expired Certificates of Occupancy',
    ],
    penaltyRange: '$500 - $25,000 per violation',
    resolutionSteps: [
      'Review the violation notice and identify the specific code section cited',
      'Hire a licensed professional (architect, engineer, or expediter) if required',
      'Apply for any required permits through DOB NOW',
      'Complete the corrective work with licensed contractors',
      'Schedule a DOB re-inspection to certify the work',
      'Submit a Certificate of Correction to DOB within the deadline',
      'Pay any outstanding fines at the ECB or through the DOB website',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Housing-Development/DOB-Violations/3h2n-5cm9',
    officialSiteUrl: 'https://www.nyc.gov/buildings',
    faq: [
      {
        question: 'How do I check if my building has DOB violations?',
        answer:
          'You can search for DOB violations on the NYC Buildings Information System (BIS) at the DOB website, or use ViolationAlert to monitor your property automatically. We check the DOB database daily (free tier) or every 15 minutes (Pro) and alert you the moment a new violation is filed.',
      },
      {
        question: 'How long do I have to correct a DOB violation?',
        answer:
          'Most DOB violations must be corrected within 35 to 40 days of issuance. However, immediately hazardous violations require correction within 24 hours. Class 1 violations (immediately hazardous) carry the strictest deadlines and highest penalties if ignored.',
      },
      {
        question: 'What happens if I ignore a DOB violation?',
        answer:
          'Ignoring a DOB violation results in escalating fines, potential ECB hearings, liens on your property, and possible criminal charges for serious safety violations. Penalties can increase significantly with each day of non-compliance, and unresolved violations can block permit applications and property sales.',
      },
      {
        question: 'What is a DOB stop work order?',
        answer:
          'A stop work order (SWO) is issued when DOB finds active construction that is unsafe, unpermitted, or not following approved plans. All work must cease immediately. Continuing work under an SWO is a criminal offense and can result in fines of $10,000 or more per day, plus potential arrest of the contractor or owner.',
      },
      {
        question: 'Can DOB violations affect my property sale?',
        answer:
          'Yes. Open DOB violations appear in title searches and can delay or block property closings. Buyers and their attorneys typically require all open violations to be resolved before closing. Some lenders will refuse to finance properties with unresolved violations.',
      },
    ],
  },
  {
    slug: 'hpd',
    abbr: 'HPD',
    name: 'Housing Preservation & Development',
    fullName: 'NYC Housing Preservation & Development (HPD)',
    icon: '\u{1F3E0}',
    description:
      'HPD enforces the NYC Housing Maintenance Code, which governs the habitability and maintenance of residential buildings. HPD violations are triggered by tenant complaints and inspections and are among the most impactful for landlords -- they can lead to emergency repair programs, litigation, and rent reductions.',
    whatTheyDo:
      'HPD is responsible for ensuring safe, sanitary, and livable housing conditions in NYC. They respond to tenant complaints filed through 311, conduct inspections, and issue violations when landlords fail to maintain their properties. HPD can also initiate emergency repairs at the landlord\'s expense and pursue litigation against repeat offenders.',
    commonViolations: [
      'Lead-Based Paint (Local Law 1)',
      'Lack of Heat / Hot Water',
      'Pest Infestation (Roaches, Mice, Rats, Bedbugs)',
      'Mold and Moisture Conditions',
      'Peeling Paint in Units with Children Under 6',
      'Broken Windows or Doors',
      'Defective Plumbing / Leaks',
      'Non-Functioning Smoke / Carbon Monoxide Detectors',
      'Inadequate Fire Escapes',
      'Missing or Broken Door Locks',
    ],
    penaltyRange: '$50 - $1,000 per violation per day',
    resolutionSteps: [
      'Review the HPD violation notice and determine its class (A, B, or C)',
      'Contact the tenant to schedule access for inspection and repair',
      'Complete the repair work -- Class C violations require correction within 24 hours',
      'Certify the correction through HPD Online or by mail',
      'If the violation involved lead paint, hire an EPA-certified lead abatement firm',
      'Retain records of all repairs, certifications, and tenant communications',
      'Monitor for re-inspection -- HPD may return to verify the repair',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Housing-Development/Housing-Maintenance-Code-Violations/wvxf-dwi5',
    officialSiteUrl: 'https://www.nyc.gov/hpd',
    faq: [
      {
        question: 'What are the HPD violation classes (A, B, C)?',
        answer:
          'Class A violations are non-hazardous (e.g., minor peeling paint) and must be corrected within 90 days. Class B violations are hazardous (e.g., broken locks, roach infestation) and require correction within 30 days. Class C violations are immediately hazardous (e.g., no heat, lead paint, no hot water) and must be corrected within 24 hours.',
      },
      {
        question: 'How are HPD violations triggered?',
        answer:
          'Most HPD violations are triggered by tenant complaints filed through 311 or directly with HPD. When a complaint is filed, HPD schedules an inspection. If the inspector confirms the condition, a violation is issued. Landlords can also receive violations during proactive inspections of buildings with histories of poor maintenance.',
      },
      {
        question: 'What is the HPD Emergency Repair Program?',
        answer:
          'If a landlord fails to correct a Class C violation, HPD can hire contractors to make the repair and bill the landlord. The cost includes the repair plus administrative fees, and the total amount becomes a lien on the property. Emergency repair costs are typically 2-3x what a private contractor would charge.',
      },
      {
        question: 'Can HPD violations affect my rent stabilization status?',
        answer:
          'Yes. Open HPD violations can prevent landlords from obtaining rent increases through the Major Capital Improvement (MCI) program or Individual Apartment Improvement (IAI) program. Buildings with serious or widespread HPD violations may face additional scrutiny from DHCR.',
      },
      {
        question: 'How do I certify correction of an HPD violation?',
        answer:
          'You can certify correction through HPD Online (hpdonline.nyc.gov) or by mailing the certification form to HPD. Include the violation number, date of correction, and a description of the work performed. False certification is a misdemeanor and can result in additional penalties.',
      },
    ],
  },
  {
    slug: 'ecb',
    abbr: 'ECB',
    name: 'Environmental Control Board',
    fullName: 'NYC Environmental Control Board (ECB)',
    icon: '\u2696\uFE0F',
    description:
      'The Environmental Control Board is the adjudicatory body that hears and decides violations issued by multiple NYC agencies. ECB penalties represent the financial consequence of violations -- this is where fines are assessed, hearings are held, and judgments are entered. Unpaid ECB penalties become liens on your property.',
    whatTheyDo:
      'ECB (now part of OATH) serves as the tribunal that adjudicates violations issued by DOB, FDNY, DSNY, DEP, DOT, and other city agencies. When an agency issues a summons, the case is heard at ECB. Property owners can contest violations at ECB hearings, request adjournments, or negotiate settlements. ECB also handles default judgments when owners fail to appear.',
    commonViolations: [
      'DOB Construction Violations (penalties)',
      'FDNY Fire Code Violations (penalties)',
      'DSNY Sanitation Summons',
      'DEP Noise and Environmental Summons',
      'DOT Sidewalk and Street Violations',
      'Default Judgments (failure to appear)',
      'Late Payment Penalties',
      'Commercial Waste Violations',
      'Unlicensed Activity Violations',
      'Quality of Life Summons',
    ],
    penaltyRange: '$100 - $25,000+ per summons',
    resolutionSteps: [
      'Check your ECB hearing date on the OATH/ECB website',
      'Gather evidence: photos, permits, contracts, and correction certifications',
      'Attend the hearing in person or request a remote hearing',
      'Present your case -- bring proof of correction to reduce penalties',
      'If found liable, pay the penalty online, by mail, or in person',
      'If you received a default judgment, file a motion to vacate within one year',
      'Set up a payment plan if the penalty exceeds $1,000',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/City-Government/ECB-Violations/6bgk-3dad',
    officialSiteUrl: 'https://www.nyc.gov/oath',
    faq: [
      {
        question: 'What happens if I miss my ECB hearing?',
        answer:
          'If you miss your ECB hearing, a default judgment is entered against you for the maximum penalty amount. You can file a motion to vacate the default within one year, but you must show a reasonable excuse for missing the hearing and a meritorious defense to the violation.',
      },
      {
        question: 'How do I pay an ECB penalty?',
        answer:
          'ECB penalties can be paid online at nyc.gov/payecb, by mail, or in person at an OATH hearing center. You can also set up a payment plan for penalties over $1,000. Unpaid penalties accrue interest at 9% annually and can become liens on your property.',
      },
      {
        question: 'Can I contest an ECB violation?',
        answer:
          'Yes. You have the right to a hearing before an administrative law judge at OATH/ECB. You can present evidence, call witnesses, and argue your case. Having proof of correction often results in reduced penalties. Many property owners hire attorneys or expediters for ECB hearings.',
      },
      {
        question: 'What is an ECB lien?',
        answer:
          'When ECB penalties go unpaid, the city can file a lien against your property. ECB liens appear in title searches and must be satisfied before you can sell or refinance. The lien amount includes the original penalty plus interest and any administrative fees.',
      },
      {
        question: 'How does ECB differ from DOB?',
        answer:
          'DOB issues the violation (the summons). ECB adjudicates it (the hearing and penalty). Think of DOB as the police officer who writes the ticket, and ECB as the court that decides the fine. ECB handles violations from multiple agencies, not just DOB.',
      },
    ],
  },
  {
    slug: 'fdny',
    abbr: 'FDNY',
    name: 'Fire Department',
    fullName: 'NYC Fire Department (FDNY)',
    icon: '\u{1F525}',
    description:
      'The FDNY enforces the NYC Fire Code across all building types. FDNY violations relate to fire safety systems, egress, storage of hazardous materials, and fire prevention. These violations carry serious consequences because they directly impact life safety -- penalties are steep and compliance is strictly enforced.',
    whatTheyDo:
      'FDNY conducts inspections of commercial, residential, and industrial buildings to ensure compliance with the NYC Fire Code. They inspect fire suppression systems (sprinklers, standpipes), fire alarm systems, means of egress, hazardous material storage, and general fire prevention practices. FDNY inspections can be scheduled or unannounced.',
    commonViolations: [
      'Blocked or Obstructed Exits / Egress',
      'Missing or Expired Fire Extinguishers',
      'Non-Functional Sprinkler Systems',
      'Fire Alarm System Failures',
      'Improper Storage of Flammable Materials',
      'Missing Fire Safety Plans',
      'Overcrowding / Exceeding Occupancy Limits',
      'Expired Certificates of Fitness',
      'Self-Closing Door Failures',
      'Defective Emergency Lighting',
    ],
    penaltyRange: '$500 - $10,000 per violation',
    resolutionSteps: [
      'Review the FDNY violation notice and identify the Fire Code section cited',
      'Correct the condition immediately -- fire safety violations are time-sensitive',
      'Hire licensed fire protection contractors for system repairs',
      'Obtain required Certificates of Fitness from FDNY for personnel',
      'Schedule FDNY re-inspection or provide certification of correction',
      'Update your Fire Safety Plan and Emergency Action Plan if required',
      'Pay any ECB penalties associated with the FDNY violation',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Public-Safety/Fire-Inspections/ssq6-fkht',
    officialSiteUrl: 'https://www.nyc.gov/fdny',
    faq: [
      {
        question: 'How often does FDNY inspect buildings?',
        answer:
          'FDNY inspection frequency depends on the building type and occupancy. Commercial buildings, places of assembly, and high-rise residential buildings are inspected more frequently. Buildings with prior violations may be inspected more often. FDNY also responds to complaints and conducts inspections after fire incidents.',
      },
      {
        question: 'What is a Certificate of Fitness?',
        answer:
          'A Certificate of Fitness (COF) is an FDNY-issued credential required for individuals who operate or maintain fire safety systems, handle hazardous materials, or supervise certain activities. Common COFs include fire guard, fire safety director, and standpipe/sprinkler system operator. Operating without a required COF is a violation.',
      },
      {
        question: 'Can FDNY shut down my business?',
        answer:
          'Yes. FDNY can issue a vacate order if they determine a building poses an imminent fire safety hazard. This means all occupants must leave immediately and the building cannot be re-occupied until the conditions are corrected and FDNY clears the building. Vacate orders are typically issued for severe egress, sprinkler, or structural fire hazards.',
      },
      {
        question: 'What is a Fire Safety Plan?',
        answer:
          'A Fire Safety Plan (FSP) is required for certain building types and outlines procedures for fire prevention, evacuation, and emergency response. Buildings that require an FSP include high-rise offices, hotels, places of assembly, and certain residential buildings. The plan must be filed with FDNY and kept on-site.',
      },
      {
        question: 'Are FDNY violations different from DOB fire-related violations?',
        answer:
          'Yes. DOB handles fire-related building code requirements during construction (sprinkler installation, fire-rated construction, etc.). FDNY enforces the Fire Code for operational fire safety (maintaining systems, storing materials, egress). A building can have both DOB and FDNY violations for fire-related issues.',
      },
    ],
  },
  {
    slug: 'dsny',
    abbr: 'DSNY',
    name: 'Department of Sanitation',
    fullName: 'NYC Department of Sanitation (DSNY)',
    icon: '\u{1F5D1}\uFE0F',
    description:
      'DSNY enforces sanitation laws governing waste disposal, recycling, sidewalk cleanliness, and snow removal. DSNY violations are among the most common summonses issued to NYC property owners, often for seemingly minor infractions like incorrect recycling or dirty sidewalks that carry fines of $100 to $450 or more.',
    whatTheyDo:
      'DSNY sanitation enforcement agents patrol neighborhoods and issue summonses for violations of NYC sanitation laws. They enforce rules about garbage placement, recycling compliance, commercial waste handling, sidewalk cleanliness, and snow/ice removal. DSNY also handles bulk waste, electronics recycling, and organic waste programs.',
    commonViolations: [
      'Dirty Sidewalk / Failure to Clean',
      'Improper Recycling',
      'Garbage Out Before/After Collection Hours',
      'Failure to Remove Snow / Ice from Sidewalk',
      'Overflowing Trash Receptacles',
      'Commercial Waste Violations',
      'Illegal Dumping',
      'Failure to Post Recycling Signs',
      'Containerized Waste Violations',
      'Construction Debris on Sidewalk',
    ],
    penaltyRange: '$100 - $450 per violation (up to $18,000 for illegal dumping)',
    resolutionSteps: [
      'Review the DSNY summons and note the hearing date',
      'If the violation is valid, correct the condition immediately',
      'Take dated photos showing the condition has been corrected',
      'Attend the ECB hearing or submit evidence by mail',
      'If contesting, bring proof that the condition did not exist or was corrected',
      'Implement ongoing sanitation compliance (signage, schedules, staff training)',
      'Pay any assessed penalties through ECB',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/City-Government/DSNY-Sanitation-Summonses/5ery-qagt',
    officialSiteUrl: 'https://www.nyc.gov/dsny',
    faq: [
      {
        question: 'When can I put trash out for collection in NYC?',
        answer:
          'For residential buildings, trash must be placed out after 6:00 PM the evening before collection (or after 4:00 PM in bags). Trash must not be placed out more than 12 hours before collection. Commercial establishments have different schedules. Placing trash out too early or too late is one of the most common DSNY violations.',
      },
      {
        question: 'Am I responsible for my sidewalk cleanliness?',
        answer:
          'Yes. NYC law requires property owners and tenants to keep their sidewalk clean of litter, dirt, and debris. You must also remove snow and ice within 4 hours after snowfall ends (or by 11:00 AM if snow ends overnight). Failure to do so can result in a DSNY summons with fines of $100-$350.',
      },
      {
        question: 'How do I fight a DSNY summons?',
        answer:
          'DSNY summonses are adjudicated at ECB/OATH. You can request a hearing online or appear in person. Common defenses include proving the condition did not exist, showing you were in compliance, or demonstrating the wrong property was cited. Bring dated photos and any relevant records.',
      },
      {
        question: 'What are the recycling rules for NYC buildings?',
        answer:
          'NYC requires separation of metal, glass, and plastic containers; paper and cardboard; and organic waste (for buildings with 50+ units). All residential and commercial buildings must have recycling posted signage. Failure to recycle properly can result in fines of $100 for the first offense, increasing for repeat violations.',
      },
      {
        question: 'Can DSNY violations become liens?',
        answer:
          'Yes. Unpaid DSNY penalties adjudicated at ECB can become liens on your property. While individual DSNY fines are relatively small, they accumulate quickly -- a property with recurring sanitation violations can rack up thousands in penalties that become liens.',
      },
    ],
  },
  {
    slug: 'dot',
    abbr: 'DOT',
    name: 'Department of Transportation',
    fullName: 'NYC Department of Transportation (DOT)',
    icon: '\u{1F6A7}',
    description:
      'DOT regulates the use of city streets, sidewalks, and public rights-of-way. DOT violations typically involve sidewalk conditions, scaffolding, curb cuts, street openings, and construction-related street use. Property owners are legally responsible for the sidewalk adjacent to their property, making DOT violations a common issue.',
    whatTheyDo:
      'DOT manages NYC\'s transportation infrastructure including streets, sidewalks, bridges, and traffic signals. They issue permits for street work, sidewalk construction, and scaffolding. DOT inspectors enforce regulations on sidewalk condition, street openings, construction barriers, and curb modifications. They also manage the city\'s sidewalk repair program.',
    commonViolations: [
      'Defective Sidewalk / Trip Hazard',
      'Unauthorized Curb Cut',
      'Expired or Missing Street Opening Permit',
      'Scaffolding / Sidewalk Shed Violations',
      'Failure to Maintain Street Opening',
      'Illegal Parking Lot or Driveway',
      'Construction Fence / Barrier Violations',
      'Damaged Street Tree Guard',
      'Unauthorized Street Furniture',
      'ADA Accessibility Non-Compliance',
    ],
    penaltyRange: '$250 - $10,000 per violation',
    resolutionSteps: [
      'Review the DOT violation and identify the specific condition cited',
      'For sidewalk violations, hire a licensed contractor to make repairs',
      'Obtain required DOT permits before starting any work in the right-of-way',
      'Complete repairs according to DOT specifications and standards',
      'Request a DOT re-inspection upon completion',
      'Submit proof of correction with dated photos',
      'Pay any penalties assessed at ECB hearings',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Transportation/Sidewalk-Inspection-Violations/bemi-puc4',
    officialSiteUrl: 'https://www.nyc.gov/dot',
    faq: [
      {
        question: 'Am I responsible for the sidewalk in front of my building?',
        answer:
          'Yes. Under NYC Administrative Code Section 7-210, property owners are responsible for maintaining the sidewalk adjacent to their property in a safe condition. This includes repairing cracks, trip hazards, and uneven surfaces. If someone is injured on your sidewalk, you can be held liable for damages.',
      },
      {
        question: 'How much does sidewalk repair cost in NYC?',
        answer:
          'Private sidewalk repair in NYC typically costs $10-$25 per square foot, depending on the extent of damage and location. A typical single-family sidewalk repair runs $2,000-$8,000. The city also offers a subsidized repair program for homeowners through DOT, but wait times can be long.',
      },
      {
        question: 'What is a DOT sidewalk violation notice?',
        answer:
          'A DOT sidewalk violation notice informs the property owner that their sidewalk has been inspected and found to be defective. The notice specifies the condition (cracks, raised sections, etc.) and gives the owner a deadline to make repairs. If repairs are not made, the city can perform the work and charge the owner.',
      },
      {
        question: 'Do I need a permit for sidewalk work?',
        answer:
          'Yes. All sidewalk work in NYC requires a DOT permit. Work must be performed by a licensed contractor and must meet DOT specifications for materials, thickness, and grading. Working without a permit can result in additional violations and the requirement to redo the work.',
      },
      {
        question: 'What is a scaffolding/sidewalk shed violation?',
        answer:
          'If your building has a sidewalk shed (scaffolding), it must comply with DOT regulations for lighting, signage, structural integrity, and maintenance. Expired shed permits, missing lights, structural damage, and obstructing pedestrian access are common violations. Sheds left up beyond the permit period face increasing penalties.',
      },
    ],
  },
  {
    slug: 'lpc',
    abbr: 'LPC',
    name: 'Landmarks Preservation Commission',
    fullName: 'NYC Landmarks Preservation Commission (LPC)',
    icon: '\u{1F3DB}\uFE0F',
    description:
      'The Landmarks Preservation Commission regulates changes to designated landmark buildings and properties within historic districts. If your building is landmarked or in a historic district, virtually any exterior change requires LPC approval. Violations for unauthorized work can require costly restoration to the original condition.',
    whatTheyDo:
      'LPC designates and regulates individual landmarks and historic districts throughout NYC. They review and approve applications for any work that affects the exterior appearance of designated buildings, including facades, windows, doors, roofs, storefronts, and signage. LPC also enforces against unauthorized alterations to landmarked properties.',
    commonViolations: [
      'Unauthorized Facade Alteration',
      'Window Replacement Without LPC Approval',
      'Unauthorized Signage in Historic District',
      'Unapproved Storefront Modification',
      'Rooftop Addition Without Permit',
      'Unapproved Paint Color on Landmark Building',
      'Removal of Historic Architectural Details',
      'Installation of Non-Conforming HVAC Equipment',
      'Unauthorized Awning or Canopy',
      'Failure to Maintain Landmark Building',
    ],
    penaltyRange: '$500 - $5,000 per violation (plus restoration costs)',
    resolutionSteps: [
      'Stop any unauthorized work immediately',
      'Contact LPC to discuss the violation and potential remediation',
      'Hire an architect experienced with landmark properties',
      'File an application with LPC for the proposed correction or restoration',
      'Complete the approved restoration work with qualified craftspeople',
      'Obtain LPC sign-off on the completed work',
      'Attend any ECB hearings related to the violation',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Housing-Development/LPC-Violations/vf7a-jxw7',
    officialSiteUrl: 'https://www.nyc.gov/lpc',
    faq: [
      {
        question: 'How do I know if my building is landmarked?',
        answer:
          'You can check if your building is a designated landmark or within a historic district using the LPC\'s online map at landmarks.nyc.gov or by searching your address on the NYC ZOLA map. Your deed or property report may also indicate landmark status. Over 37,000 buildings in NYC have landmark protection.',
      },
      {
        question: 'What work requires LPC approval?',
        answer:
          'Any work that changes the exterior appearance of a landmarked building or a building in a historic district requires LPC review. This includes window replacement, facade repair, signage, storefronts, rooftop additions, and even paint color changes. Interior work generally does not require LPC approval unless the interior is specifically designated.',
      },
      {
        question: 'What happens if I do work without LPC approval?',
        answer:
          'Unauthorized work on a landmarked property results in a violation that typically requires you to restore the building to its prior condition at your own expense. Restoration of historic features can be extremely costly -- for example, replacing non-approved windows with historically appropriate ones can cost $2,000-$5,000 per window.',
      },
      {
        question: 'How long does LPC approval take?',
        answer:
          'Simple applications (like-for-like replacements, minor repairs) can be approved by LPC staff within 2-4 weeks. More complex applications require a public hearing before the full Commission, which can take 2-6 months. Expedited review is available for emergency repairs.',
      },
      {
        question: 'Can I appeal an LPC decision?',
        answer:
          'Yes. If LPC denies your application or issues a violation you disagree with, you can appeal through the Board of Standards and Appeals (BSA) or through Article 78 proceedings in court. For violations, you can contest the penalties at an ECB/OATH hearing.',
      },
    ],
  },
  {
    slug: 'dep',
    abbr: 'DEP',
    name: 'Department of Environmental Protection',
    fullName: 'NYC Department of Environmental Protection (DEP)',
    icon: '\u{1F4A7}',
    description:
      'DEP manages NYC\'s water supply, sewer system, and environmental quality. DEP violations involve water and sewer connections, backflow prevention, noise complaints, air quality, and stormwater management. These violations can be costly and often require specialized contractors to resolve.',
    whatTheyDo:
      'DEP operates and maintains the NYC water and sewer system, monitors environmental quality, and enforces regulations on noise, air quality, and hazardous materials. They inspect cross-connections and backflow prevention devices, respond to sewer backups, enforce noise code violations, and regulate construction-related environmental impacts.',
    commonViolations: [
      'Backflow Prevention Device Violations',
      'Illegal Sewer Connection',
      'Noise Code Violations (construction, commercial)',
      'Grease Trap Non-Compliance',
      'Water Meter Tampering',
      'Failure to Install Backflow Preventer',
      'Stormwater Discharge Violations',
      'Air Quality / Emissions Violations',
      'Illegal Water Connection',
      'Cross-Connection to Water Supply',
    ],
    penaltyRange: '$250 - $10,000 per violation',
    resolutionSteps: [
      'Review the DEP violation notice and identify the specific regulation cited',
      'Hire a licensed plumber or environmental contractor for water/sewer violations',
      'For noise violations, implement required sound mitigation measures',
      'Install or repair required backflow prevention devices',
      'Submit required testing reports and certifications to DEP',
      'Request DEP re-inspection upon completion of corrective work',
      'Pay any penalties through ECB or DEP directly',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Environment/DEP-Violations/e47i-jq2s',
    officialSiteUrl: 'https://www.nyc.gov/dep',
    faq: [
      {
        question: 'What is a backflow prevention device and do I need one?',
        answer:
          'A backflow preventer stops contaminated water from flowing back into the city water supply. NYC requires them on all commercial and many residential connections, including buildings with boilers, irrigation systems, or fire suppression systems. Annual testing by a licensed tester is required, and failure to comply results in DEP violations.',
      },
      {
        question: 'What is the NYC noise code?',
        answer:
          'The NYC Noise Code (Local Law 113) sets limits on noise from construction, commercial operations, and other sources. Construction is generally limited to 7 AM - 6 PM weekdays. After-hours work requires a DEP permit. Commercial noise (HVAC, generators, music) must not exceed ambient levels by specified amounts. Violations are enforced by DEP inspectors.',
      },
      {
        question: 'What is a grease trap violation?',
        answer:
          'All food service establishments in NYC must have a properly sized and maintained grease trap to prevent grease from entering the sewer system. DEP can issue violations for missing, undersized, or poorly maintained grease traps. Fines start at $250 and increase for repeat violations.',
      },
      {
        question: 'Can DEP violations affect my water service?',
        answer:
          'In extreme cases, DEP can restrict or shut off water service for serious violations like tampering with water meters, illegal connections, or cross-contamination of the water supply. More commonly, DEP violations result in fines and required corrective action.',
      },
      {
        question: 'How do I handle a sewer backup issue?',
        answer:
          'If you experience a sewer backup, call 311 to report it. DEP will investigate whether the backup is in the city sewer or your private drain. Property owners are responsible for their private sewer connection (house drain) up to the city main. If the backup is on your side, you need a licensed plumber to clear and repair it.',
      },
    ],
  },
  {
    slug: 'dohmh',
    abbr: 'DOHMH',
    name: 'Department of Health & Mental Hygiene',
    fullName: 'NYC Department of Health & Mental Hygiene (DOHMH)',
    icon: '\u{1F3E5}',
    description:
      'DOHMH enforces health codes related to lead paint, asbestos, mold, pest control, indoor air quality, and food safety in NYC buildings. DOHMH violations are particularly serious for residential landlords because they involve direct health hazards to tenants, especially children.',
    whatTheyDo:
      'DOHMH inspects and enforces health-related building conditions including lead paint hazards (especially in buildings with children under 6), asbestos-containing materials, indoor air quality, pest infestations, and cooling tower maintenance. They also regulate food establishments, swimming pools, and other public health facilities within buildings.',
    commonViolations: [
      'Lead Paint Hazard (Local Law 1)',
      'Failure to Conduct Lead Inspections (Local Law 31)',
      'Asbestos Violations (handling, removal, reporting)',
      'Cooling Tower Non-Compliance (Legionella)',
      'Pest Control Failures',
      'Mold and Moisture Conditions',
      'Indoor Air Quality Violations',
      'Food Establishment Health Code Violations',
      'Swimming Pool / Spa Violations',
      'Failure to Post Required Health Notices',
    ],
    penaltyRange: '$200 - $10,000 per violation',
    resolutionSteps: [
      'Review the DOHMH violation and identify the specific health code section',
      'For lead paint: hire an EPA-certified lead abatement firm immediately',
      'For asbestos: engage a licensed asbestos investigator and abatement contractor',
      'Complete all required testing (XRF for lead, air monitoring for asbestos)',
      'File required notifications with DOHMH before starting abatement work',
      'Submit clearance reports and certifications upon completion',
      'Maintain all records for at least 10 years as required by law',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/Health/DOHMH-Violations/jyq9-th5t',
    officialSiteUrl: 'https://www.nyc.gov/health',
    faq: [
      {
        question: 'What is Local Law 1 (lead paint)?',
        answer:
          'Local Law 1 (and its successor Local Law 31) requires landlords to identify and remediate lead paint hazards in buildings built before 1960 that have children under 6 years old. Landlords must conduct annual visual inspections and use certified lead abatement firms for any remediation. Violations carry heavy fines and potential criminal liability.',
      },
      {
        question: 'Do I need to test for asbestos before renovation?',
        answer:
          'Yes. Before any renovation or demolition in buildings built before 1981, you must have suspect materials tested for asbestos by a certified inspector. If asbestos is found, it must be removed by a licensed abatement contractor with proper containment and disposal. Failure to follow asbestos regulations can result in fines of $1,000-$10,000 per violation.',
      },
      {
        question: 'What are cooling tower regulations (Legionella)?',
        answer:
          'NYC Local Law 77 requires all cooling tower owners to register with DOHMH, develop maintenance programs, conduct regular testing for Legionella bacteria, and hire certified treatment providers. Violations can result in fines of $500-$2,000. These regulations were enacted after Legionnaires\' disease outbreaks linked to poorly maintained cooling towers.',
      },
      {
        question: 'What are my obligations for pest control?',
        answer:
          'NYC landlords are required to maintain pest-free conditions in their buildings. This includes regular extermination services, sealing entry points, and addressing conditions that attract pests (standing water, food waste, structural gaps). DOHMH can issue violations and require integrated pest management (IPM) plans for buildings with persistent infestations.',
      },
      {
        question: 'Can DOHMH violations result in criminal charges?',
        answer:
          'Yes. Serious DOHMH violations, particularly those involving lead paint hazards to children and improper asbestos handling, can result in criminal misdemeanor charges. Landlords who willfully ignore lead paint hazards that result in childhood lead poisoning can face criminal prosecution and substantial civil liability.',
      },
    ],
  },
  {
    slug: 'oath',
    abbr: 'OATH',
    name: 'Office of Administrative Trials & Hearings',
    fullName: 'NYC Office of Administrative Trials & Hearings (OATH)',
    icon: '\u{1F4CB}',
    description:
      'OATH is NYC\'s central administrative tribunal that adjudicates violations from dozens of city agencies. If you receive a summons from almost any NYC agency, your case will be heard at OATH. Understanding the OATH process is critical for property owners who want to contest violations or negotiate reduced penalties.',
    whatTheyDo:
      'OATH (which includes the former ECB) conducts hearings for violations issued by DOB, HPD, FDNY, DSNY, DEP, DOT, and many other NYC agencies. Administrative law judges hear cases, consider evidence, and issue decisions. OATH also handles default judgments, payment plans, and motions to vacate. Their decisions carry the force of law and unpaid penalties become property liens.',
    commonViolations: [
      'Default Judgments (all agencies)',
      'DOB Construction Summons Adjudication',
      'FDNY Fire Code Hearings',
      'DSNY Sanitation Summons',
      'DEP Environmental Hearings',
      'DOT Street/Sidewalk Violations',
      'Quality of Life Violations',
      'Unlicensed Business Operations',
      'Health Code Violations',
      'Building Maintenance Code Hearings',
    ],
    penaltyRange: '$0 (dismissed) - $25,000+ per summons',
    resolutionSteps: [
      'Check your hearing date and location on the OATH website',
      'Gather all evidence: photos, permits, contracts, correction certifications',
      'Consider hiring an attorney or expediter for complex cases',
      'Attend the hearing -- bring copies of all documents for the judge',
      'If the violation is valid, bring proof of correction to request reduced penalties',
      'If you received a default judgment, file a motion to vacate promptly',
      'Pay any penalties or set up a payment plan through OATH',
    ],
    datasetUrl: 'https://data.cityofnewyork.us/City-Government/OATH-Hearings-Division-Case-Status/jz4z-kudi',
    officialSiteUrl: 'https://www.nyc.gov/oath',
    faq: [
      {
        question: 'What is the difference between OATH and ECB?',
        answer:
          'OATH absorbed the Environmental Control Board (ECB) in 2017. They are now the same agency. Cases formerly heard at ECB are now heard at the OATH Hearings Division. The process is the same -- administrative law judges hear violation cases and issue decisions. Many people still use the term ECB interchangeably with OATH.',
      },
      {
        question: 'Can I request a remote OATH hearing?',
        answer:
          'Yes. OATH offers remote hearings by video (Microsoft Teams) for most violation types. You can request a remote hearing when scheduling your appearance. In-person hearings are held at OATH hearing centers in each borough. Remote hearings have become standard practice since 2020.',
      },
      {
        question: 'What is a motion to vacate a default judgment?',
        answer:
          'If you missed your hearing and received a default judgment (maximum penalty), you can file a motion to vacate within one year. You must show a reasonable excuse for missing the hearing (mailing issues, emergency, etc.) and a valid defense to the violation. If granted, a new hearing is scheduled.',
      },
      {
        question: 'How do I set up a payment plan for OATH penalties?',
        answer:
          'OATH offers payment plans for penalties over $1,000. You can apply online at nyc.gov/payecb or in person at an OATH hearing center. Payment plans typically require a down payment of 10-25% and monthly installments. Interest continues to accrue at 9% on unpaid balances.',
      },
      {
        question: 'Should I hire a lawyer for an OATH hearing?',
        answer:
          'For violations with penalties under $1,000, most property owners represent themselves. For higher-stakes cases, hiring an attorney or professional expediter is recommended. They understand OATH procedures, can negotiate with city attorneys before the hearing, and know which evidence is most effective in reducing penalties.',
      },
    ],
  },
];

export function getAgencyBySlug(slug: string): Agency | undefined {
  return AGENCIES.find((a) => a.slug === slug);
}

export function getOtherAgencies(currentSlug: string): Agency[] {
  return AGENCIES.filter((a) => a.slug !== currentSlug);
}
