// Module 5 · Task 2 — NIO Product Knowledge Quiz
// Add more questions here; the quiz automatically picks them up.

export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When pitching NIO panels, why is anchoring the comparison to WPC (Wood-Plastic Composite) considered the 'Right Pitch'?",
    options: [
      { id: 'A', text: 'It positions NIO as a premium luxury solution at a ~55% savings.' },
      { id: 'B', text: 'It suggests that NIO panels are made of the exact same materials as WPC.' },
      { id: 'C', text: 'It allows the RM to avoid mentioning the price of PVC panels entirely.' },
      { id: 'D', text: 'It makes NIO at Rs.123 PSF feel like an expensive upgrade.' },
    ],
    correctId: 'A',
    explanation: 'By anchoring to the higher WPC price (Rs.250–300 PSF), the NIO price of Rs.123 PSF is perceived as a significant value win — premium quality at nearly half the price.',
  },
  {
    id: 2,
    question: "What is the specific engineering design of the NIO panel's cross-section that provides its superior structural build?",
    options: [
      { id: 'A', text: 'A spherical honeycomb pattern.' },
      { id: 'B', text: 'A basic round hollow mould.' },
      { id: 'C', text: 'A solid rectangular core with no cavities.' },
      { id: 'D', text: "A hexagonal mould created by an 'X' structure." },
    ],
    correctId: 'D',
    explanation: "Combining integral shapes results in a hexagonal cross-section formed by an 'X' internal structure — this enhances durability far beyond a basic hollow PVC panel.",
  },
  {
    id: 3,
    question: 'According to the RM Sales Tips, which physical attribute should you lead with to signal high quality to a customer?',
    options: [
      { id: 'A', text: 'The length of the panels.' },
      { id: 'B', text: 'The number of color options available.' },
      { id: 'C', text: 'The weight and the finish.' },
      { id: 'D', text: 'The ease of cleaning the surface.' },
    ],
    correctId: 'C',
    explanation: 'In luxury materials, the human brain typically associates heavier weight with higher quality. Leading with weight and finish creates an immediate premium perception before any specs are mentioned.',
  },
  {
    id: 4,
    question: 'If a customer is anchored to PVC panels at Rs.84 PSF, how does the transition to NIO at Rs.123 PSF usually feel to them?',
    options: [
      { id: 'A', text: 'Like a negligible price difference.' },
      { id: 'B', text: 'Like a ~46% price jump, creating budget friction.' },
      { id: 'C', text: 'Like a smart investment in modern textures.' },
      { id: 'D', text: 'Like they are saving 55% on their renovation.' },
    ],
    correctId: 'B',
    explanation: "Pitching 'upward' from the economy PVC rate makes Rs.123 PSF look like a significant hike for what seems like a 'similar' product — this is why anchoring to WPC instead is the right strategy.",
  },
  {
    id: 5,
    question: 'Which of the following is a technical application advantage of NIO panels over traditional PVC panels?',
    options: [
      { id: 'A', text: 'They do not require any specialized tools for cutting.' },
      { id: 'B', text: 'Installation is limited to nailing to avoid warping.' },
      { id: 'C', text: 'They can be installed using only standard adhesive.' },
      { id: 'D', text: 'Precision installation using Nails, Metal clips, and silicon glue.' },
    ],
    correctId: 'D',
    explanation: 'The use of metal clips and silicon glue alongside nails ensures a more durable, precise, and long-lasting finish compared to basic PVC installation methods.',
  },
  {
    id: 6,
    question: 'How should an RM respond if a customer hesitates at the price of NIO panels?',
    options: [
      { id: 'A', text: 'Offer a discount to match the price of PVC panels.' },
      { id: 'B', text: "Focus only on the 'Urban Company Exclusive' status." },
      { id: 'C', text: 'Explain that NIO is the same as PVC but with better colors.' },
      { id: 'D', text: 'Compare it with WPC to anchor the comparison upward.' },
    ],
    correctId: 'D',
    explanation: "By showing the Rs.250–300 PSF cost of WPC, NIO at Rs.123 PSF becomes a 'breakthrough' value win — premium quality at a significantly smarter price.",
  },
  {
    id: 7,
    question: 'Which design aesthetic is specifically associated with NIO panels but NOT with standard PVC?',
    options: [
      { id: 'A', text: 'Standard smooth textures.' },
      { id: 'B', text: 'High-end fabric overlays and premium fluting.' },
      { id: 'C', text: 'Hand-painted floral patterns.' },
      { id: 'D', text: 'Traditional wood grains.' },
    ],
    correctId: 'B',
    explanation: 'NIO is distinguished by world-class modern textures like fabric overlays and premium fluting that standard PVC panels simply cannot replicate.',
  },
  {
    id: 8,
    question: "What is a major structural risk of 'Old PVC Panels' identified in the playbook?",
    options: [
      { id: 'A', text: 'Prone to easy breakage and damage due to inferior quality.' },
      { id: 'B', text: 'They are too rigid to be nailed into place.' },
      { id: 'C', text: 'They reflect too much thermal energy.' },
      { id: 'D', text: 'They are too heavy for standard walls.' },
    ],
    correctId: 'A',
    explanation: "The basic round hollow mould of PVC makes it structurally inferior — it's susceptible to dents, breakage, and surface damage in ways the NIO hexagonal structure is not.",
  },
  {
    id: 9,
    question: "NIO panels are described as an 'Urban Company Exclusive.' What does this mean for the RM's pitch?",
    options: [
      { id: 'A', text: 'Urban Company manufactures the panels in their own local factories.' },
      { id: 'B', text: 'The customer can find similar panels at local retail markets for cheaper.' },
      { id: 'C', text: 'The panels are only available for commercial office projects.' },
      { id: 'D', text: 'The product is a first-in-India offering only sold by Urban Company.' },
    ],
    correctId: 'D',
    explanation: "Being a first-in-India exclusive creates a sense of scarcity and unique value — the customer cannot cross-shop this product anywhere else, removing price negotiation as a tool.",
  },
  {
    id: 10,
    question: "When presenting the 'Ultimate Value Pitch,' what is the calculated savings of NIO versus Premium WPC?",
    options: [
      { id: 'A', text: '~55% savings.' },
      { id: 'B', text: '~25% savings.' },
      { id: 'C', text: '~46% savings.' },
      { id: 'D', text: '~10% savings.' },
    ],
    correctId: 'A',
    explanation: 'Comparing NIO (Rs.123 PSF) to WPC (Rs.250+ PSF) results in approximately 55% savings — this is the headline number that makes the value pitch undeniable.',
  },
  {
    id: 11,
    question: "Which key messaging pillar emphasizes that NIO panels are 'built for long-term performance'?",
    options: [
      { id: 'A', text: 'Designer finish.' },
      { id: 'B', text: 'Strong & durable.' },
      { id: 'C', text: 'Premium look.' },
      { id: 'D', text: 'Lower price than WPC.' },
    ],
    correctId: 'B',
    explanation: "'Strong & Durable' specifically addresses long-term performance and minimal wear — it's the pillar that answers customers who say 'will this last?' or 'main 4–5 saal mein badal dunga.'",
  },
  {
    id: 12,
    question: "What is the primary psychological 'Price Trap' an RM falls into when pitching NIO?",
    options: [
      { id: 'A', text: 'Focusing too much on fabric overlays.' },
      { id: 'B', text: 'Pitching NIO as a replacement for old PVC panels.' },
      { id: 'C', text: 'Mentioning the metal clips too early.' },
      { id: 'D', text: 'Over-explaining the hexagonal mould design.' },
    ],
    correctId: 'B',
    explanation: 'Positioning NIO against PVC anchors the customer to the Rs.80–84 PSF economy rate — making NIO seem expensive by comparison. The right anchor is always WPC at Rs.250–300 PSF.',
  },
  {
    id: 13,
    question: "Technical specifications for NIO include 'Premium thermal & scratch resistance.' How does this differ from PVC?",
    options: [
      { id: 'A', text: "PVC panels have basic round moulds that are not optimized for resistance." },
      { id: 'B', text: 'PVC has better scratch resistance but lower thermal resistance.' },
      { id: 'C', text: 'Thermal resistance is only applicable to WPC, not NIO.' },
      { id: 'D', text: 'Both panels offer identical resistance levels.' },
    ],
    correctId: 'A',
    explanation: "The playbook contrasts NIO's premium resistance directly with PVC's 'inferior quality' and 'basic' round mould build — the structural difference is the root of the performance difference.",
  },
  {
    id: 14,
    question: 'Which step should an RM take FIRST when understanding a customer\'s needs for wall panelling?',
    options: [
      { id: 'A', text: 'Explain the difference between nails and metal clips.' },
      { id: 'B', text: "Identify if they want an 'economy' or 'premium' look." },
      { id: 'C', text: 'Immediately show the price list for all panels.' },
      { id: 'D', text: 'Start by pitching standard PVC to see if they are budget-conscious.' },
    ],
    correctId: 'B',
    explanation: "Understanding the desired aesthetic level first allows the RM to choose the right anchoring strategy. A customer who wants a 'premium look' is the correct target for the WPC-to-NIO value pitch.",
  },
  {
    id: 15,
    question: "What is the key takeaway regarding the 'NIO VS PVC' structural comparison?",
    options: [
      { id: 'A', text: 'PVC is lighter and therefore easier to install.' },
      { id: 'B', text: 'PVC is preferred for its nailed application.' },
      { id: 'C', text: 'There is no significant difference in the cross-section between the two.' },
      { id: 'D', text: 'NIO outperforms PVC in finish and approaches WPC — at a smart value price.' },
    ],
    correctId: 'D',
    explanation: 'This is the core NIO positioning: better than PVC in every structural and finish metric, comparable to WPC in premium look — but at roughly half the cost of WPC.',
  },
];
