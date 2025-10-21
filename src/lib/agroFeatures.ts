// Agro-specific features and utilities

export interface SeedCertification {
  certificationNumber: string;
  certifyingAgency: 'ISI' | 'State Seed Certification' | 'ISTA' | 'Other';
  certificationDate: string;
  expiryDate: string;
  germinationRate: number; // percentage
  purityPercentage: number; // percentage
  moistureContent?: number; // percentage
  seedClass: 'Breeder' | 'Foundation' | 'Certified' | 'Truthfully Labelled';
}

export interface BatchInfo {
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  parentBatch?: string;
  lotSize: number;
  warehouseLocation: string;
  qrCode?: string;
  qualityTestStatus: 'pending' | 'passed' | 'failed';
  treatmentDetails?: string;
}

export interface SeasonalInfo {
  season: 'kharif' | 'rabi' | 'zaid' | 'all';
  plantingMonths: number[]; // 1-12
  harvestMonths: number[]; // 1-12
  idealTemperature: { min: number; max: number };
  waterRequirement: 'low' | 'medium' | 'high';
  growthDuration: number; // days
}

export interface FarmDetails {
  farmSize: number; // acres
  farmLocation: string;
  gpsCoordinates?: { lat: number; lng: number };
  cropsGrown: string[];
  soilType: 'sandy' | 'loamy' | 'clay' | 'black' | 'red' | 'alluvial';
  irrigationMethod: 'rainfed' | 'drip' | 'sprinkler' | 'flood' | 'mixed';
  khasraNumber?: string; // Land record number
}

export interface MSPInfo {
  crop: string;
  season: string;
  year: number;
  mspPrice: number;
  bonusPrice?: number;
  effectiveFrom: string;
  effectiveTo: string;
}

export interface SubsidyScheme {
  schemeName: string;
  schemeCode: string;
  eligibilityCriteria: string;
  subsidyPercentage: number;
  maxSubsidyAmount: number;
  validFrom: string;
  validTo: string;
  applicableProducts: string[];
}

// Season utilities
export function getCurrentSeason(): 'kharif' | 'rabi' | 'zaid' {
  const month = new Date().getMonth() + 1; // 1-12
  
  if (month >= 6 && month <= 10) return 'kharif'; // June-October
  if (month >= 11 || month <= 3) return 'rabi'; // November-March
  return 'zaid'; // April-May
}

export function getSeasonMonths(season: 'kharif' | 'rabi' | 'zaid'): number[] {
  const seasons = {
    kharif: [6, 7, 8, 9, 10],
    rabi: [11, 12, 1, 2, 3],
    zaid: [4, 5]
  };
  return seasons[season];
}

export function isPlantingSeason(product: { seasonality?: SeasonalInfo }): boolean {
  if (!product.seasonality) return true;
  
  const currentMonth = new Date().getMonth() + 1;
  return product.seasonality.plantingMonths.includes(currentMonth);
}

// Batch traceability
export function generateBatchNumber(prefix: string = 'BATCH'): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${month}${random}`;
}

export function generateQRCodeData(batch: BatchInfo): string {
  return JSON.stringify({
    batch: batch.batchNumber,
    mfg: batch.manufacturingDate,
    exp: batch.expiryDate,
    lot: batch.lotSize,
    warehouse: batch.warehouseLocation,
    verified: true
  });
}

// Expiry management
export function getExpiryStatus(expiryDate: string): {
  status: 'fresh' | 'near-expiry' | 'expired';
  daysRemaining: number;
  action: string;
} {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysRemaining = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return { status: 'expired', daysRemaining, action: 'Remove from inventory' };
  }
  if (daysRemaining <= 7) {
    return { status: 'near-expiry', daysRemaining, action: 'Urgent sale/discount' };
  }
  if (daysRemaining <= 30) {
    return { status: 'near-expiry', daysRemaining, action: 'Prioritize sale' };
  }
  return { status: 'fresh', daysRemaining, action: 'Normal inventory' };
}

export function calculateMarkdownPrice(
  originalPrice: number,
  expiryDate: string
): { price: number; discount: number } {
  const { daysRemaining } = getExpiryStatus(expiryDate);
  
  let discount = 0;
  if (daysRemaining <= 7) {
    discount = 30; // 30% off
  } else if (daysRemaining <= 15) {
    discount = 20; // 20% off
  } else if (daysRemaining <= 30) {
    discount = 10; // 10% off
  }

  const price = originalPrice * (1 - discount / 100);
  return { price: Math.round(price * 100) / 100, discount };
}

// Quality certification
export function validateSeedCertification(cert: SeedCertification): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const today = new Date();
  const expiry = new Date(cert.expiryDate);

  if (expiry < today) {
    issues.push('Certification expired');
  }

  if (cert.germinationRate < 70) {
    issues.push('Low germination rate (minimum 70% required)');
  }

  if (cert.purityPercentage < 98) {
    issues.push('Low purity percentage (minimum 98% required)');
  }

  if (cert.moistureContent && cert.moistureContent > 12) {
    issues.push('High moisture content (maximum 12% allowed)');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

// MSP tracking
export const MSP_DATA_2024: MSPInfo[] = [
  {
    crop: 'Paddy (Common)',
    season: 'Kharif',
    year: 2024,
    mspPrice: 2183,
    effectiveFrom: '2024-06-01',
    effectiveTo: '2024-10-31'
  },
  {
    crop: 'Wheat',
    season: 'Rabi',
    year: 2024,
    mspPrice: 2275,
    effectiveFrom: '2024-11-01',
    effectiveTo: '2025-03-31'
  },
  {
    crop: 'Maize',
    season: 'Kharif',
    year: 2024,
    mspPrice: 2090,
    effectiveFrom: '2024-06-01',
    effectiveTo: '2024-10-31'
  }
];

export function getMSPForCrop(cropName: string, season: string): MSPInfo | null {
  const msp = MSP_DATA_2024.find(
    m => m.crop.toLowerCase().includes(cropName.toLowerCase()) && 
         m.season.toLowerCase() === season.toLowerCase()
  );
  return msp || null;
}

// ABC Analysis for inventory classification
export function calculateABCClassification(items: Array<{
  id: string;
  value: number;
}>): Array<{ id: string; classification: 'A' | 'B' | 'C'; valuePercentage: number }> {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const totalValue = sorted.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  return sorted.map(item => {
    const valuePercentage = (item.value / totalValue) * 100;
    cumulativePercentage += valuePercentage;
    
    let classification: 'A' | 'B' | 'C';
    if (cumulativePercentage <= 70) {
      classification = 'A'; // Top 70% value
    } else if (cumulativePercentage <= 90) {
      classification = 'B'; // Next 20% value
    } else {
      classification = 'C'; // Last 10% value
    }
    
    return { id: item.id, classification, valuePercentage };
  });
}
