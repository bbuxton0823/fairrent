import { useState, useEffect } from 'react';

interface Property {
  address: string;
  rent: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  bedrooms: number;
  fullBaths: number;
  halfBaths: number;
  utilities: {
    heatingFuel: string;
    cookingFuel: string;
    hotWater: string;
    otherElectricity: string;
    coolingSystem: string;
  };
  amenities: string[];
  quality: string;
}

interface Adjustment {
  category: string;
  amount: number;
  explanation: string;
  confidence: number;
}

interface ComparableProperty extends Property {
  similarity: number;
  credibility: number;
  adjustments: Adjustment[];
  adjustedRent: number;
  distance: number;
}

interface ComparableAnalysisProps {
  subjectProperty: Property;
  comparableProperties: ComparableProperty[];
}

const ADJUSTMENT_WEIGHTS = {
  sqft: 0.20,
  bedrooms: 0.15,
  bathrooms: 0.15,
  propertyType: 0.12,
  yearBuilt: 0.10,
  utilities: 0.10,
  amenities: 0.08,
  location: 0.10
};

interface QualityCondition {
  value: string;
  label: string;
  multiplier: number;
  recentRemodel: boolean;
}

const QUALITY_CONDITIONS: Record<string, QualityCondition> = {
  excellent: { value: 'excellent', label: 'Excellent', multiplier: 1.1, recentRemodel: true },
  good: { value: 'good', label: 'Good', multiplier: 1.0, recentRemodel: false },
  fair: { value: 'fair', label: 'Fair', multiplier: 0.9, recentRemodel: false },
  poor: { value: 'poor', label: 'Poor', multiplier: 0.8, recentRemodel: false },
  unknown: { value: 'unknown', label: 'Unknown', multiplier: 1.0, recentRemodel: false }
};

export default function ComparableAnalysis({ 
  subjectProperty,
  comparableProperties 
}: ComparableAnalysisProps) {
  const [adjustedComparables, setAdjustedComparables] = useState<ComparableProperty[]>([]);
  const [estimatedRent, setEstimatedRent] = useState<number>(0);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);

  useEffect(() => {
    calculateAdjustments();
  }, [subjectProperty, comparableProperties]);

  const calculateAgeAdjustment = (
    subjectYear: number,
    compYear: number,
    subjectQuality: string,
    compQuality: string,
    baseRent: number
  ): { adjustment: number; confidence: number; explanation: string } => {
    const currentYear = new Date().getFullYear();
    const subjectAge = currentYear - subjectYear;
    const compAge = currentYear - compYear;
    const ageDiff = subjectAge - compAge;

    // Base adjustment rate (0.5% of rent per year of age difference)
    const baseAdjustmentRate = baseRent * 0.005;
    
    // Age impact diminishes exponentially over time
    const ageImpact = Math.sign(ageDiff) * Math.log10(Math.abs(ageDiff) + 1) * baseAdjustmentRate;

    // Quality condition impact
    const subjectCondition = QUALITY_CONDITIONS[subjectQuality || 'unknown'];
    const compCondition = QUALITY_CONDITIONS[compQuality || 'unknown'];
    
    // Calculate quality multiplier difference
    const qualityDiff = subjectCondition.multiplier - compCondition.multiplier;
    const qualityImpact = baseRent * qualityDiff;

    // Additional adjustment for recent remodels
    const remodelImpact = subjectCondition.recentRemodel && !compCondition.recentRemodel ? 
      baseRent * 0.05 : // 5% boost for recent remodel
      compCondition.recentRemodel && !subjectCondition.recentRemodel ? 
      -baseRent * 0.05 : 0;

    const totalAdjustment = ageImpact + qualityImpact + remodelImpact;

    // Calculate confidence based on available data
    let confidence = 0.85; // Base confidence
    if (subjectQuality === 'unknown' || compQuality === 'unknown') {
      confidence *= 0.8; // Reduce confidence if quality is unknown
    }
    if (!subjectYear || !compYear) {
      confidence *= 0.7; // Reduce confidence if year built is missing
    }

    // Build explanation
    let explanation = '';
    if (ageDiff !== 0) {
      explanation += `${Math.abs(ageDiff)} years ${ageDiff > 0 ? 'older' : 'newer'}`;
    }
    if (qualityDiff !== 0) {
      if (explanation) explanation += ', ';
      explanation += `${subjectCondition.label} vs ${compCondition.label}`;
    }
    if (remodelImpact !== 0) {
      if (explanation) explanation += ', ';
      explanation += remodelImpact > 0 ? 'recently remodeled' : 'comp recently remodeled';
    }

    return {
      adjustment: totalAdjustment,
      confidence,
      explanation: explanation || 'Similar age and condition'
    };
  };

  const calculateAdjustments = () => {
    const adjusted = comparableProperties.map(comp => {
      const adjustments: Adjustment[] = [];
      let totalAdjustment = 0;
      let totalConfidence = 0;

      // Square Footage Adjustment
      if (comp.sqft && subjectProperty.sqft) {
        const sqftDiff = subjectProperty.sqft - comp.sqft;
        const sqftAdjustment = calculateSqftAdjustment(sqftDiff, comp.rent);
        adjustments.push({
          category: 'Square Footage',
          amount: sqftAdjustment,
          explanation: `${Math.abs(sqftDiff)} sqft ${sqftDiff > 0 ? 'larger' : 'smaller'}`,
          confidence: 0.9
        });
        totalAdjustment += sqftAdjustment;
        totalConfidence += ADJUSTMENT_WEIGHTS.sqft * 0.9;
      }

      // Bedroom Adjustment
      if (comp.bedrooms && subjectProperty.bedrooms) {
        const bedroomDiff = subjectProperty.bedrooms - comp.bedrooms;
        const bedroomAdjustment = bedroomDiff * 200; // $200 per bedroom
        adjustments.push({
          category: 'Bedrooms',
          amount: bedroomAdjustment,
          explanation: `${Math.abs(bedroomDiff)} bedroom ${bedroomDiff > 0 ? 'more' : 'less'}`,
          confidence: 0.95
        });
        totalAdjustment += bedroomAdjustment;
        totalConfidence += ADJUSTMENT_WEIGHTS.bedrooms * 0.95;
      }

      // Bathroom Adjustment
      const fullBathDiff = (subjectProperty.fullBaths || 0) - (comp.fullBaths || 0);
      const halfBathDiff = (subjectProperty.halfBaths || 0) - (comp.halfBaths || 0);
      
      if (fullBathDiff !== 0 || halfBathDiff !== 0) {
        // Calculate base adjustment rate (about 4% of rent per full bath)
        const baseAdjustmentRate = comp.rent * 0.04;
        
        // Full baths are worth 100% of base rate, half baths are worth 40%
        const bathAdjustment = (fullBathDiff * baseAdjustmentRate) + 
                             (halfBathDiff * baseAdjustmentRate * 0.4);
        
        let explanation = '';
        if (fullBathDiff !== 0) {
          explanation += `${Math.abs(fullBathDiff)} full bath${Math.abs(fullBathDiff) !== 1 ? 's' : ''} ${fullBathDiff > 0 ? 'more' : 'less'}`;
        }
        if (halfBathDiff !== 0) {
          if (explanation) explanation += ', ';
          explanation += `${Math.abs(halfBathDiff)} half bath${Math.abs(halfBathDiff) !== 1 ? 's' : ''} ${halfBathDiff > 0 ? 'more' : 'less'}`;
        }

        adjustments.push({
          category: 'Bathrooms',
          amount: bathAdjustment,
          explanation,
          confidence: 0.9
        });

        totalAdjustment += bathAdjustment;
        totalConfidence += ADJUSTMENT_WEIGHTS.bathrooms * 0.9;
      }

      // Age and Quality Adjustment
      if (subjectProperty.yearBuilt || comp.yearBuilt) {
        const ageAdjustment = calculateAgeAdjustment(
          subjectProperty.yearBuilt,
          comp.yearBuilt,
          subjectProperty.quality,
          comp.quality,
          comp.rent
        );

        adjustments.push({
          category: 'Age/Condition',
          amount: ageAdjustment.adjustment,
          explanation: ageAdjustment.explanation,
          confidence: ageAdjustment.confidence
        });

        totalAdjustment += ageAdjustment.adjustment;
        totalConfidence += ADJUSTMENT_WEIGHTS.yearBuilt * ageAdjustment.confidence;
      }

      // More adjustments will be added here...

      const adjustedRent = comp.rent + totalAdjustment;
      const similarity = calculateSimilarity(comp, subjectProperty);
      const credibility = totalConfidence / Object.values(ADJUSTMENT_WEIGHTS).reduce((a, b) => a + b, 0);

      return {
        ...comp,
        adjustments,
        adjustedRent,
        similarity,
        credibility: credibility * 100 // Convert to percentage
      };
    });

    setAdjustedComparables(adjusted);
    calculateEstimatedRent(adjusted);
  };

  const calculateSqftAdjustment = (sqftDiff: number, baseRent: number): number => {
    // Logarithmic scaling for square footage differences
    const adjustmentRate = baseRent / 1000; // Base adjustment rate per sqft
    return Math.log10(Math.abs(sqftDiff) + 1) * adjustmentRate * Math.sign(sqftDiff);
  };

  const calculateSimilarity = (comp: ComparableProperty, subject: Property): number => {
    // Implement similarity calculation based on weighted differences
    // This will be expanded with more sophisticated logic
    return 0.85; // Placeholder
  };

  const calculateEstimatedRent = (comparables: ComparableProperty[]) => {
    // Weight each comparable by its credibility score
    const weightedRents = comparables.map(comp => ({
      rent: comp.adjustedRent,
      weight: comp.credibility / 100
    }));

    const totalWeight = weightedRents.reduce((sum, item) => sum + item.weight, 0);
    const weightedAverage = weightedRents.reduce((sum, item) => 
      sum + (item.rent * item.weight), 0) / totalWeight;

    setEstimatedRent(Math.round(weightedAverage));
    setConfidenceScore(Math.round((totalWeight / comparables.length) * 100));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comparable Analysis
      </h2>

      {/* Subject Property Card */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Subject Property
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Address:</span>
            <p className="font-medium text-gray-900 dark:text-white">{subjectProperty.address}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Requested Rent:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              ${subjectProperty.rent.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Square Feet:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {subjectProperty.sqft.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Type:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {subjectProperty.propertyType}
            </p>
          </div>
        </div>
      </div>

      {/* Comparable Properties */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comparable Properties
        </h3>
        {adjustedComparables.map((comp, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Address:</span>
                <p className="font-medium text-gray-900 dark:text-white">{comp.address}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Original Rent:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  ${comp.rent.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Adjusted Rent:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  ${comp.adjustedRent.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Similarity:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {comp.similarity.toFixed(1)}%
                </p>
              </div>
            </div>
            
            {/* Adjustments */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Adjustments
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comp.adjustments.map((adj, adjIndex) => (
                  <div key={adjIndex} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {adj.category}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${adj.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Analysis */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Estimated Market Rent
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Estimated Rent:</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${estimatedRent.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Confidence Score:</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {confidenceScore}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 